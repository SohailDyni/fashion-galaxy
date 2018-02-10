import React from 'react';
import { View, Image } from 'react-native';
import {  
    Text, Container, Content, Footer, H2, Left, Right, Col,
    Button, Row, Body, List, ListItem, Spinner
} from 'native-base';
import { connect } from 'react-redux';
import _ from 'lodash';

import TopHeaderCat from '../TopHeaderCat';
import Divider from '../../components/Divider';
import * as actions from '../../actions';

class Confirmation extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
    });

    constructor(props) {
        super(props);
        this.state = { 
            loading: false,
        };
    }

    getProductThumbnail = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-300x300.${extension}`;
    }

    renderCartItem = item => {
        const { product, quantity } = item;

        let hasColors = false;
        let isVariable = false;
        let hasCharacters = false;
        let hasSizes = false;
        if (product.type === 'variable') {
            isVariable = true;
            for (let i = 0; i < product.attributes.length; i++) {
                if (product.attributes[i].name === 'color') {
                    hasColors = true;
                }
                if (product.attributes[i].name === 'Sizes' 
                            || 
                    product.attributes[i].name === 'Size') {
                    hasSizes = true;
                }
                if (product.attributes[i].name === 'Characters' 
                            || 
                    product.attributes[i].name === 'characters') {
                    hasCharacters = true;
                }
            }
        }

        return (
            <ListItem style={[styles.listItem]}>
                <Image 
                    style={{ width: 80, height: 80 }} 
                    square 
                    size={200} 
                    source={{ uri: this.getProductThumbnail(product.images[0].src) }} 
                />
                <Body>
                    <Text>{ product.name }</Text>
                    <Row style={{ alignItems: 'center' }}>
                        { hasSizes && <Text>Size: { item.size }</Text>}
                        { hasColors && <Text>Color: { item.color }</Text>}
                        { hasCharacters && <Text>Character: { item.character }</Text>}
                        <Text note>Qty: {quantity}</Text>
                    </Row>
                    <Text>Rs. { product.price }</Text>
                </Body>
            </ListItem>
        );
    }
    
    render() {
        const lineItems = [];
        const orderNoteData = [];
        const { loading } = this.state;
        const { navigation, customer, cart: fullCart } = this.props;

        const cart = _.filter(fullCart, o => {
            if ('isChecked' in o) {
                return o.isChecked;
            }
        });

        const { 
            firstName, 
            lastName, email, 
            phone, address, 
            city, 
        } = navigation.state.params.billing;
        const { shipping, total, discount, couponLines } = navigation.state.params;
        const customerDetail = {
            "first_name": firstName,
            "last_name": lastName,
            "address_1": address,
            "address_2": "",
            "city": city,
            "country": "PK",
            "email": email,
            "phone": phone
        };
        const fullName = `${firstName} ${lastName}`;
        const disocountPerProduct = discount / cart.length;
        if (cart.length !== 0 && cart instanceof Array) {
            cart.forEach(function(item) {
                lineItems.push({ 
                    "product_id": item.product.id, 
                    "quantity": item.quantity,
                    "price": item.product.product,
                    "total": total - disocountPerProduct,
                    "subtotal": total,
                });
                orderNoteData.push(`For ${item.product.name} Color = ${item.color} Size = ${item.size} Character = ${item.character} `);
            }, this);
        }

        const toPay = (total - discount) + shipping;

        const orderData = {
        "payment_method": "cod",
        "payment_method_title": "Cash on Delivery",
        "customer_id": Object.keys(customer).length > 0 ? customer.id : 1,
        "set_paid": true,
        "discount_total": discount.toString(),
        "subtotal": total.toString(),
        "total": toPay.toString(),
        "billing": customerDetail,
        "shipping": customerDetail,
        "line_items": lineItems,
        "shipping_lines": [
            {
                "method_id": "flat_rate",
                "method_title": "Shipping Carges",
                "total": shipping
            }
        ],
        };

        if (Object.keys(couponLines).length !== 0) {
            orderData["coupon_lines"] = [{
                "code": couponLines.code,
                "discount": discount.toString(),
                "discount_tax": "0.00"
            }];
        }

        
        const orderNote = {
            "note": orderNoteData.toString()
        };


        return (
            <Container style={styles.container}>
                <Content>
                    <View style={[styles.block, { paddingTop: 10, paddingBottom: 10 }]}>
                        <Row>
                            <Left><H2>Shipping to</H2></Left>
                            <Right />
                        </Row>
                        <Col>
                            <Text note>{ fullName }</Text>
                            <Text note>{ address }</Text>
                            <Text note>{ phone }</Text>
                        </Col>
                    </View>
                    <Divider />
                    <View style={[styles.block]}>
                        <Row>
                        <Left><H2>Your order</H2></Left>
                        <Right />
                        </Row>
                        
                    </View>
                    { cart instanceof Array && <View style={styles.block}>
                        <List
                            style={{ height: 'auto' }}
                            dataArray={cart}
                            renderRow={item => this.renderCartItem(item)}
                        />
                    </View>}
                    <Divider />
                    <View style={[styles.block]}>
                        <H2>Payment Summary</H2>
                        <List>
                            <ListItem style={[styles.listItem]}>
                                <Body>
                                    <Text>Order Total</Text>
                                </Body>
                                <Right>
                                    <Text>{ total }</Text>
                                </Right>
                            </ListItem>

                            <ListItem style={[styles.listItem]}>
                                <Body>
                                    <Text>Discount</Text>
                                </Body>
                                <Right>
                                    <Text>Rs { discount }</Text>
                                </Right>
                            </ListItem>

                            <ListItem style={[styles.listItem]}>
                                <Body>
                                    <Text>Shipping Charges</Text>
                                </Body>
                                <Right>
                                    <Text>Rs { shipping }</Text>
                                </Right>
                            </ListItem>

                            <ListItem style={[styles.listItem]}>
                                <Body>
                                    <Text>Total Ammount</Text>
                                </Body>
                                <Right>
                                    <Text>Rs { (total - discount) + shipping }</Text>
                                </Right>
                            </ListItem>

                        </List>
                    </View>

                </Content>
                {/* } */}
                <Footer>
                    { !loading && 
                        <Button 
                            full 
                            style={{ flex: 1, height: '100%' }}
                            onPress={() => {
                                this.setState({ loading: true });
                                this.props.createOrder(orderData, navigation, orderNote);
                            }
                            }
                        >
                        <Text>Order Now</Text>
                    </Button>}
                    { loading && <Spinner size="small" /> }
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
function mapStateToProps({ customer, cart }) {
    return { customer, cart };
}

export default connect(mapStateToProps, actions)(Confirmation);
