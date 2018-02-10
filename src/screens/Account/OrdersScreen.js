import React from 'react';
import { View } from 'react-native';
import { Button, Icon, List, ListItem, Right, 
    Row, Left, Content, Container, Col, Text
} from 'native-base';
import { connect } from 'react-redux';

import TopHeaderCat from '../TopHeaderCat';

import { positions } from '../../MaterialValues';
import * as actions from '../../actions';

export class Ordersscreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
    });

    renderOrder = order => {

        const d = new Date(order.date_created);
        const orderDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        return (
            <ListItem style={styles.listItem}>
                <View>
                    <Col>
                        <Text style={{ marginBottom: 5 }}>{orderDate}</Text>
                        <Text>Order no. { order.number } </Text>
                    </Col>
                </View>
                <View>
                    <Row style={[positions.alignItemCenter]}>
                        <Text style={{ marginRight: 5 }}>{ order.status }</Text>
                    </Row>
                </View>
            </ListItem>
        );
    }

     
    render() {
        const { orders, customer, navigation } = this.props;
        const isLogedIn = Object.keys(customer).length > 0; 
        return (
            <Container>
                { isLogedIn && orders.length > 0 &&
                    <Content>
                        <List 
                            dataArray={orders} 
                            style={{ backgroundColor: 'white' }}
                            renderRow={item => this.renderOrder(item)}
                        />
                    </Content> 
                }

                { isLogedIn && orders.length === 0 && <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>Your Orders List is empty</Text>
                    </View>
                }

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

function mapStateToProps({ orders, customer }) {
    return { orders, customer };
}

export const OrdersScreen = connect(mapStateToProps, actions)(Ordersscreen);

const styles = {
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    listItem: {
        height: 100,
        justifyContent: 'space-between'
    },
    notLogin: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    notLoginBtn: {
        alignSelf: 'center',
        marginTop: 15,
        width: 150,
        justifyContent: 'center'
    }
};

