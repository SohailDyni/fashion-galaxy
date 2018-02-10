import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { Button, Thumbnail, Icon, List, ListItem, Right,
    Body, Row, Left, Content, Container, Input, Text,
    Spinner
} from 'native-base';
import { connect } from 'react-redux';

import TopHeaderCat from '../TopHeaderCat';
import * as actions from '../../actions';

const defaultUser = require('../../../assets/images/default-user-icon-profile.png');
const shallowequal = require('shallowequal');

export class Profilescreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} backPage="home" />
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
            address: '',
            city: '',
            tab: 1, 
            isChanged: false,
            loading: false
        };       
    }


    componentDidMount() {
        this.onAuthComplete(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
        this.onAuthComplete(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowequal(this.state, nextState) && shallowequal(this.props, nextProps)) {
            return false;
        }
        return true;        
    }
    
    onAuthComplete(props) {
        if (props.customer.billing) {
            const billing = props.customer.billing;
            // if( props.customer.billing ){
                this.setState({
                    email: billing.email,
                    firstName: billing.first_name,
                    lastName: billing.last_name,
                    city: billing.city,
                    phone: billing.phone,
                    address: billing.address_1,
                    isChanged: false,
                    loading: false,
                });
            // }
        }
    }

    onSavePress = () => {
        this.setState({ loading: true });
        const billing = this.props.customer.billing;
        const { 
            email, firstName,  
            lastName, phone, address, city
        } = this.state;

        billing.first_name = firstName;
        billing.last_name = lastName;
        billing.phone = phone;
        billing.city = city;
        billing.email = email;
        billing.address_1 = address;

        this.props.updateCustomer(this.props.customer.id, billing);
    }

    validateInput = (input, type) => {

        if (input === '') {
            return { flag: true, txt: 'This Feild can\'t be empty' }
        }

        if (type === 'email') {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (regex.test(input)) {
                return { flag: !regex.test(input), txt: '' };
            }
            return { flag: !regex.test(input), txt: 'Enter a valid email' };            
        }
        this.setState({ isChanged: true });
        return { flag: false, txt: '' };
    }


    render() {
        const { email, isChanged, address,
            city, loading
        } = this.state;
        const { customer, navigation } = this.props;
        const isLogedIn = Object.keys(customer).length > 0;  
        function imageSource() {
			if (customer.picture) {
				return customer.picture.data.url;
			}
			return customer.avatar_url;
        }  
        return (
            <Container>
                { isLogedIn && <Content style={styles.container}>
                <KeyboardAvoidingView behavior="position">

                    <View style={styles.imageContainer}>
                        {isLogedIn && <Thumbnail large source={{ uri: imageSource() }} />}

                        {!isLogedIn && <Thumbnail large source={defaultUser} />}
                    </View>
                    <List style={{ backgroundColor: 'white' }}>

                        <ListItem icon style={styles.listItem}>
                            <Left>
                                <Icon name="md-person" />
                            </Left>
                            <Body>
                                <Row>
                                <Input 
                                    onChangeText={val => this.setState({ firstName: val })}
                                    value={this.state.firstName}
                                    placeholder="First Name"
                                    onBlur={() => this.setState({ 
                                        firstNameError: 
                                        this.validateInput(this.state.firstName, 'firstName') 
                                        }) 
                                    }
                                    style={styles.input}
                                />
                                <Input 
                                    onChangeText={val => this.setState({ lastName: val })}
                                    value={this.state.lastName}
                                    placeholder="Last Name"
                                    onBlur={() => this.setState({ 
                                        lastNameError: 
                                        this.validateInput(this.state.lastName, 'lastName') }) 
                                    }
                                    style={styles.input}
                                />
                                </Row>
                            </Body>
                            <Right>
                                <Icon name="md-create" />
                            </Right>
                        </ListItem>


                        <ListItem icon style={styles.listItem}>
                            <Left>
                                <Icon name="md-mail" />
                            </Left>
                            <Body>
                                <Input 
                                    onChangeText={val => this.setState({ email: val })}
                                    value={this.state.email}
                                    placeholder="Your email"
                                    onBlur={() => this.setState({ 
                                        emailError: this.validateInput(email, 'email') }) 
                                    }
                                    style={styles.input}
                                />
                            </Body>
                            <Right>
                                <Icon name="md-create" />
                            </Right>
                        </ListItem>

                        <ListItem icon style={styles.listItem}>
                            <Left>
                                <Icon name="md-call" />
                            </Left>
                            <Body>
                                <Input 
                                    onChangeText={val => this.setState({ phone: val })}
                                    value={this.state.phone}
                                    placeholder="Your phone number"
                                    onBlur={() => this.setState({ 
                                        phoneError: 
                                        this.validateInput(this.state.phone, 'phone') }) 
                                    }
                                    style={styles.input}
                                />
                            </Body>
                            <Right>
                                <Icon name="md-create" />
                            </Right>
                        </ListItem>

                        <ListItem icon style={styles.listItem}>
                            <Left>
                                <Icon name="md-home" />
                            </Left>
                            <Body>
                                <Input 
                                    onChangeText={val => this.setState({ address: val })}
                                    value={this.state.address}
                                    placeholder="Your address"
                                    onBlur={() => this.validateInput(address, 'address')}
                                    style={styles.input}
                                />
                            </Body>
                            <Right>
                                <Icon name="md-create" />
                            </Right>
                        </ListItem>

                        <ListItem icon style={styles.listItem}>
                            <Left>
                                <Icon name="md-home" />
                            </Left>
                            <Body>
                                <Input 
                                    onChangeText={val => this.setState({ city: val })}
                                    value={this.state.city}
                                    placeholder="Your city"
                                    onBlur={() => this.validateInput(city, 'city')}
                                    style={styles.input}
                                />
                            </Body>
                            <Right>
                                <Icon name="md-create" />
                            </Right>
                        </ListItem>
                        { isChanged && <Row style={styles.btnCon}>
                            <Button 
                            rounded 
                            success style={styles.btn}
                                onPress={() => this.onSavePress()}
                            >
                                <Text>Save</Text>
                            </Button>
                        </Row>}
                        { loading && <Row style={styles.btnCon}>
                            <Spinner size="small" color="green" />
                        </Row>}
                            
                    </List>
                    </KeyboardAvoidingView>
                   
                </Content> }
                { !isLogedIn && 
                    <View 
                        style={styles.notLogin}
                    >
                        <Text>You are not logged in</Text>
                        <Button 
                            rounded primary
                            style={styles.notLoginBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text>Log in</Text>
                        </Button>
                    </View>
                }
            </Container>

        );
    }

}
function mapStateToProps({ customer }) {
    return { customer };
}

export const ProfileScreen = connect(mapStateToProps, actions)(Profilescreen);

const styles = {
    container: {
      backgroundColor: '#fff',
    },
    imageContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFFFF',
        borderBottomColor: '#000',
    },
    btnSub: { width: 150, height: 50, borderColor: 'green', marginTop: 40 },    
    listItem: { marginTop: 10, marginBottom: 10 },
    btn: { 
        width: '35%',
        marginTop: 30, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    btnCon: { justifyContent: 'center' },
    input: {},
    notLogin: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    notLoginBtn: {
        alignSelf: 'center',
        marginTop: 15,
        width: 150,
        justifyContent: 'center'
    }
  };
