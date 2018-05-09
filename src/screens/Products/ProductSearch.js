import React from 'react';
import { 
    View,
    Text, ActivityIndicator 
} from 'react-native';
import {
    Container 
} from 'native-base';

import ProductRows from '../../components/ProductRows';
import TopHeaderCat from '../TopHeaderCat';
import { positions } from '../../MaterialValues';

class ProductSearch extends React.Component {

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
            subCats: [],
            subProducts: [],
            noProducts: false,
            loadingMore: false,
            noMoreProducts: false,
        };
    }


    componentDidMount() {
        this.makeRemoteRequest();
    }

    onCardPressed = product => this.props.navigation.navigate('ProductDetail', { product });      
    
    makeRemoteRequest = () => {
        const search = this.props.navigation.state.params.search != null ? 
            `&search=${this.props.navigation.state.params.search}` : 
            '';

        try {
          fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products?per_page=10&page=${this.state.page}&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a${search}`)
            .then(res => res.json())
            .then(res => {
                if (res.length !== 0) {
                    this.setState({
                        data: this.state.page === 1 ? res : [...this.state.data, ...res],
                        loading: false,
                        refreshing: false,
                        loadingMore: false,
                    });
                } else if( this.state.page === 1 ) {
                    this.setState({
                        noProducts: true,
                        loading: false,
                        refreshing: false,
                        loadingMore: false
                    });
                } else {
                    this.setState({
                        loading: false,
                        refreshing: false,
                        loadingMore: false,
                        noMoreProducts: true
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
    };

    handleLoadMore = () => {
        if (!this.state.noMoreProducts) {
            this.setState(
                {
                page: this.state.page + 1,
                loadingMore: true
                },
                () => {
                this.makeRemoteRequest();
                }
            );
        }
    };

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            page: 1,
            data: []
        }, () => this.makeRemoteRequest());
    }

    renderContent() {
        const { data, noProducts, loadingMore } = this.state;
        if (noProducts) {
            return (
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>Your search query didn't match with any product.</Text> 
                </View>
            );
        }
        return (
            <ProductRows 
                data={data} 
                onEndReached={this.handleLoadMore}
                navigation={this.props.navigation}
                loading={this.state.loadingMore}
                refreshing={this.state.refreshing}
                onRefresh={() => this.handleRefresh()}
            />
            
        );
    }

    
    render() {
        const { loading } = this.state;
        return (
            <Container>
            { loading &&
                <View 
                    style={
                        [positions.alignItemCenter, 
                        positions.justifyContentCenter, { flex: 1 }]
                    }
                >
                    <ActivityIndicator size="large" />
                </View>
            }
            { !loading &&
                this.renderContent()
             }
            </Container>
        );
    }

}

const styles = {
    container: {
        paddingLeft: 5, 
        paddingRight: 5
       },
    titleContainer: {
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    image: {
        // height: 170, 
        height: 190,         
        // width: 170,
        // resizeMode: 'cover'
        width: null,
        flex: 1,
        alignSelf: 'center',
    },
    priceStyle: {
        fontWeight: 'bold',
    }
};


export default ProductSearch;
