import React from 'react';
import { View, Image } from 'react-native';
import {  
    Text, Container, Content, Form, Input, Label, Footer,Item, Left, Right,Col,
    Button, Row, Body, Card,List, ListItem, Thumbnail,H2,
} from 'native-base';
import { connect } from 'react-redux';

import TopHeaderCat from '../TopHeaderCat';
import Divider from '../../components/Divider';
import * as actions from '../../actions';


class ThankYou extends React.Component{

    constructor(props) {
        super(props);        
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    componentDidMount() {
        this.props.emptyCart(this.props.cart);
    }
    
    render(){
        const { navigation } = this.props;
        const orderNum = navigation.state.params;
        const Props = this.props;
        return (
            <Container style={ styles.container }>
                <Content>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30,paddingTop: 60 }}>
                        <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 7 }}>THANK YOU</Text>
                        <H2 style={{ marginBottom: 5 }}>FOR YOUR ORDER</H2>
                        <Text>Order number: #{ orderNum }</Text>
                    </View>
                    <View>
                        <Image 
                                source={require('../../../assets/images/shipping.jpg')}
                                style={{ flex: 1, width: null, height: 300 }}
                        />
                    </View>
                   
                </Content>
                
                <Footer>
                    <Button full style={{ flex: 1,height: '100%' }} 
                        onPress={() => {
                            Props.emptyCart();
                            navigation.navigate('home');
                        }}
                    >
                        <Text>Continue Shopping</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }

}


const styles = {
    container: { 
        backgroundColor: 'white',
        //paddingLeft: 10
    },
    block: {
        paddingLeft: 15, 
    },
    listItem: {
        marginLeft: 0,
        borderColor: 'transparent'
    }
};


export default connect(null, actions)(ThankYou);
