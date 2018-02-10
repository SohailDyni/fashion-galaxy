import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, Icon, Header, Item, Input, } from 'native-base';
import { connect } from 'react-redux';
import IconBadge from 'react-native-icon-badge';

import { themeColors } from '../MaterialValues';

class TopHeader extends React.Component {
    
    state = { search: '' }

    render() {
        const { navigation } = this.props;
        return (
                <Header 
                    style={{ 
                        alignItems: 'center', 
                        height: 80, 
                        paddingTop: 30,
                        paddingBottom: 10,
                        backgroundColor: themeColors.color1 
                    }} 
                    searchBar rounded
                >
                    <TouchableOpacity 
                        small style={{ alignItems: 'center' }}
                        onPress={() => this.props.navigation.navigate('DrawerOpen')} 
                    >
                        <Icon name="menu" style={styles.icon} />
                    </TouchableOpacity>          
                    <Item style={{ height: 35, marginLeft: 15, }}>
                        <Input 
                            placeholder="Search" style={{ paddingLeft: 10 }}
                            value={this.state.search}
                            onChangeText={query => this.setState({ search: query })}
                            returnKeyType="search"
                            onSubmitEditing={() => navigation.navigate('ProductSearch', 
                            { search: this.state.search, name: this.state.search })}
                        />
                        <Icon 
                            name="ios-search" 
                            onPress={() => navigation.navigate('ProductSearch', 
                            { search: this.state.search, name: this.state.search })} 
                        />
                    </Item>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CartScreen')}
                    >
                    <IconBadge
                        
                        MainElement={
                        <TouchableOpacity style={styles.iconButton}>
                            <Icon 
                                style={styles.icon} 
                                name="md-cart" 
                                onPress={() => navigation.navigate('CartScreen')} 
                            />
                        </TouchableOpacity>
                        }
                        BadgeElement={
                            <Text 
                                style={{ color: '#FFFFFF', fontSize: 10 }}
                            >
                                {this.props.cart}
                            </Text>
                        }
                        IconBadgeStyle={{
                            width: 4,
                            height: 18,
                            top: 0,
                            right: 0,
                            borderRadius: 15,
                            backgroundColor: 'rgb(247,64,68)'
                        }}
                        Hidden={this.props.cart === 0}
                    />
                    </TouchableOpacity>
                </Header>
        );
    }
}

const styles = {
    badge: {
        position: 'absolute', top: -5, width: 10, height: 10, right: 0, alignItems: 'center'
    },
    iconButton: {
        marginLeft: 15, 
    },
    badgeText: {
        fontSize: 7, 
        paddingLeft: 0, 
        paddingBottom: 0, 
        paddingRight: 0, 
        paddingTop: 0, 
        marginTop: 0, 
        lineHeight: 7
    },
    icon: {
        fontSize: 23,
        lineHeight: 25,
        color: '#ffffff'
    }
};

function mapStateToProps(state) {
    return { cart: state.cart.length };
}

export default connect(mapStateToProps)(TopHeader);
