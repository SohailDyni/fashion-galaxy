import React from 'react';
import { View, TouchableOpacity, Image, Text as NText, 
    ListView, Animated, TextInput, Alert, TouchableHighlight,
    KeyboardAvoidingView, Modal, TouchableWithoutFeedback
} from 'react-native';
import {  
    Card, List, Icon, Button, Right, Container,
    Row, Content, CardItem, Col, Body, Left,
    Footer, FooterTab, Text, Form, Item, Input, Spinner,
    CheckBox, ListItem
} from 'native-base';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';

import * as actions from '../actions';
import TopHeader from './TopHeader';
import { priceFont, themeColors } from '../MaterialValues';
// import Modal from '../components/Modal';

const shallowequal = require('shallowequal');

let isHidden = true;

class CartScreen extends React.Component {

    static navigationOptions = { header: null };
    
    constructor(props) {
        super(props);        
        const { cart } = props;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: cart || [],
            bounceValue: new Animated.Value(220),
            iconName: 'md-arrow-dropdown',
            colorSelected: [],
            sizeSelected: [],
            quantitySelected: [], 
            isEmpty: true,
            shipping: 100,
            couponCode: '',
            loading: false,
            total: 0,
            discount: 0,
            couponLines: {},
            toastDisplayed: false,
            codeDiscount: 0,
            modalVisible: false
        };
    }

    componentDidMount() {
        this.initializeAmount(this.state);
        this.showToast();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowequal(this.state, nextState) && shallowequal(this.props, nextProps)) {
            return false;
        }
        return true; 
    }

    componentWillUpdate(nextProps, nextState) {
        this.initializeAmount(nextState);
    }

    onButtonPress = () => {
        this.props.fetchProducts(() => {
            this.props.navigation.navigate('category', { name: 'Kids' });
        });
    }

    getProductThumbnail = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-300x300.${extension}`;
    }

    showToast() {
        if (!this.state.toastDisplayed) {
            Toast.show('Swipe the item to remove it form list.', Toast.LONG);
            this.setState({ toastDisplayed: true });
        }
    }

    initializeAmount(myState) {
        const { listViewData } = myState;
        let totalNew = 0;
        listViewData.forEach(cartL => {
            if (cartL.isChecked) {
                totalNew += (cartL.quantity) * cartL.product.price;
            }
        }, this);
        this.setState({ total: totalNew });
        const netTotal = totalNew;

        if (netTotal >= 3000 && netTotal < 6000) {
            this.setState({ discount: Math.round(netTotal * 0.05) });
        } else if (netTotal >= 6000 && netTotal < 10000) {
            this.setState({ discount: Math.round(netTotal * 0.07) });
        } else if (netTotal >= 10000) {
            this.setState({ discount: Math.round(netTotal * 0.1) });
        }
    }

    applyCoupon = () => {
        const { couponCode, total } = this.state;
        let discount = 0;
        const netTotal = total;
        if (couponCode === '') {
            return;
        }
        this.setState({ loading: true });

        try {
            fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/coupons?code=${couponCode}&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`)
            .then(res => res.json())
            .then(res => {
                if (res.length !== 0) {
                    const coupon = res[0];
                    const { discount_type, amount, id, usage_count, usage_limit, date_expires } = coupon;
                    if (usage_count === usage_limit) {
                        Toast.show('Sorry! Coupon usage limit has been reached.', Toast.LONG);
                        this.setState({ 
                            loading: false,
                            couponCode: '',
                        });
                    } else if (Date.now() > Date.parse(date_expires)) {
                        Toast.show('Sorry! This coupon has expired.', Toast.LONG);
                        this.setState({ 
                            loading: false,
                            couponCode: '',
                        });
                    } else {
                        if (discount_type === 'percent') {
                            discount = Math.round(netTotal * (parseFloat(amount) / 100));
                        } else if (discount_type === 'fixed_cart') {
                            discount = Math.round(parseFloat(amount));
                        }

                        Toast.show('Coupon code applied successfully.', Toast.LONG);
                        this.setState({ 
                            loading: false,
                            couponCode: '',
                            codeDiscount: discount,
                            couponLines: { id, code: couponCode }
                        });
                    }
                } else {
                    this.setState({ 
                        loading: false,
                        couponCode: '',
                    });
                }
            });
        } catch (error) {
            console.error(error);
            this.setState({
                error,
                loading: false
            });
        }
    }


    deleteRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.listViewData];
        newData.splice(rowId, 1);
        this.setState({ listViewData: newData });
    }

    changeShipping = () => this.setState({ shipping: 150 });

    _toggleSubview() {
        this.setState({
          iconName: isHidden ? 'md-arrow-dropup' : 'md-arrow-dropdown'
        });
    
        let toValue = 220;
    
        if (isHidden) {
          toValue = 0;
        }
    
        Animated.spring(
          this.state.bounceValue,
          {
            toValue,
            velocity: 3,
            tension: 2,
            friction: 8,
          }
        ).start();
        isHidden = !isHidden;        
    }
    
    renderProduct = (item, index) => {
        const { product, } = item;
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

        
        if (product.shipping_class_id === 740) {
            this.shipping = 150 * item.quantity;
        }

        return (
            <Card style={{ padding: 5, marginLeft: 0 }}>
                <ListItem style={{ marginLeft: 14, borderBottomColor: 'transparent' }}>
                       <View
                            style={{ marginRight: 15, marginLeft: 0 }}
                       >
                        <CheckBox 
                            checked={item.isChecked}
                            onPress={() => { 
                                const carts = [...this.state.listViewData];
                                    carts[index].isChecked = !carts[index].isChecked;
                                    this.setState({ listViewData: carts });
                            }}
                        />
                        </View>
                        <TouchableHighlight
                            onPress={() => this.props.navigation.navigate('ProductDetail', { product })}
                        >
                            <Image 
                                style={{ width: 100, height: 100 }} 
                                source={{ uri: this.getProductThumbnail(product.images[0].src) }} 
                            />
                        </TouchableHighlight>
                        <Col style={{ justifyContent: 'space-between', paddingLeft: 5 }}>  
                            <Text style={{ textAlign: 'right' }}>{product.name }</Text>
                            <Text style={priceFont}>Rs. { product.price }</Text>
                            { hasSizes && <Text style={{ textAlign: 'right' }}>Size: { item.size }</Text>}
                            { hasColors && <Text style={{ textAlign: 'right' }}>Color: { item.color }</Text>}
                            { hasCharacters && <Text style={{ textAlign: 'right' }}>Character: { item.character }</Text>}
                        </Col>
                </ListItem>
                <ListItem style={{ marginLeft: 0, paddingTop: 0, paddingRight: 0, justifyContent: 'center', alignItems: 'center', flex: 1, borderBottomColor: 'transparent', paddingBottom: 0 }}>
                    
                    <Button 
                    style={styles.incDecButton}
                    onPress={() => { 
                        const carts = [...this.state.listViewData];
                            carts[index].quantity += 1;
                            this.setState({ listViewData: carts });
                    }}
                    >
                        <NText>+</NText>
                    </Button>
                    <Text style={{ paddingLeft: 10, paddingRight: 10 }}>
                    { this.state.listViewData[index].quantity }
                    </Text>
                    <Button 
                        style={styles.incDecButton}
                        onPress={() => { 
                            const carts = [...this.state.listViewData];
                            if (carts[index].quantity > 1) {
                                carts[index].quantity -= 1;
                                this.setState({ listViewData: carts }); 
                            }
                        }}
                    >
                        <NText>-</NText>
                    </Button>
                    
                </ListItem>
                {/* <Row>
                    <Left />
                    <Body>
                            <Button 
                            style={styles.incDecButton}
							onPress={() => { 
								const carts = [...this.state.listViewData];
                                    carts[index].quantity += 1;
                                    this.setState({ listViewData: carts });
							}}
                            >
                                <NText>+</NText>
                            </Button>
                            <Text style={{ paddingLeft: 10, paddingRight: 10 }}>
                            { this.state.listViewData[index].quantity }
                            </Text>
                            <Button 
                                style={styles.incDecButton}
                                onPress={() => { 
                                    const carts = [...this.state.listViewData];
                                    carts[index].quantity -= 1;
                                    this.setState({ listViewData: carts }); 
                                }}
                            >
                                <NText>-</NText>
                            </Button>
                    </Body>
                    <Right />
                </Row> */}

            </Card>
        );
    }


    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const { navigation, cart } = this.props;
        const { 
                listViewData, shipping, couponCode, loading, 
                discount, total, couponLines, codeDiscount,
            } = this.state;

        
        const toPay = (total - (discount + codeDiscount)) + shipping;
       
        return (
            <Container style={styles.container}>
                <TopHeader navigation={navigation} />
               { listViewData.length > 0 && 
               
               <Content>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={-20} 
                        behavior={'position'} 
                    >
                    <List
                        dataSource={this.ds.cloneWithRows(listViewData)}
                        renderRow={(item, indexS, index) => this.renderProduct(item, index)}
                        renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                        <Button 
                            full 
                            danger 
                            onPress={() => this.props.deleteObjCart(rowId, this.props.fetchCart)}
                        >
                            <Icon active name="trash" />
                        </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                        <Button 
                            full 
                            danger 
                            onPress={() => {
                                this.props.deleteObjCart(rowId, this.props.fetchCart);
                                this.deleteRow(secId, rowId, rowMap);
                            }}
                        >
                            <Icon active name="trash" />
                        </Button>}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />
                    
                            
                        <Form
                            style={{ 
                                backgroundColor: 'white',
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Item
                                regular
                                style={{ borderColor: themeColors.color2 }}
                            >
                                <Input 
                                    placeholder='Coupon Code'
                                    onChangeText={code => this.setState({ couponCode: code })}
                                    value={couponCode}
                                    onSubmitEditing={() => this.applyCoupon()}
                                />
                                {loading && 
                                    <Spinner 
                                        size="small" 
                                        style={{ 
                                            height: '10%',
                                            width: '28%', 
                                        }}
                                    />
                                }

                                {!loading && <Button 
                                    full 
                                    onPress={() => this.applyCoupon()}
                                    style={{ 
                                        height: '100%',
                                        width: '28%', 
                                        justifyContent: 'center', 
                                        backgroundColor: themeColors.color2 
                                    }}
                                >   
                                    <Text style={{ fontSize: 15 }}>Apply</Text>
                                </Button>}
                            </Item>
                            
                        </Form>
                    </KeyboardAvoidingView>
                    <Card>
                        <CardItem>
                            <Col>
                                <View>
                                    <Text 
                                        style={{ marginBottom: 15 }}
                                    >Summary { listViewData.length } 
                                    { listViewData.length === 1 ? ' item' : ' items' }</Text>
                                </View>
                                <View style={styles.summaryView}>
                                    <Text style={styles.totalText}>Subtotal: </Text>
                                    <Text style={styles.totalText}>Rs {total}</Text>
                                </View>
                                <View style={styles.summaryView}>
                                    <Text style={styles.totalText}>Shipping: </Text>
                                    <Text style={styles.totalText}>Rs {shipping}</Text>
                                </View>
                                <View style={styles.summaryView}>
                                    <Text style={styles.totalText}>Discount: </Text>
                                    <Text style={styles.totalText}>Rs {discount + codeDiscount}</Text>
                                </View>
                                <View style={styles.summaryView}>
                                    <Text>Total: </Text>
                                    <Text>Rs {toPay}</Text>
                                </View>
                            </Col>
                        </CardItem>
                    </Card>
                </Content> 
                }
                { listViewData.length === 0 && 
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>Your Cart is empty</Text>
                </View>
                }
                { listViewData.length > 0 && 
                    <Animated.View 
                        style={ 
                            [styles.detailCard,
                            { transform: [{ translateY: this.state.bounceValue }] }]
                        }
                    >
                    <Card>
                        <CardItem style={{ paddingBottom: 0 }}>
                            <TouchableOpacity onPress={() => this._toggleSubview()}>
                                <Icon name="close" />
                            </TouchableOpacity>
                            <Text style={styles.priceStyle}>Summary</Text>
                        </CardItem>
                        <CardItem>
                            <Col>
                            <View>
                            <Text 
                                style={{ marginBottom: 15 }}
                            >Summary { listViewData.length } 
                            { listViewData.length === 1 ? 'item' : 'items' }</Text>
                            </View>
                            <View style={styles.summaryView}>
                                <Text style={styles.totalText}>Subtotal: </Text>
                                <Text style={styles.totalText}>Rs {total}</Text>
                            </View>
                            <View style={styles.summaryView}>
                                <Text style={styles.totalText}>Shipping: </Text>
                                <Text style={styles.totalText}>Rs {shipping}</Text>
                            </View>
                            <View style={styles.summaryView}>
                                <Text style={styles.totalText}>Discount: </Text>
                                <Text style={styles.totalText}>Rs {discount + codeDiscount}</Text>
                            </View>
                            <View style={styles.summaryView}>
                                <Text>Total: </Text>
                                <Text>Rs {toPay}</Text>
                            </View>
                            </Col>
                        </CardItem>
                    </Card>
                    
                </Animated.View>}

                { listViewData.length > 0 && 
                <Footer
                    style={{ backgroundColor: themeColors.color2 }}
                >
                    <FooterTab style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <Left>
                            <TouchableOpacity onPress={() => this._toggleSubview()}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ color: 'white' }}>Total</Text>
                                <Icon 
                                    name={this.state.iconName} 
                                    style={{ fontSize: 20, paddingLeft: 5 }} 
                                />
                            </View>
                                <Text style={styles.priceStyle}>Rs {toPay}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <Button 
                                success 
                                small 
                                style={{ padding: 20 }}
                                onPress={() => {
                                    let hasProds = false;
                                    for (let i = 0; i < listViewData.length; i++) {
                                       const single = listViewData[i];
                                        if (single.isChecked) {
                                           hasProds = true;
                                           break;
                                        }
                                    }
                                    const discount1 = discount + codeDiscount;

                                    if (hasProds) {
                                        if(toPay < 1300 && discount1 > 0){
                                            Alert.alert('Order Limit', 'Minimum order ammount is 1200');
                                        } else if(toPay < 700 && discount1 == 0){
                                            Alert.alert('Order Limit', 'Minimum order ammount is 600');
                                        } else{
                                            navigation.navigate('Checkout', 
                                            { total, shipping, discount: discount1, couponLines });
                                        }
                                        
                                    } else {
                                        Alert.alert('No Product Selected', 'Please select any product to continue.');
                                    }
                                }}
                            >
                                <Text style={{ color: 'white' }}>Buy</Text>
                            </Button>
                        </Right>
                    </FooterTab>
                </Footer>}
                

            </Container>
        );
    }

}

const styles = {
    container: {
        // paddingLeft: 5, 
        // paddingRight: 5,
    },
    titleContainer: {
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    image: {
        height: 150, 
        width: 150,
    },
    priceStyle: {
        fontWeight: 'bold',
        color: 'white'
    },
    incDecButton: {
        width: 40,
        height: 40,
        borderRadius: 0,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',

    },
    detailCard: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        height: 220,

    },
    summaryView: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    totalText: {
        color: '#696969',
        fontSize: 12,
    },
};

function mapStateToProps({ cart }) {
    return { cart };
}

export default connect(mapStateToProps, actions)(CartScreen);
