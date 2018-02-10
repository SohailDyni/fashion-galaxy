import React from 'react';
import { View,Image, Dimensions } from 'react-native';
import {  
    Text, Container, Content, Form, Input, Label, Footer,Item, Left, Right,Col,
    Button, Row, Body, Card,List, ListItem, Thumbnail,H2,Icon
} from 'native-base';

const DEVICEWIDTH = Dimensions.get("window").width;
const DEVICEHEIGHT = Dimensions.get("window").height;

export class Signup extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            email: '', emailError: { flag: false, txt: '' },
            password: '', passwordError: { flag: false, txt: '' },
        }        
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    validateInput = ( input, type ) => {
        if( input === '' ){
            return { flag: true, txt: 'This Feild can\'t be empty' }
        }

        if( type === 'email' ){
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return { flag: !regex.test(input), txt: 'Enter a valid email' }
        }

        return { flag: false, txt: '' }
    }
    
    render(){

        const { navigation } = this.props;

        return (
            <Container style={ styles.container }>
                
                <Image source={ require('../../../assets/images/login.jpg') }
                    style={ styles.bgImage }
                   >
                   <Button transparent style={ styles.skip }>
                            <Text style={ styles.btnTxtSkip }>skip</Text> 
                    </Button>
                    <Content style={ styles.content }>
                       
                        <Form style={ styles.form }>
                            <Text style={ styles.h1 }>Log In</Text>
                            <Item floatingLabel error={this.state.emailError.flag}>
                                <Label style={ styles.label }>E-mail</Label>
                                <Input 
                                    onChangeText={ val => this.setState({ email: val }) }
                                    value={this.state.email}
                                    onBlur={() => this.setState({ emailError: this.validateInput(this.state.email, 'email') }) }
                                    style={ styles.input }
                                />
                            </Item>

                            <Item floatingLabel error={this.state.passwordError.flag}>
                                <Label style={ styles.label }>Password</Label>
                                <Input 
                                    onChangeText={ val => this.setState({ password: val }) }
                                    value={this.state.password}
                                    onBlur={() => this.setState({ passwordError: this.validateInput(this.state.password, 'password') }) }
                                    secureTextEntry
                                    style={ styles.input }
                                />
                            </Item>
                            <View>
                                <Button large bordered rounded style={ styles.btnSub }>
                                    <Text style={ styles.btnTxt }>Log in</Text>
                                </Button>
                            </View>

                            <Text style={ styles.orWith } >or sign in with</Text>
                            
                            <Row>
                                <Button small transparent>
                                    <Icon name="logo-whatsapp" style={{ fontSize: 40, color: '#34A34F'  }}/>
                                </Button>
                                <Button small transparent>
                                    <Icon name="logo-facebook" style={{ fontSize: 40,color: '#3B5998' }}/>
                                </Button>
                                <Button small transparent>
                                    <Icon name="mail" style={{ fontSize: 40, color: '#DD5144' }}/>
                                </Button>
                            </Row>

                            <View style={{ marginTop: 30, }}>
                            <Button transparent>
                                <Text style={ styles.create } >Create an account</Text>
                            </Button>
                            </View>
                        </Form>
                    </Content>
                </Image>
            </Container>
        );
    }

}


const styles = {
    container: { 
        backgroundColor: 'white',
        //paddingLeft: 10
    },
    bgImage: { width: DEVICEWIDTH, height: DEVICEHEIGHT },
    content: { 
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, 
        backgroundColor: '#00000060',  justifyContent: 'center' 
    },
    label: { color: 'white' },
    input : { color: 'white' },
    h1: { fontSize: 35, fontWeight: 'bold',color: 'white' },
    btnSub: { width: 150, height: 50, borderColor: 'white', marginTop: 40 },
    btnTxt: { fontSize: 20, color: 'white', textAlign: 'center', width: '100%', fontWeight: 'bold' },
    orWith: { marginTop: 30, marginBottom: 30, color: '#ffffff95' },
    skip: { marginTop: 30, justifyContent: 'flex-end', width: DEVICEWIDTH,zIndex: 999},
    btnTxtSkip: { fontSize: 20, color: '#ffffffff',fontWeight: 'bold',zIndex: 9999 },
    form: { justifyContent: 'center', alignItems: 'center', padding: 30 },
    create: { fontSize: 20, color: 'white', textDecorationLine: 'underline' }

}

