import React from 'react';
import { View, Image, ListView } from 'react-native';
import {  
    List, Icon, Button, ListItem, Right, Container,
    Row, Content, Col, Body, Left,
    Text
} from 'native-base';
import { connect } from 'react-redux';

import TopHeaderCat from '../TopHeaderCat';
import { fonts, priceFont } from '../../MaterialValues';
import * as actions from '../../actions';


class Wishlist extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
    });

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            listViewData: props.wishlist || [],
        };
    }

    componentWillMount() {
        this.props.fetchWishlist();        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.wishlist !== this.props.wishlist) {
            this.setState({ listViewData: nextProps.wishlist });
        }
    }


    deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
    }
    

    renderProduct = (product, rowId) => {

        const that = this;
        let hasColors = null;
        let isVariable = false;
        let hasSizes = null;
        if (product.type === 'variable') {
            isVariable = true;
            for (let i = 0; i < product.attributes.length; i++) {
                if (product.attributes[i].name === 'color') {
                    hasColors = product.attributes[i].options[0];
                }
                if (product.attributes[i].name === 'Sizes' || 
                    product.attributes[i].name === 'Size') {
                    hasSizes = product.attributes[i].options[0];
                }
            }
        }

        function printStock() {
            if (product.manage_stock) {
                return product.in_stock ? 'In Stock' : 'Out of Stock';
            }
        }

        function addToCart() {
            that.props.addToCart({
                product,
                quantity: 1,
                color: hasColors,
                size: hasSizes,
            });
            that.props.deleteObjWishlist(rowId, that.props.fetchWishlist);
        }

        return (
            <ListItem style={{ padding: 10 }}>
                <Row>
                    <Left >
                        <Image 
                            style={{ width: 100, height: 100 }} 
                            source={{ uri: product.images[0].src }} 
                        />
                    </Left>
                    <Body>
                        <Col 
                            style={{ 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start' 
                            }}
                        >  
                            <Text style={fonts.align.center}>{product.name }</Text>
                            <Text 
                                style={[priceFont, fonts.align.center]}
                            >Rs. {product.price }</Text>
                            <Button 
                                rounded small
                                onPress={() => addToCart()}
                            >
                                <Text style={fonts.sizes.caption}>Add to Cart</Text>
                            </Button>
                        </Col>
                    </Body>
                    <Right>
                        { product.manage_stock && <Text>{ printStock() }</Text>}
                    </Right>
                </Row>

            </ListItem>
        );
    }


    render() {
        // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const { listViewData } = this.state;
        return (
            <Container style={styles.container}>
                { listViewData.length > 0 && <Content>
                <List
                    dataSource={this.ds.cloneWithRows(listViewData)}
                    renderRow={(item, sectionID, rowID) => this.renderProduct(item, rowID)}
                    renderLeftHiddenRow={data =>
                    <Button full onPress={() => alert(data)}>
                        <Icon active name="information-circle" />
                    </Button>}
                    renderRightHiddenRow={(data, secId, rowId) =>
                    <Button 
                        full danger 
                        onPress={() => 
                        this.props.deleteObjWishlist(rowId, this.props.fetchWishlist)}
                    >
                        <Icon active name="trash" />
                    </Button>}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                />
                </Content>}
                { listViewData.length === 0 && <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>Your Wishlist is empty</Text>
                    </View>
                }
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
        height: 200,

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
    }
  
};

function mapStateToProps({ wishlist }) {
    return { wishlist };
}

export const WishlistScreen = connect(mapStateToProps, actions)(Wishlist);
