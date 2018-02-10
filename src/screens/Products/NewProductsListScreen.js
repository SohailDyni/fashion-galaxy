import React from 'react';
import { 
    View,
    Text, ActivityIndicator 
} from 'react-native';
import {
    Container,
} from 'native-base';

import ProductRows from '../../components/ProductRows';
import TopHeaderCat from '../TopHeaderCat';
import { positions } from '../../MaterialValues';


class NewProductsListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
    });

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 2,
            error: null,
            loading: true,
            refreshing: false,
            subCats: [],
            subProducts: [],
        };
    }


    componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        const query = this.props.navigation.state.params.query;

        try {
          fetch(`${query}&per_page=10&page=${this.state.page}`)
            .then(res => res.json())
            .then(res => {
            this.setState({
                data: this.state.page === 2 ? res : [...this.state.data, ...res],
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

    handleLoadMore = () => {
        this.setState(
            {
            page: this.state.page + 1
            },
            () => {
            this.makeRemoteRequest();
            }
        );
    };
    
    render() {
        const { data, loading } = this.state;
        return (
            <Container>

                {loading && <View 
                    style={
                        [positions.alignItemCenter, 
                        positions.justifyContentCenter, { flex: 1 }]
                    }
                >
                    <ActivityIndicator size="large" />
                </View>}
                
                {!loading && data.length > 0 &&
                    <ProductRows 
                        data={data} 
                        onEndReached={this.handleLoadMore}
                        navigation={this.props.navigation}
                    />
                }

                { !loading && data.length === 0 && <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>No product Found</Text> 
                    </View>
                }
            </Container>
        );
    }

}

export default NewProductsListScreen;
