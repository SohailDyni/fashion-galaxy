import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import {  
    Text, Container, Content, Form, Input, Label, Footer, Item, Button
} from 'native-base';
import { Col as Column, Row as RowGrid, } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import TopHeaderCat from '../TopHeaderCat';
import * as actions from '../../actions';

class Shipping extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
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
            address: '', 
            addressError: { flag: false, txt: '' },
            phone: '', 
            phoneError: { flag: false, txt: '' },
            city: '', 
            cityError: { flag: false, txt: '' },
            isChanged: false,
            loading: false,
            allError: false,
        };
    }

    componentDidMount() {
        this.onAuthComplete(this.props);
    }
        
    onAuthComplete(props) {
        if (Object.keys(props.customer).length > 0) {
            const billing = props.customer.billing;                
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
        }
    }

    onBtnPress = async () => {
        const { firstName, lastName, email, phone, address, city,
        } = this.state;

        await this.setState({ 
            emailError: this.validateInput(email, 'email'),
            firstNameError: this.validateInput(firstName, 'firstName'),
            lastNameError: this.validateInput(lastName, 'lastName'),
            phoneError: this.validateInput(phone, 'phone'),
            addressError: this.validateInput(address, 'address'),
            cityError: this.validateInput(city, 'city'),    
        });
        this.doRedirect();
    }
    
    doRedirect = () => {
        const {
            firstNameError, lastNameError, emailError, phoneError, addressError, cityError
        } = this.state;
        const params = this.props.navigation.state.params;
        if (firstNameError.flag || 
            lastNameError.flag || 
            emailError.flag || 
            phoneError.flag || 
            addressError.flag || 
            cityError.flag) {
            this.setState({ allError: true });
        } else {
            this.props.navigation.navigate('Confirmation', 
                { 
                    billing: this.state, 
                    total: params.total,
                    shipping: params.shipping,
                    discount: params.discount,
                    couponLines: params.couponLines 
                }
            );            
        }
    }

    validateInput = (input, type) => {
        if (input === '') {
            return { flag: true, txt: 'This Feild can\'t be empty' };
        }
        if (type === 'email') {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return { flag: !regex.test(input), txt: 'Enter a valid email' };
        }

        return { flag: false, txt: '' };
    }
    
    render() {
        return (
            <Container style={styles.container}>
                <Content style={{ backgroundColor: 'white', padding: 10 }}>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={100} 
                        behavior={'position'} 
                    >
                    <Form style={{ padding: 10 }}>
                        { this.state.allError && 
                        <Text style={styles.error}>Please fill all the fields proplery</Text> 
                        }
                        <RowGrid>
                            <Column>
                                <Item floatingLabel error={this.state.firstNameError.flag}>
                                    <Label>First Name</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ firstName: val })}
                                        value={this.state.firstName}
                                        onBlur={() => this.setState({ 
                                            firstNameError: this.validateInput(this.state.firstName, 'firstName') 
                                        })}
                                    />
                                </Item>
                            </Column>
                            <Column>
                                <Item floatingLabel error={this.state.lastNameError.flag}>
                                    <Label>Last Name</Label>
                                    <Input 
                                        onChangeText={val => this.setState({ lastName: val })}
                                        value={this.state.lastName}
                                        onBlur={() => this.setState({ lastNameError: 
                                            this.validateInput(this.state.lastName, 'lastName') 
                                        })}
                                    />
                                </Item>
                            </Column>
                        </RowGrid>

                        <Item floatingLabel error={this.state.emailError.flag}>
                            <Label>Email</Label>
                            <Input 
                                onChangeText={val => this.setState({ email: val })}
                                value={this.state.email}
                                onBlur={() => this.setState({ 
                                    emailError: this.validateInput(this.state.email, 'email') 
                                })}
                            />
                        </Item>

                        <Item floatingLabel error={this.state.phoneError.flag}>
                            <Label>Phone number</Label>
                            <Input 
                                onChangeText={val => this.setState({ phone: val })}
                                value={this.state.phone}
                                onBlur={() => this.setState({ phoneError: 
                                    this.validateInput(this.state.phone, 'phone') 
                                })}
                            />
                        </Item>

                        <Item floatingLabel error={this.state.addressError.flag}>
                            <Label>Address</Label>
                            <Input 
                                onChangeText={val => this.setState({ address: val })}
                                value={this.state.address}
                                onBlur={() => this.setState({ 
                                    addressError: this.validateInput(this.state.address, 'address') 
                                })}
                            />
                        </Item>

                        <Item floatingLabel error={this.state.cityError.flag}>
                            <Label>City</Label>
                            <Input 
                                onChangeText={val => this.setState({ city: val })}
                                value={this.state.city}
                                onBlur={() => this.setState({ 
                                    cityError: this.validateInput(this.state.city, 'city') 
                                })}
                            />
                        </Item>

                    </Form>
                    </KeyboardAvoidingView>
                </Content>
                
                <Footer>
                    <Button 
                        full 
                        style={{ flex: 1, height: '100%' }} 
                        onPress={() => this.onBtnPress()}
                    >
                        <Text>Continue to Confimation</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }

}

const styles = {
    error: {
        color: 'red',
        textAlign: 'center'
    }
};

function mapStateToProps({ customer }) {
    return { customer };
}

export default connect(mapStateToProps, actions)(Shipping);
