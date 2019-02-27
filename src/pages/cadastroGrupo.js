import React, { Component } from 'react';
import { Platform, Image } from 'react-native';
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Text,
  DatePicker,
  Left,
  Title,
  Body,
  Right,
  Thumbnail,
  Fab,
  Footer,
  FooterTab,
  View,
} from 'native-base';
import moment from 'moment';
import axios from "../axios";
import ImagePicker from 'react-native-image-crop-picker'

export default class IconTextboxExample extends Component {

  constructor(props) {
    super(props);

    // console.log("iu",props.navigation)
    this.state = {
      NomeCorrida: "none",
      fotoNome: "",
      Data: "none",
      Informacoes: "Sem Informações adicionais",
      percurso: "none",
      local: "none",
      idGrupo: 0,
      photo: { uri: "", width: 300, height: 300, name: "default.jpg", type: 'new' },
      change: false
    };


    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ Data: newDate.toString() });
  }

  async componentDidMount() {

    var eventoid = this.props.navigation.getParam('id', 'NO-ID');
    var grupoid = this.props.navigation.getParam('idG', 'NO-ID');

    this.setState({
      idGrupo: grupoid
    })

    if (eventoid != 'NO-ID') {
      await this.setState({
        NomeCorrida: eventoid.NomeCorrida,
        fotoNome: eventoid.fotoNome,
        Data: eventoid.data,
        Informacoes: eventoid.informacoes,
        percurso: eventoid.percurso,
        local: eventoid.local,
        idGrupo: eventoid.idGrupo,
        photo: { uri: "", width: 300, height: 300, name: eventoid.fotoNome, type: 'new' },
      })
      console.log(eventoid);
    }
  }

  handleChoosePhoto = () => {

    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeExif: true,
      mediaType: 'photo',
      hideBottomControls: true,
      enableRotationGesture: true
    }).then(image => {
      this.setState({
        photo: { uri: image.path, width: image.width, height: image.height, name: image.path.toString().substr(-40), type: image.mime },
        change: true
      })
    })
  }

  irTreinos = () => {
    this.props.navigation.navigate('treinos')
  }

  irEventos = () => {
    this.props.navigation.navigate('eventos')
  }

  createFormData = (photo, body) => {
    const data = new FormData();

    //console.log(photo.name)

    data.append("photo", {
      name: photo.name,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    //console.log(data)
    return data;
  }

  handleUploadPhoto = () => {
    if (this.state.photo.uri != "") {
      axios.post('image/upload', this.createFormData(this.state.photo, { userId: "123" }), {})
        .then(response => {
          //console.log("upload succes", response);
          //alert("Upload success!");
          //this.setState({ photo: { uri: "", width: 300, height: 300, name: "default.jpg", type: 'new' } });
        })
        .catch(error => {
          console.log("upload error", error);
        });
    }
  };

  salvar = async () => {

    if (this.state.NomeCorrida != "none" && this.state.Data != "none" && this.state.percurso != "none" && this.state.local != "none") {

      var body = {
        NomeCorrida: this.state.NomeCorrida,
        fotoNome: this.state.photo.name,
        Data: this.state.Data,
        Informacoes: this.state.Informacoes,
        percurso: this.state.percurso,
        local: this.state.local,
        idGrupo: this.state.idGrupo
      }

      try {
        await axios.post('corrida/salvarTreinos', body).then(function (response) {
          console.log(response.data)
        })
        this.handleUploadPhoto()
        //this.props.navigation.state.params.retorno();
        //this.state.change = false;
        this.props.navigation.navigate('conta');
      } catch (error) {
        console.log(error)
      }

    } else {
      alert("Os campos Nome, Data, Percurso e Local, são obrigatórios!");
    }

  }

  makedata = (itemID) => {
    var eventoid = this.props.navigation.getParam('id', 'NO-ID');
    var placeholder = "selecione a data"

    if (itemID != 'NO-ID') {
      placeholder = moment(eventoid.data.substr(0, 10)).format('DD/MM/YYYY')
    }

    return (<DatePicker style={{ flex: 1, alignContent: 'flex-start' }}
      defaultDate={new Date(moment().format('DD/MM/YYYY'))}
      minimumDate={new Date('01, 01, 2018')}
      maximumDate={new Date('31, 12, 2019')}
      locale={"pt-BR"}
      timeZoneOffsetInMinutes={undefined}
      modalTransparent={false}
      animationType={"fade"}
      androidMode={"default"}
      placeHolderText={placeholder}
      textStyle={{ color: "green" }}
      placeHolderTextStyle={{ color: "#d3d3d3" }}
      formatChosenDate={date => { return moment(date).format('DD/MM/YYYY'); }}
      onDateChange={date => {
        return this.setState({ Data: moment(date).format('YYYY-MM-DD') })
      }}
    />)

  }

  atualizar = async () => {
    var eventoid = this.props.navigation.getParam('id', 'NO-ID');

    if (this.state.NomeCorrida != "none" && this.state.Data != "none" && this.state.percurso != "none" && this.state.local != "none") {

      var body = {
        NomeCorrida: this.state.NomeCorrida,
        fotoNome: this.state.photo.name,
        data: this.state.Data.substr(0, 10),
        informacoes: this.state.Informacoes,
        percurso: this.state.percurso,
        local: this.state.local,
        idGrupo: this.state.idGrupo
      }

      try {
        await axios.patch('corrida/updateTreinos/' + eventoid.id, body)
        this.handleUploadPhoto()
        //this.props.navigation.state.params.retorno();
        //this.state.change = false;
        this.props.navigation.navigate('conta');
      } catch (error) {
        console.log(error)
      }

    } else {
      alert("Os campos Nome, Data, Percurso e Local, são obrigatórios!");
    }

  }

  render() {

    const itemId = this.props.navigation.getParam('id', 'NO-ID');
    //console.log(this.state)

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('conta')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            {itemId == 'NO-ID' && <Title>Cadastro de treino</Title>}
            {itemId != 'NO-ID' && <Title>Editar treino</Title>}
          </Body>
          <Right />
        </Header>
        <Content>
          <View >
            {this.state.change && (
              <Image source={{ uri: this.state.photo.uri }} style={{ height: 400, width: null }} />
            )}

            {!this.state.change && itemId == 'NO-ID' && (
              <Image source={require('../images/default.jpg')} style={{ height: 400, width: null }} />
            )}

            {!this.state.change && itemId != 'NO-ID' && (
              <Image source={{ uri: "http://10.0.2.2:3000/image/get?image_name=" + this.state.fotoNome }} style={{ height: 400, width: null }} />
            )}
            <Fab
              style={{ backgroundColor: '#5067FF' }}
              position="topRight"
              onPress={this.handleChoosePhoto}>
              <Icon name="image" />
            </Fab>
            <Item>
              <Icon active name='ios-paper' />
              {itemId != 'NO-ID' && <Input onChangeText={(text) => { this.state.NomeCorrida = text }} placeholder={this.state.NomeCorrida} />}
              {itemId == 'NO-ID' && <Input onChangeText={(text) => { this.state.NomeCorrida = text }} placeholder={'Nome do Evento'} />}
            </Item>
            <Item style={{ alignContent: 'flex-start' }}>
              <Icon active name='ios-calendar' />
              {this.makedata(itemId)}
            </Item>
            <Item>
              <Icon active name='ios-information-circle' />
              {itemId == 'NO-ID' && <Input onChangeText={(text) => { this.state.Informacoes = text }} placeholder='Informações' />}
              {itemId != 'NO-ID' && <Input onChangeText={(text) => { this.state.Informacoes = text }} placeholder={this.state.Informacoes} />}
            </Item>
            <Item>
              <Icon active name='ios-navigate' />
              {itemId == 'NO-ID' && <Input onChangeText={(text) => { this.state.percurso = text }} placeholder='Distancia do percurso' />}
              {itemId != 'NO-ID' && <Input onChangeText={(text) => { this.state.percurso = text }} placeholder={this.state.percurso} />}
            </Item>
            <Item>
              <Icon active name='ios-pin' />
              {itemId == 'NO-ID' && <Input onChangeText={(text) => { this.state.local = text }} maxLength={30} placeholder='Local do Evento' />}
              {itemId != 'NO-ID' && <Input onChangeText={(text) => { this.state.local = text }} maxLength={30} placeholder={this.state.local} />}
            </Item>

          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {itemId == 'NO-ID' && <Button style = {{margin:30, alignSelf: 'center'}} onPress={this.salvar} ><Text>salvar</Text></Button>}
            {itemId != 'NO-ID' && <Button style = {{margin:30, alignSelf: 'center'}} onPress={this.atualizar} ><Text>Atualizar</Text></Button>}
          </View>
        </Content>

        <Footer>
          <FooterTab>
            <Button vertical onPress={this.irTreinos}>
              <Icon type='FontAwesome5' name='running' style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Treinos</Text>
            </Button>
            <Button vertical onPress={this.irEventos}>
              <Icon type='FontAwesome5' name="calendar" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Corridas</Text>
            </Button>
            <Button vertical style={{ borderTopWidth: 5, borderColor: '#7ED321' }}>
              <Icon name="person" style={{ color: '#7ED321' }} />
              <Text style={{ color: '#7ED321' }}>Conta</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}