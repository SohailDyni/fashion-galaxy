import React, { Component } from 'react';
import { View } from 'react-native';
import { 
    Container, Spinner, 
    Body, Content, List, Thumbnail, 
    ListItem, Text 
} from 'native-base';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { positions } from '../../MaterialValues';
import TopHeaderCat from '../TopHeaderCat';

class CategoriesListScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
    });

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            error: null,
            loading: true,
            refreshing: false,
        };
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    onListItemPress(id, name) {
        this.props.navigation.navigate('CategoriesSubListScreen', { id, name });
    }
    
    makeRemoteRequest = () => {
        try {
          fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products/categories?parent=0&per_page=20&hide_empty=true&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: res,
                    loading: false,
                    refreshing: false
                });
            });
        } catch (error) {
          console.error(error);
          this.setState({
              error,
              loading: false
          });
        }
    };

    renderContent() {
        if (this.state.loading) {
            return (
                <View 
                    style={[positions.alignItemCenter, positions.justifyContentCenter, { flex: 1 }]}
                >
                    <Spinner size="large" />
                </View>
            );
        }
        return (
            <Content>
                <List 
                    dataArray={this.state.data}
                    renderRow={category => this.renderListItems(category)}
                />
            </Content>
        );
    }

    renderListItems(category) {
        return (
            <ListItem 
                onPress={this.onListItemPress.bind(this, category.id, category.name)} 
                style={styles.listItems}
            >
                <Thumbnail 
                    square 
                    size={40} 
                    source={ 
                        category.image.length <= 0 ? 
                        require('../../../assets/images/img1.jpg') :
                        { uri: category.image.src }
                    }
                />
                <Body>
                    <Text>{ category.name }</Text>
                </Body>
            </ListItem>
        );
    }

    render() {
        return (
        <Container>
            { this.renderContent() }
        </Container>
        );
    }
}


const styles = {
    listItems: {
        marginLeft: 0,
        paddingLeft: 10,
        borderBottomColor: 'transparent',
    }
};

// https://exp-shell-app-assets.s3-us-west-1.amazonaws.com/android%2F%40sohaildanish%2Ffashiongalaxypk-b470060d-027c-11e8-86be-0a580a782813-signed.apk

export default connect(null, actions)(CategoriesListScreen);
