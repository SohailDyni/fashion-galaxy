import { Facebook, Google } from 'expo';
import React from 'react';
import { View, Image, Dimensions, ImageBackground, KeyboardAvoidingView } from 'react-native';
import {  
    Text, Container, Content, Form, Input, Label,
    Item, Button, Row, Icon, Spinner
} from 'native-base';
import { connect } from 'react-redux';

import * as actions from '../../actions';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


class LogIn extends React.Component {

    // Here is your client ID    // 247 64 68
    // 526474880561-l24j639pv025sm2ocpgspbkr0r73oudg.apps.googleusercontent.com
    // and
    // 526474880561-ad3qagvuv3r784fh0hfr3b8j727p18h1.apps.googleusercontent.com
    static navigationOptions = () => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            firstName: '', 
            firstNameError: { flag: false, txt: '' },
            lastName: '', 
            lastNameError: { flag: false, txt: '' },
            email: '', 
            emailError: { flag: false, txt: '' },
            phone: '', 
            phoneError: { flag: false, txt: '' },
            password: '', 
            passwordError: { flag: false, txt: '' },
            statusError: '',
            signUpError: '',
            tab: 1, 
            loading: false
        };      
    }

    componentWillMount() {
        // this.props.doLogin(this.props.navigation);
    }

    onSignupPress = async () => {
        const { firstName, lastName, email, phone, password,
        } = this.state;

        await this.setState({ 
            emailError: this.validateInput(email, 'email'),
            firstNameError: this.validateInput(firstName, 'firstName'),
            lastNameError: this.validateInput(lastName, 'lastName'),
            phoneError: this.validateInput(phone, 'phone'),
            passwordError: this.validateInput(password, 'password'),
        });

        this.doSingUp();
    }

    makeAuthRequest = () => {
        const { email, password, emailError, passwordError } = this.state;
        if (email !== '' && password !== '' && !emailError.flag && !passwordError.flag) {
            this.setState({ loading: true });
            try {
            fetch(`https://fashiongalaxy.pk/app/index.php?consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a&email=${email}&password=${password}`)
                .then(res => {
                    const dat = JSON.parse(res._bodyText.trim());
                    if (dat.status === 0) {
                        this.setState({ statusError: 'Authentication failed!' });
                        this.setState({ loading: false });
                    } else if (dat.status === 1) {
                        this.props.fetchCustomer(this.props.navigation, dat);
                        this.setState({ loading: false });
                    }
                });            
            } catch (error) {
                this.setState({ loading: false });
                console.error(error);
            }
        } else {
            this.setState({ emailError: this.validateInput(email, 'email') });
            this.setState({ passwordError: this.validateInput(password, 'password') });
        }
    }


    doSingUp = async () => {
        const {
            firstName, lastName, email, phone, password,
            firstNameError, lastNameError, emailError, phoneError, passwordError
        } = this.state;

        if (!firstNameError.flag || !lastNameError.flag || 
            !emailError.flag || !phoneError.flag || !passwordError.flag
            ) {
            const signUpData = {
                "email": email,
                "first_name": firstName,
                "last_name": lastName,
                "username": email,
                "password": password,
                "billing": {
                    "phone": phone
                },
                "shipping": {}
            };
            this.createCustomerPost(signUpData);
        } else {
            console.log('false');
        }
    }

    fetchCustomerFromEmail = async (email, picture) => {
        try {
            const response = 
            await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/customers/?consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a&email=${email}`);
            const responseJson = await response.json();
            const customerRes = responseJson[0];                                
            if ('id' in customerRes) {
                if (picture) {
                    customerRes.picture = picture;
                }
                this.props.createCustomer(customerRes, this.props.navigation);  
            } else {
                this.setState({ 
                    signUpError: responseJson.message || 'Something went wrong!',
                    loading: false 
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    createCustomerPost = async data => {
        this.setState({ loading: true });
        const { picture } = data;
        try {
            const response = 
            await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/customers?consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({ 'Content-Type': 'application/json' })
            });
            const responseJson = await response.json();
            if ('id' in responseJson) {
                if (picture) {
                    responseJson.picture = picture;
                }
                this.props.createCustomer(responseJson, this.props.navigation);  
            } else if (responseJson.code && responseJson.code === 
                'registration-error-email-exists') {
                this.fetchCustomerFromEmail(data.email, data.picture);
            } else {
                this.setState({ 
                    signUpError: responseJson.message || 'Something went wrong!',
                    loading: false 
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    onFbLoginPress = async () => {
        //1632607647043680
        
        const fbToken = await Facebook.logInWithReadPermissionsAsync(
            '1632607647043680',
            {
                permissions: ['public_profile', 'email']  
            }
        );
        if (fbToken.type !== 'cancel') {
            try {
                const response = 
                await fetch(`https://graph.facebook.com/me?access_token=${fbToken.token}&fields=first_name,last_name,name,picture.type(large),email`);
                const responseJson = await response.json();
                const { email, first_name, last_name, picture } = responseJson;
                if (email) {
                    const signUpData = {
                        "email": email,
                        "first_name": first_name,
                        "last_name": last_name,
                        "username": email,
                        "password": this.generatePass(),
                        "billing": {
                            "address_1": "",
                            "address_2": "",
                            "city": "",
                            "company": "",
                            "country": "",
                            "email": email,
                            "first_name": first_name,
                            "last_name": last_name,
                            "phone": "",
                            "postcode": "",
                            "state": "",
                        },
                        "shipping": {},
                        "picture": picture,
                    };
                    this.createCustomerPost(signUpData);
                } else {
                    alert('This account does not have any email.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    onGooglePress = async () => {
        try {
            const result = await Google.logInAsync({
              androidClientId:
              '526474880561-ad3qagvuv3r784fh0hfr3b8j727p18h1.apps.googleusercontent.com',
              iosClientId:
              '526474880561-l24j639pv025sm2ocpgspbkr0r73oudg.apps.googleusercontent.com',
              scopes: ['profile', 'email'],
            });
            if (result.type !== 'success') {
                return { cancelled: true };                
            }
          } catch (e) {
            return { error: true };
          }
    }


    validateInput = (input, type) => {
        if (input === '') {
            return { flag: true, txt: 'This Feild can\'t be empty' };
        }

        if (type === 'email') {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (regex.test(input)) {
                return { flag: !regex.test(input), txt: '' };
            }
            return { flag: !regex.test(input), txt: 'Enter a valid email' };
        }
        return { flag: false, txt: '' };
    }

    generatePass() {
        let pass = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (let i = 0; i < 5; i++) {
          pass += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return pass;
      }

    render() {
        const { navigation } = this.props;
        const { 
            email, emailError, password, passwordError, firstName, firstNameError,  
            lastName, lastNameError, phone, phoneError, statusError, loading,
            signUpError, tab
        } = this.state;
        return (
            <Container style={styles.container}>
                <ImageBackground 
                    source={require('../../../assets/images/login.jpg')}
                    style={styles.bgImage}
                >
                    <Content style={styles.content}>
                        <Button 
                            transparent 
                            style={styles.skip} 
                            onPress={() => navigation.navigate('home')}
                        >
                                <Text style={styles.btnTxtSkip}>skip</Text>
                        </Button>
                        <KeyboardAvoidingView>

                            { tab === 1 && 
                            <Form style={[styles.form]}>
                                <Text style={styles.h1}>Log In</Text>
                                { (statusError !== '' || signUpError !== '') && 
                                    <Text style={styles.errorText}>
                                    { statusError }
                                    { signUpError }
                                    </Text>
                                }
                                <Item floatingLabel error={this.state.emailError.flag}>
                                    <Label style={styles.label}>E-mail</Label>
                                    {/* <Input 
                                        onChangeText={val => this.setState({ email: val })}
                                        value={this.state.email}
                                        onBlur={() => this.setState({ 
                                            emailError: this.validateInput(email, 'email') })
                                        }
                                        style={styles.input}
                                    /> */}
                                    <Input
                                        style={styles.input}
                                        value={this.state.email}
                                        onChangeText={email => this.setState({email})}
                                        ref={ref => {this._emailInput = ref}}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        returnKeyType="send"
                                        blurOnSubmit
                                    />
                                </Item>
                                {emailError.flag && 
                                    <Text style={styles.errorText}>{ emailError.txt }</Text>
                                }
                                
                                <Item floatingLabel error={this.state.passwordError.flag}>
                                    <Label style={styles.label}>Password</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ password: val })}
                                        value={this.state.password}
                                        onBlur={() => this.setState({ 
                                            passwordError: 
                                            this.validateInput(this.state.password, 'password') })
                                        }
                                        secureTextEntry
                                        style={styles.input}
                                    />
                                </Item>

                                {passwordError.flag && 
                                    <Text style={styles.errorText}>{ passwordError.txt }</Text>
                                }

                                <View>
                                    { !loading && 
                                        <Button 
                                            large bordered rounded 
                                            style={styles.btnSub}
                                            onPress={() => this.makeAuthRequest()}
                                        >
                                            <Text style={styles.btnTxt}>Log in</Text>
                                        </Button>
                                    }
                                    { loading && <Spinner size="small" color="green" /> }
                                </View>

                                <Text style={styles.orWith} >or sign in with</Text>
                                
                                <Row>
                                    <Button 
                                        full rounded style={{ height: 50, width: null, flex: 1, backgroundColor: '#3B5998', alignItems: 'center' }}
                                        onPress={() => this.onFbLoginPress()}
                                    >
                                        <Icon 
                                            name="logo-facebook" 
                                            style={{ fontSize: 40, color: '#ffffff' }}
                                        />
                                        <Text style={{ fontSize: 20, lineHeight: 25 }}>Facebook</Text>
                                    </Button>
                                    {/* <Button 
                                        small transparent style={{ height: 50 }}
                                        onPress={() => this.onGooglePress()}
                                    >
                                        <Icon 
                                            name="mail" 
                                            style={{ fontSize: 40, color: '#DD5144' }}
                                        />
                                    </Button> */}
                                </Row>

                                <View>
                                    <Button transparent onPress={() => this.setState({ tab: 2 })}>
                                        <Text style={styles.create} >Create an account</Text>
                                    </Button>
                                </View>
                            </Form>}

                            { tab === 2 && <Form style={[styles.form]}>
                                <Text style={styles.h1}>Sign Up</Text>
                                { signUpError !== '' && <Text style={styles.errorText}>
                                    { signUpError }
                                    </Text>
                                }
                                <Item floatingLabel error={firstNameError.flag}>
                                    <Label style={styles.label}>First Name</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ 
                                            firstName: val })
                                        }
                                        value={firstName}
                                        onBlur={() => this.setState({ 
                                            firstNameError: 
                                            this.validateInput(firstName, 'firstName') }) 
                                        }
                                        style={styles.input}
                                    />
                                </Item>

                                <Item floatingLabel error={lastNameError.flag}>
                                    <Label style={styles.label}>Last Name</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ lastName: val })}
                                        value={lastName}
                                        onBlur={() => this.setState({ 
                                            lastNameError: 
                                            this.validateInput(lastName, 'lastName') })
                                        }
                                        style={styles.input}
                                    />
                                </Item>

                                <Item floatingLabel error={emailError.flag}>
                                    <Label style={styles.label}>E-mail</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ email: val })}
                                        value={email}
                                        onBlur={() => this.setState({ 
                                            emailError: this.validateInput(email, 'email') })
                                        }
                                        style={styles.input}
                                    />
                                </Item>

                                <Item floatingLabel error={phoneError.flag}>
                                    <Label style={styles.label}>Phone</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ phone: val })}
                                        value={phone}
                                        onBlur={() => this.setState({ 
                                            phoneError: 
                                            this.validateInput(phone, 'phone') })
                                        }
                                        style={styles.input}
                                    />
                                </Item>

                                <Item floatingLabel error={passwordError.flag}>
                                    <Label style={styles.label}>Password</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ password: val })}
                                        value={password}
                                        onBlur={() => this.setState({ 
                                            passwordError: 
                                            this.validateInput(password, 'password') })}
                                        secureTextEntry
                                        style={styles.input}
                                    />
                                </Item>
                                <View>
                                    { !loading && <Button 
                                        large bordered rounded 
                                        style={styles.btnSub}
                                        onPress={() => this.onSignupPress()}
                                    >
                                        <Text style={styles.btnTxt}>Sign Up</Text>
                                    </Button>}
                                    { loading && <Spinner size="small" color="green" /> }
                                </View>

                                <View style={{ marginTop: 30, }}>
                                <Button transparent onPress={() => this.setState({ tab: 1 })}>
                                    <Text style={styles.create} >Alerady have an account</Text>
                                </Button>
                                </View>
                            </Form>}
                            </KeyboardAvoidingView>

                    </Content>
                </ImageBackground>
            </Container>
        );
    }

}

