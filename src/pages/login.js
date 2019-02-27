import React, { Component } from 'react';
import { Platform, Alert, Image, AsyncStorage } from 'react-native';
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
  Form,
  Label,
} from 'native-base';
import moment from 'moment';
import axios from "../axios";
import ImagePicker from 'react-native-image-crop-picker'

export default class FloatingLabelExample extends Component {


  constructor(props) {

    super(props);

    this.state = {
      localsenha: { user: '', senha: '' }
    }
  }

  salvar = async () => {

    await axios.get('corrida/userscpf/' + this.state.localsenha.user).then((response) => {
      console.log(response.data)
      if (response.data.length >= 1) {
        if (this.state.localsenha.user == response.data[0].cpf) {
          if (this.state.localsenha.senha == response.data[0].senha) {
            try {
              AsyncStorage.setItem('@user:session', response.data[0].id.toString());
              AsyncStorage.setItem('@senha:session', response.data[0].senha.toString());
              this.props.navigation.navigate('conta')

            } catch (error) {
              console.log(error)
            }
          } else {
            Alert.alert(
              'Atenção',
              'Você errou a senha!', [
                { text: 'Tentar Novamente' },
              ], { cancelable: false },
            );
          }
        }
      } else {
        alert('Nenhum atleta com esse CPF foi encontrado!')
      }

    }).catch(error => {
      console.log(error)
    })
  }

  render() {

    atualizar = this.atualizar

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Login de Atleta</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
            <Icon style={{ fontSize: 150, color: '#d9d9d9', position: 'absolute' }} type='FontAwesome5' name='running' />
            <Icon style={{ fontSize: 150, color: '#808080' }} type='FontAwesome5' name='running' />
            <Icon style={{ fontSize: 150, color: 'black' }} type='FontAwesome5' name='running' />
          </View>
          <Form>
            <Item style={{ margin: 30 }}>
              <Icon active type='FontAwesome5' name='file-signature' />
              <Input keyboardType='numeric' maxLength={11} onChangeText={(text) => { this.state.localsenha.user = text }} placeholder={'CPF do Atleta'} />
            </Item>
            <Item>
              <Icon active type='FontAwesome5' name='key' />
              <Input secureTextEntry={true} onChangeText={(text) => { this.state.localsenha.senha = text }} placeholder='Digite sua senha!' />
            </Item>
          </Form>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button style={{ margin: 30, alignSelf: 'center' }} onPress={this.salvar} ><Text>Entrar</Text></Button>
            <Button transparent style={{ marginTop: 30 }} block onPress={() => this.props.navigation.navigate('cadastroUser')} ><Text note>Ainda não tem cadastro? Cadastre-se Aqui!</Text></Button>
          </View>
        </Content>

        <Footer>
          <FooterTab>
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