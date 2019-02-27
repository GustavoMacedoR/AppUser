import React, { Component } from 'react';
import { Platform, Image, AsyncStorage } from 'react-native';
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
  ListItem,
} from 'native-base';
import moment, { now } from 'moment';
import axios from "../axios";
import ImagePicker from 'react-native-image-crop-picker'

export default class IconTextboxExample extends Component {

  constructor(props) {
    super(props);

    // console.log("iu",props.navigation)
    this.state = {
      nome: "none",
      Data: "none",
      cpf: "none",
      senha: "none",
      senhaR: "none",
      grupo: "0",
      admin: "0",
      sexo: "none",
      pedido: '0'
      //change: false
    };

    this.select = {
      atual: '',
      lista: { 'M': { _id: 'M', nome: 'MASCULINO' }, 'F': { _id: 'F', nome: 'FEMININO' } }
    }


    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ Data: newDate.toString() });
  }

  TestaCPF(strCPF) {
    var Soma
    var Resto
    Soma = 0
    if (strCPF == '00000000000') return false
    if (strCPF == '11111111111') return false
    if (strCPF == '22222222222') return false
    if (strCPF == '33333333333') return false
    if (strCPF == '44444444444') return false
    if (strCPF == '55555555555') return false
    if (strCPF == '66666666666') return false
    if (strCPF == '77777777777') return false
    if (strCPF == '88888888888') return false
    if (strCPF == '99999999999') return false
    for (var i = 1; i <= 9; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
    }
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(strCPF.substring(9, 10))) return false

    Soma = 0
    for (i = 1; i <= 10; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
    }
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(strCPF.substring(10, 11))) return false
    return true
  }

  salvar = async () => {

    if (this.state.NomeCorrida != "none" &&
      this.state.Data != "none" &&
      this.state.percurso != "none" &&
      this.state.local != "none" &&
      this.state.sexo != "none" &&
      this.state.cpf != "none"
    ) {

      var strCPF = this.state.cpf.toString()
      console.log(strCPF)
      if (this.TestaCPF(strCPF)) {
        if (this.state.senha == this.state.senhaR) {

          var body = {
            nome: this.state.nome,
            cpf: this.state.cpf,
            Data: this.state.Data,
            senha: this.state.senha,
            grupo: "0",
            admin: "0",
            sexo: this.state.sexo,
            pedido: '0'
          }

          try {
            await axios.post('corrida/salvarUser', body).then(function (response) {
              console.log(response.data);
              try {
                AsyncStorage.setItem('@user:session', response.data.toString());
                //AsyncStorage.setItem('@senha:session', this.state.senha.toString());

              } catch (error) {
                console.log(error)
              }

            })
            //this.props.navigation.state.params.retorno();
            //this.state.change = false;
            this.props.navigation.navigate('conta')
            //this.props.navigation.navigate('eventos');
          } catch (error) {
            console.log(error)
          }
        }else{
          alert("As senhas não coincidem!");
        }
      } else {
        alert("O número do CPF tem algum erro!");
      }
    } else {
      alert("Todos os campos dessa tela são obrigatórios!");
    }
  }

  makedata = () => {

    var placeholder = "selecione a sua data de nascimento!"

    return (<DatePicker style={{ flex: 1, alignContent: 'flex-start' }}
      defaultDate={new Date(moment().format('DD/MM/YYYY'))}
      minimumDate={new Date('01, 01, 1940')}
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

  render() {
    //console.log(this.state)

    return (
      <Container style={{backgroundColor:'#E8E8E8'}}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('eventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Cadastro de Atleta</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
            <Icon style={{ fontSize: 150, color: 'grey' }} type='FontAwesome5' name='user-alt' />
          </View>
          <View >
            <Item>
              <Icon active type='FontAwesome5' name='file-signature' />
              <Input onChangeText={(text) => { this.state.nome = text }} placeholder={'Nome do Atleta'} />
            </Item>
            <Item style={{ alignContent: 'flex-start' }}>
              <Icon type='FontAwesome5' name='calendar-alt' />
              {this.makedata()}
            </Item>
            <Item>
              <Icon active type='FontAwesome5' name='id-card' />
              <Input keyboardType='numeric' onChangeText={(text) => { this.state.cpf = text }} maxLength={11} placeholder='Informe seu CPF!' />
            </Item>
            <Item>
              {Object.keys(this.select.lista).map(key => {
                const item = this.select.lista[key]
                return (
                  <Item
                    key={item._id}>
                    <Button transparent onPress={() => { this.select.atual = item, this.setState({ sexo: item.nome }) }} light={this.select.atual != item}>
                      <Icon name='ios-checkmark-circle' />
                      <Text>{item.nome}</Text>
                    </Button>
                  </Item>
                )
              })}
            </Item>
            <Item>
              <Icon active type='FontAwesome5' name='key' />
              <Input secureTextEntry={true} onChangeText={(text) => { this.state.senha = text }} placeholder='Crie uma senha!' />
            </Item>
            <Item>
              <Icon active type='FontAwesome5' name='redo-alt' />
              <Input secureTextEntry={true} onChangeText={(text) => { this.state.senhaR = text }} onEndEditing={() => { if (this.state.senha == this.state.senhaR) { console.log("ok") } else { alert("Senhas não coincidem!") } }} maxLength={30} placeholder='Repita a senha!' />
            </Item>

          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button style={{ margin: 20, alignSelf: 'center' }} onPress={this.salvar} ><Text>Cadastrar</Text></Button>
          </View>
        </Content>

        <Footer>
          <FooterTab >
            <Button vertical onPress={() => this.props.navigation.navigate('treinos')}>
              <Icon type='FontAwesome5' name='running' style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Treinos</Text>
            </Button>
            <Button vertical onPress={() => this.props.navigation.navigate('eventos')}>
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