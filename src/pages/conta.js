import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import {
    Container,
    Header,
    Content,
    Item,
    Input,
    Icon,
    Button,
    Text,
    Left,
    Title,
    Body,
    Right,
    Footer,
    FooterTab,
    Fab,
    View,
} from 'native-base';
import axios from "../axios";
import fonts from "../styles/fonts"
import Menu, { MenuItem } from 'react-native-material-menu';


export default class FloatingLabelExample extends Component {


    constructor(props) {

        super(props);

        this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {

            //this._retrieveData()
            this.atualizar()
        });


        this.state = {
            listUser: [{ nome: "" }],
            listGroup: [{ nome: "" }, { nome: "" }],
            groupUsers: [],
            treinos: [],
            idUser: 0,
            toggleDropdown: false,
            busca: ''
        }
    }

    onClickButton = () => {
        this.setState({
            toggleDropdown: !this.state.toggleDropdown
        })
    }

    componentWillMount() {
        this.reRenderSomething;
        //this.atualizar()
    }

    async addInGroup(user) {

        var body = {
            grupo: this.state.listGroup[0].id,
            pedido: '1'
        }

        if (user.pedido == '0') {
            await axios.patch('corrida/grupdate/' + user.id, body)
        }
    }

    async sairGroup() {
        var body = {
            grupo: '0',
            admin: '0',
            pedido: '0',
        }

        await axios.patch('corrida/grupdate/' + this.state.listUser[0].id, body)
        if (this.state.groupUsers.length < 2) {
            axios.delete('corrida/delGroup/' + this.state.listUser[0].grupo)
            for (let i = 0; i < this.state.treinos.length; i++) {
                axios.delete('corrida/delTreinos/' + this.state.treinos[i].id)
            }
            console.log("aqui")
        } else if (this.state.groupUsers.length >= 2) {
            if (this.state.groupUsers[0].id != this.state.listUser[0].id) {
                await axios.patch('corrida/grupdate/' + this.state.groupUsers[0].id, { admin: '1' })
            } else {
                await axios.patch('corrida/grupdate/' + this.state.groupUsers[1].id, { admin: '1' })
            }

            console.log("aqui2")
        }
        this.atualizar()
    }

    addAdmin = (user) => {

        if (user.admin == '0') {
            Alert.alert(
                'Administradores',
                'Adicionar o ' + user.nome + ' como administrador do grupo?',
                [
                    { text: 'Sim', onPress: () => { axios.patch('corrida/grupdate/' + user.id, { admin: '1' }), this.atualizar() } },
                    { text: 'Cancelar', onPress: () => console.log('cancelar') },
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                'Administradores',
                'Remover o ' + user.nome + ' de administrador do grupo?',
                [
                    { text: 'Sim', onPress: () => { axios.patch('corrida/grupdate/' + user.id, { admin: '0' }), this.atualizar() } },
                    { text: 'Cancelar', onPress: () => console.log('cancelar') },
                ],
                { cancelable: false },
            );
        }
    }

    removerGroup = async (id) => {
        var body = {
            grupo: '0',
            admin: '0',
            pedido: '0'
        }

        await Alert.alert(
            'Atenção',
            'Deseja realmente remover esse atleta?',
            [
                {
                    text: 'Sim', onPress: () => {
                        axios.patch('corrida/grupdate/' + id, body),
                            this.atualizar()
                    }
                },
                {
                    text: 'Não',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }

    removerTreino = async (id) => {

        await Alert.alert(
            'Atenção!',
            'Deseja realmente remover esse treino?',
            [
                {
                    text: 'Sim', onPress: () => {
                        axios.delete('corrida/delTreinos/' + id),
                            this.atualizar()
                    }
                },
                {
                    text: 'Não',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }

    async makeListGroup() {

        await axios.get('corrida/usersGroup/' + this.state.listUser[0].grupo).then((response) => {
            this.setState({ groupUsers: response.data })
        }).catch(error => {
            console.log(error)
        })
    }

    confirmPedido() {
        if (this.state.listUser[0].pedido == '1') {
            Alert.alert(
                'Pedido de Grupo',
                'Você tem um pedido do grupo ' + this.state.listGroup[0].nome_grupo,
                [
                    {
                        text: 'Aceitar', onPress: () => {
                            axios.patch('corrida/grupdate/' + this.state.listUser[0].id, { pedido: '0' }),
                                this.atualizar()
                        }
                    },
                    { text: 'Recusar', onPress: () => this.sairGroup() },
                ],
                { cancelable: false },
            );
        }
    }


    atualizar = async () => {

        const valor = await AsyncStorage.getItem('@user:session');

        await axios.get('corrida/atletas/' + valor).then((response) => {
            this.setState({ listUser: response.data }), console.log('atleta', this.state.listUser)
        }).catch(error => {
            console.log(error)
        })

        await axios.get('corrida/grupo/' + this.state.listUser[0].grupo).then((response) => {
            this.setState({ listGroup: response.data }), console.log('grupo', this.state.listGroup)
        }).catch(error => {
            console.log(error)
        })

        await axios.get('corrida/treinosG/' + this.state.listUser[0].grupo).then((response) => {
            this.setState({ treinos: response.data }), console.log('treinos', this.state.treinos)
        }).catch(error => {
            console.log(error)
        })

        await this.makeListGroup()
        await this.confirmPedido()
    }

    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    buscarUser = async () => {

        await axios.get('corrida/userscpf/' + this.state.busca).then((response) => {
            if (response.data.length >= 1) {
                if (response.data[0].grupo == 0) {
                    Alert.alert(
                        'Atenção',
                        'Adicionar ' + response.data[0].nome + ' ao seu Grupo?',
                        [
                            { text: 'Cancelar', onPress: () => console.log('Cancel') },
                            { text: 'Sim!', onPress: () => { this.addInGroup(response.data[0]), this.atualizar() } },
                        ],
                        { cancelable: false },
                    );
                } else if (response.data[0].grupo == this.state.listUser[0].grupo) {
                    alert('Esse atleta já está no seu grupo!')
                } else {
                    alert('O atleta' + response.data[0].nome + ' já é integrante de outro grupo, ou tem um pedido em aberto!')
                }
            }else{
                alert('Nenhum atleta com esse CPF foi encontrado!')
            }
        }).catch(error => {
            console.log(error)
        })
    }

    render() {

        addAdmin = this.addAdmin
        removerGroup = this.removerGroup
        removerTreino = this.removerTreino

        const { navigate } = this.props.navigation;
        const idAtleta = this.state.listUser[0].id

        if (this.state.listUser[0].data_nsc) {
            var dataA = new Date(Date.now())
            var idade = parseInt(this.state.listUser[0].data_nsc.substr(0, 4))
            var anoA = parseInt(dataA.toString().substr(11, 14).substr(0, 4))
        }

        if (this.state.listUser[0].cpf) {
            var part1 = this.state.listUser[0].cpf.substr(0, 3)
            var part2 = this.state.listUser[0].cpf.substr(3, 6).substr(0, 3)
            var part3 = this.state.listUser[0].cpf.substr(6, 9).substr(0, 3)
            var part4 = this.state.listUser[0].cpf.substr(9, 11)

            var cpfFormat = (part1 + '.' + part2 + '.' + part3 + ' - ' + part4)

        }

        //console.log(anoA-idade)

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('eventos')}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Conta</Title>
                    </Body>
                    <Right>
                        {this.state.listUser[0].grupo == 0 &&
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Menu
                                    ref={this.setMenuRef}
                                    button={<Button transparent onPress={this.showMenu}><Icon type='FontAwesome5' name='ellipsis-v' style={{ color: 'white' }} /></Button>}>
                                    <MenuItem onPress={() => { this.hideMenu(), this.props.navigation.navigate('cadastroGrupos') }}>Novo Grupo</MenuItem>
                                </Menu>
                            </View>
                        }
                    </Right>
                </Header>
                <Content>

                    <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ margin: 20, fontSize: fonts.bigger, fontWeight: 'bold' }}>{this.state.listUser[0].nome}</Text>
                        <Text style={{ marginLeft: 20, marginBottom: 10, fontSize: fonts.big, fontWeight: 'normal' }}>{'Idade: ' + (anoA - idade)}</Text>
                        <Text style={{ marginLeft: 20, marginBottom: 10, fontSize: fonts.big, fontWeight: 'normal' }}>{'CPF: ' + cpfFormat}</Text>
                        <Text style={{ marginLeft: 20, marginBottom: 10, fontSize: fonts.big, fontWeight: 'normal' }}>{'Sexo: ' + this.state.listUser[0].sexo}</Text>
                        {this.state.listUser[0].grupo == 0 &&
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1, marginLeft: 20, marginBottom: 10, fontSize: fonts.big, fontWeight: 'normal' }}>{'Grupo: '}</Text>
                                <Text note style={{ flex: 6 }}>{' Você ainda não possui um grupo de treinamento, fale com um adiministrador ou crie seu próprio Grupo!'}</Text>
                            </View>
                        }

                        {this.state.listUser[0].grupo != 0 &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, marginLeft: 20, marginBottom: 10, fontSize: fonts.big, fontWeight: 'normal' }}>{'Grupo: '}</Text>
                                    {this.state.listGroup[0] != undefined && <Text style={{ flex: 6, fontSize: fonts.big, fontWeight: 'bold' }}>{this.state.listGroup[0].nome_grupo}</Text>}
                                </View>
                                <Button onPress={() => { this.sairGroup() }} transparent><Text style={{ color: 'red', fontWeight: 'bold' }}>Sair do Grupo</Text></Button>

                                {this.state.listGroup[0] != undefined && this.state.listUser[0].admin == '1' &&
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 15 }}>
                                        
                                        <Text style={{ marginBottom:20 ,fontSize: fonts.bigger, fontWeight: 'bold' }}>Buscar e adicionar integrantes!</Text>
                                        
                                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                            <Item style={{ flex: 3, marginLeft: 10 }}>
                                                <Icon name="ios-search" />
                                                <Input clearButtonMode='always' keyboardType='numeric' maxLength={11} onChangeText={(text) => this.setState({ busca: text })} value={this.state.busca} placeholder="Buscar um Atleta pelo CPF" />
                                                <Icon name="ios-people" />
                                            </Item>
                                            <Button onPress={() => { this.buscarUser(), this.setState({ busca: "" }) }} style={{ marginLeft:5, marginRight:5 }} >
                                                <Text>Buscar</Text>
                                            </Button>
                                        </View>

                                        <Text style={{ fontSize: fonts.bigger, fontWeight: 'bold', marginBottom: 20 }}>Integrantes do Grupo.</Text>

                                        {this.state.groupUsers.map(function (item, index) {
                                            if (item.id != idAtleta) {
                                                return (
                                                    <Button onLongPress={() => addAdmin(item)} block light key={index} style={{ marginStart: 5, marginLeft: 5, marginRight: 5 }}>
                                                        <Left style={{ flex: 3 }}>
                                                            <Text style={{ marginLeft: 5 }} >{item.nome}</Text>
                                                        </Left>
                                                        <Body style={{ flex: 3, flexDirection: 'row-reverse' }}>
                                                            {item.admin == 1 &&
                                                                <Text style={{ textAlign: 'center', color: 'green', fontSize: 14, borderWidth: 1, borderColor: 'green' }} >Admin</Text>
                                                            }
                                                            {item.pedido == 1 &&
                                                                <Text style={{ textAlign: 'center', color: 'gray', fontSize: 14, borderWidth: 1, borderColor: 'gray', marginRight: 5 }} >Pedido</Text>
                                                            }
                                                        </Body>
                                                        <Right style={{ flexDirection: 'row' }}>
                                                            <Button style={{ alignContent: 'flex-end' }} onPress={() => { removerGroup(item.id) }} transparent><Icon name='close-circle' style={{ color: 'red' }} /></Button>
                                                        </Right>
                                                    </Button>
                                                )
                                            }
                                        })}
                                        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20 }}>
                                            <Text style={{ fontSize: fonts.bigger, fontWeight: 'bold', alignSelf: 'center' }}>Treinos Do Grupo</Text>
                                            <Button
                                                rounded
                                                style={{ backgroundColor: '#5067FF', marginLeft: 10, alignSelf: 'center' }}
                                                onPress={() => this.props.navigation.navigate('cadastroGrupo', { idG: this.state.listGroup[0].id })}>
                                                <Icon name="md-add" />
                                            </Button>
                                        </View>

                                        {this.state.treinos.map(function (item, index) {
                                            return (
                                                <Button block light key={index} style={{ marginStart: 5, marginLeft: 5, marginRight: 5 }}>

                                                    <Left style={{ flex: 5 }}>
                                                        <Text style={{ marginLeft: 5 }} >{item.NomeCorrida}</Text>
                                                    </Left>
                                                    <Body>
                                                        <Button style={{ alignContent: 'flex-end' }} onPress={() => { navigate('cadastroGrupo', { id: item }) }} transparent><Icon name='settings' style={{ color: 'blue' }} /></Button>
                                                    </Body>
                                                    <Right style={{ flexDirection: 'row' }}>
                                                        <Button style={{ alignContent: 'flex-end' }} onPress={() => { removerTreino(item.id) }} transparent><Icon name='close-circle' style={{ color: 'red' }} /></Button>
                                                    </Right>
                                                </Button>
                                            )
                                        })}

                                    </View>
                                }
                            </View>
                        }
                    </View>

                    {/* {this.state.listUser[0].grupo == 0 &&

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon type='FontAwesome5' name='exclamation-triangle' style={{ padding: 30, fontSize: 30 }} />
                            <Text note style={{ textAlign: 'center', fontSize: fonts.regular }}></Text>
                            <Button style={{ margin: 20, alignSelf: 'center' }}><Text>Criar Novo Grupo</Text></Button>
                        </View>
                    } */}
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