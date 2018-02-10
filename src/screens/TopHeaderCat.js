import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Row, Icon, Header, Input, Title, Text } from 'native-base';
import { connect } from 'react-redux';
import IconBadge from 'react-native-icon-badge';

import { themeColors } from '../MaterialValues';

class TopHeaderCat extends React.Component {

    constructor() {
        super();
        this.state = { 
            search: '',
            showSearch: false, 
        };
    }

    backPage = () => {
        const { navigation } = this.props;
        if (this.props.backPage) {
            navigation.navigate(this.props.backPage);
        } else if (navigation.state.params.back) {
            navigation.navigate(navigation.state.params.back);
        } else {
            navigation.goBack();
        }
    }

    renderTitle = () => {
        const { navigation } = this.props; 
        if ('params' in navigation.state) {
            if ('name' in navigation.state.params) {
                return navigation.state.params.name;
            }
        }
        return navigation.state.routeName;
    }

    render() {
        const { navigation } = this.props;
        const { showSearch, search } = this.state;
        return (
            <Header style={styles.header} searchBar rounded>
                { !showSearch && 
                <Row style={[styles.row, { justifyContent: 'space-between' }]}>
                    <TouchableOpacity 
                        transparent 
                        small 
                        style={{ paddingLeft: 0 }}
                    >
                        <Icon 
                            name="md-arrow-round-back" 
                            onPress={() => this.backPage()}
                            style={{ color: 'white',
                            fontSize: 23,
                            lineHeight: 25, }}
                        />
                    </TouchableOpacity>
                    <Title style={styles.title}>
                        {this.renderTitle()}
                    </Title>     
                </Row> }
                { showSearch && 
                <Row style={[styles.row, { justifyContent: 'space-between' }]}>
                    <TouchableOpacity 
                        transparent 
                        small 
                        style={{ paddingLeft: 0 }}
                    >
                        <Icon 
                            name="md-arrow-round-back" 
                            onPress={() => this.backPage()}
                            style={{ color: 'white',
                            fontSize: 23,
                            lineHeight: 25, }}
                        />
                    </TouchableOpacity>
                    <Input 
                        placeholder="Search" style={{ paddingLeft: 10, color: 'white' }}
                        value={search}
                        autoFocus
                        onChangeText={query => this.setState({ search: query })}
                        returnKeyType="search"
                        onSubmitEditing={() => navigation.navigate('ProductSearch', 
                        { search: this.state.search, name: this.state.search })}
                    />
                    <TouchableOpacity 
                        transparent 
                        small 
                        style={{ paddingRight: 0 }} 
                        onPress={() => 
                        navigation.navigate('ProductSearch', { search: this.state.search })}
                    >
                        <Icon style={styles.icons} name="md-search" />
                    </TouchableOpacity>
                </Row> }
                { !showSearch && 
                <Row style={[styles.row, { justifyContent: 'flex-end' }]}>
                    <TouchableOpacity 
                        transparent 
                        small 
                        style={{ paddingRight: 0 }} 
                        onPress={() => this.setState({ showSearch: true })}
                    >
                        <Icon style={styles.icons} name="md-search" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CartScreen')}
                    >
                    <IconBadge
                        MainElement={
                        <TouchableOpacity 
                        transparent 
                        small 
                        style={styles.iconButton}
                        >
                            <Icon 
                                style={styles.icons} 
                                name="md-cart" 
                                onPress={() => navigation.navigate('CartScreen')} 
                            />
                        </TouchableOpacity>
                        }
                        BadgeElement={
                            // <TouchableOpacity
                            // onPress={() => navigation.navigate('CartScreen')}
                            // >
                                <Text 
                                    style={{ color: '#FFFFFF', fontSize: 10 }}
                                >
                                    {this.props.cart}
                                </Text>
                            // </TouchableOpacity>
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

                </Row>}
            </Header>
        );
    }
}

const styles = {
    header: { 
        alignItems: 'center',
        height: 80,
        paddingTop: 30,
        paddingBottom: 10,
        justifyContent: 'space-between',
        backgroundColor: themeColors.color1
    },
    row: { 
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        color: 'white'
    },
    icons: {
        marginLeft: 30,
        color: 'white',
        fontSize: 23,
        lineHeight: 25,
    },
    iconButton: {
        paddingRight: 0
    }
};

function mapStateToProps(state) {
    return { cart: state.cart.length };
}

export default connect(mapStateToProps)(TopHeaderCat);

