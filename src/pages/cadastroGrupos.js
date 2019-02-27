import React, { Component } from 'react';
import { Platform, Image, AsyncStorage} from 'react-native';
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
            nomeGrupo: "none",
            admin: 0,
            fotoNome: "",
            photo: { uri: "", width: 300, height: 300, name: "default.jpg", type: 'new' },
            change: false
        };
    }

    componentDidMount() {
        this.reRenderSomething;
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

        if (this.state.nomeGrupo != "none") {

            const valor = await AsyncStorage.getItem('@user:session');
                this.setState({ admin: valor })
                console.log(this.state)

            var body = {
                nomeGrupo: this.state.nomeGrupo,
                admin: this.state.admin,
                fotoNome: this.state.photo.name,
            }

            try {
                await axios.post('corrida/salvarGrupos', body).then(function (response) {
                    var grupoV = {
                        grupo:response.data,
                        admin:"1"            
                    }
                    console.log(response.data)
                    axios.patch('corrida/grupdate/' + body.admin,grupoV)
                })
                
                this.handleUploadPhoto()
                this.props.navigation.navigate('conta');
                //this.props.navigation.state.params.retorno();
                //this.state.change = false;
            } catch (error) {
                console.log(error)
            }

        } else {
            alert("Você deve colocar um nome no seu Grupo!");
        }

    }

    render() {

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('eventos')}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Cadastro de Grupo</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <View >
                        {this.state.change && (
                            <Image source={{ uri: this.state.photo.uri }} style={{ height: 400, width: null }} />
                        )}

                        {!this.state.change && (
                            <Image source={require('../images/default.jpg')} style={{ height: 400, width: null }} />
                        )}
                        <Fab
                            style={{ backgroundColor: '#5067FF' }}
                            position="topRight"
                            onPress={this.handleChoosePhoto}>
                            <Icon name="image" />
                        </Fab>
                    </View>

                    <Item>
                        <Icon active type='FontAwesome5' name='file-signature' />
                        <Input onChangeText={(text) => { this.state.nomeGrupo = text }} placeholder='Crie um nome para seu Grupo!' />
                    </Item>

                    <Button block onPress={this.salvar} ><Text>salvar</Text></Button>

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
                        <Button vertical>
                            <Icon name="person" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Conta</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}