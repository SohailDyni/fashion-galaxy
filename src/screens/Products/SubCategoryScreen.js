import React from 'react';
import { View, 
    ActivityIndicator,
} from 'react-native';
import { Container } from 'native-base';

import ProductRows from '../../components/ProductRows';
import { positions } from '../../MaterialValues';

class SubCategoryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            error: null,
            loading: true,
            refreshing: false,
            loadingMore: false,
            noMoreProducts: false
        };
    }
    

    componentDidMount() {
        this.makeRemoteRequest();
    }
    
    makeRemoteRequest = () => {
        const catId = this.props.catId != null ? `&category=${this.props.catId}` : '';
        try {
          fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products?per_page=10&status=publish&page=${this.state.page}&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a${catId}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: this.state.page === 1 ? res : [...this.state.data, ...res],
                    loading: false,
                    refreshing: false,
                    loadingMore: false
                });
            }).catch(error => console.log(error));
        } catch (error) {
          console.error(error);
          this.setState({
              error,
              loading: false
          });
        }
    };


    handleLoadMore = () => {
        if( !this.state.noMoreProducts ){
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
        const { data } = this.state;
        if (this.state.loading) {
            return (
                <View 
                    style={[positions.alignItemCenter, 
                    positions.justifyContentCenter, { flex: 1 }]}
                >
                    <ActivityIndicator size="large" />
                </View>
            );
        }
           
        return (
            <ProductRows 
                data={data} 
                onEndReached={this.handleLoadMore}
                navigation={this.props.navigation} 
                refreshing={this.state.refreshing}
                onRefresh={() => this.handleRefresh()}
                loading={this.state.loadingMore}
            />
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
    container: {
        paddingLeft: 5, 
        paddingRight: 5
       },
    titleContainer: {
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    image: {
        height: 190, 
        // width: (WINDOW_WIDTH / 2) - 30,
        width: null,
        flex: 1,
        resizeMode: 'stretch'
        // alignSelf: 'contain',
    },
    priceStyle: {
        fontWeight: 'bold',
    }
  
};


export default SubCategoryScreen;