export const Login = connect(null, actions)(LogIn);

const mg30 = DEVICEHEIGHT * 0.03;
const styles = {
    container: { 
        backgroundColor: 'white',
        //paddingLeft: 10
    },
    bgImage: { width: DEVICEWIDTH, height: DEVICEHEIGHT },
    content: { 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        bottom: 0, 
        left: 0, 
        backgroundColor: '#00000090',  
    },
    label: { color: 'white' },
    input: { color: 'white' },
    h1: { fontSize: 27, fontWeight: 'bold', color: 'white' },
    btnSub: { width: 150, height: 40, borderColor: 'white', marginTop: DEVICEHEIGHT * 0.04 },
    btnTxt: { color: 'white', textAlign: 'center', width: '100%', fontWeight: 'bold' },
    orWith: { marginTop: mg30, marginBottom: mg30, color: '#ffffff95' },
    skip: { 
        marginTop: DEVICEHEIGHT * 0.04, 
        justifyContent: 'flex-end',
        width: DEVICEWIDTH, 
        zIndex: 999
    },
    btnTxtSkip: { color: '#ffffffff', fontWeight: 'bold', zIndex: 9999 },
    form: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: mg30, 
        paddingVertical: 5, 
    },
    create: { fontSize: 18, color: 'white', textDecorationLine: 'underline', marginTop: mg30 },
    errorText: { color: '#ff0033', 
    width: '100%', 
    textAlign: 'left', 
    fontSize: 14, 
    paddingLeft: 15, 
    paddingTop: 10 },
    formKeyboard: {
        flex: 1,
        justifyContent: 'space-between',
    },

};

