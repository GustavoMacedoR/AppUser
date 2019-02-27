import React, { Component } from 'react';
import { Platform, Alert, Image, TextInput, AsyncStorage, NetInfo } from 'react-native'
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Title,
  Right,
  List,
  ListItem,
  Fab,
  Footer,
  FooterTab,
  View
} from 'native-base';
import axios from "../axios"
import fonts from '../styles/fonts';
import SCREEN_IMPORT from 'Dimensions';
import moment from 'moment';
// import { TextInput } from 'react-native-gesture-handler';

const SCREEN_WIDTH = SCREEN_IMPORT.get('window').width;
const SCREEN_HEIGHT = SCREEN_IMPORT.get('window').height;

function MiniOfflineSign() {
  return (
    <View style={{
      backgroundColor: '#b52424',
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: SCREEN_WIDTH,
      position: 'relative',
    }}>
      <Text style={{ color: '#fff' }}>Sem Conexão com a internet</Text>
    </View>
  );
}

class MakeStringInf extends Component {

  hide = () => {
    this._textInput.setNativeProps({ text: "  " + this.props.texto })
    this._textInput2.setNativeProps({ text: "" })
  }

  render() {
    // this.props.hide = false
    return (
      <View style={{ display: "flex" }}>
        <Icon style={{ flex: 1 }} name="ios-information-circle" />
        <TextInput multiline={true} noBoder editable={false} defaultValue={"  " + this.props.texto.toString().substr(0, 250)} ref={Component => this._textInput = Component} style={{ color: 'black', paddingBottom: 0, padding: 0, margin: 0 }}></TextInput>

        {this.props.texto.toString().length > 250 &&
          <Button transparent style={{ flexDirection: 'row', paddingBottom: 0, paddingTop: 0, height: 35 }} onPress={this.hide}><TextInput noBoder editable={false} note defaultValue={"ver mais..."} ref={Component2 => this._textInput2 = Component2}></TextInput></Button>
        }
      </View>
    )
  }
}

export default class eventos extends Component {

  constructor(props) {

    super(props);

    this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {
      this.atualizar()
    });


    this.state = {
      listEvents: [],
      isConnected: true
    }
  }

  componentWillMount() {
    this.reRenderSomething;
    //this.atualizar()
  }

  atualizar = async () => {

    await axios.get('corrida/eventos').then((response) => {
      this.setState({ listEvents: response.data, isConnected:true }), console.log(response.data)
    }).catch(error => {
      this.setState({isConnected:false})
    })
  }

  irTreinos = () => {
    console.log(this.props.navigation.state)
    var keyTela = this.props.navigation.getParam('key', 'Nkey');
    if(keyTela == 'Nkey'){    
      this.props.navigation.navigate('treinos')
    }else{
      this.props.navigation.push('treinos')
  }
}

  irUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@user:session');
      if (value !== null) {
        this.props.navigation.navigate('conta')
      } else {
        this.props.navigation.navigate('login')
      }
    } catch (error) {
      // Error retrieving data
    }

  }

  render() {

    atualizar = this.atualizar

    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Corridas</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => { AsyncStorage.clear(), Alert.alert('Informação', 'Usuário deslogado!') }}>
              <Icon type='FontAwesome5' name="user-slash" style={{ color: 'white' }} />
            </Button>
          </Right>
        </Header>

        {!this.state.isConnected && <MiniOfflineSign/>}

        <Content padder={false}>
          {this.state.listEvents.map(function (params, index) {
            return (
              <View key={index}>
                <Image source={{ uri: "http://10.0.2.2:3000/image/get?image_name=" + params.fotoNome }} style={{ height: 400, width: null, flex: 1 }} />
                <ListItem noBorder>
                  <Body>
                    <Text style={{ color: 'black', fontSize: fonts.bigger, fontStyle: 'italic', fontWeight: 'bold' }}>{params.NomeCorrida}</Text>
                    <Text style={{ color: 'black', fontSize: fonts.big }}>{moment(params.Data).format('DD/MM/YYYY')}</Text>
                  </Body>
                </ListItem>
                <ListItem noBorder style={{ marginLeft: 20, marginRight: 20, marginTop: 10, paddingRight: 0, paddingBottom: 0 }}>
                  {params.Informacoes &&
                    <View>
                      <MakeStringInf hide={false} texto={params.Informacoes} />
                    </View>
                  }
                </ListItem>
                <ListItem noBorder style={{ paddingTop: 0 }}>
                  <Icon name="ios-navigate" />
                  <Text>{"  " + params.percurso}</Text>
                </ListItem>
                <ListItem noBorder>
                  <Icon name="ios-pin" style={{ fontSize: 30 }} />
                  <Text>{"  " + params.local}</Text>
                </ListItem>
              </View>
            )
          })}

        </Content>

        {/* <Fab
          style={{ backgroundColor: '#5067FF',marginVertical:50 }}
          position="bottomRight"
          onPress={this.irCadastro}>
          <Icon name="md-add" />
        </Fab> */}

        <Footer>
          <FooterTab>
            <Button vertical onPress={this.irTreinos}>
              <Icon type='FontAwesome5' name='running' style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Treinos</Text>
            </Button>
            <Button style={{ borderTopWidth: 5, borderColor: '#7ED321' }} vertical>
              <Icon type='FontAwesome5' name="calendar" style={{ color: '#7ED321' }} />
              <Text style={{ color: '#7ED321' }}>Corridas</Text>
            </Button>
            <Button vertical onPress={this.irUser}>
              <Icon name="person" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Conta</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
