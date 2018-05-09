import React from 'react';
import { 
    View,
    Text, ActivityIndicator, 
} from 'react-native';

import {  
    Container,
    TabHeading, Tabs, Tab,
    ScrollableTab,
} from 'native-base';

import ProductRows from '../../components/ProductRows';
import TopHeaderCat from '../TopHeaderCat';
import { positions, themeColors } from '../../MaterialValues';
import SubCategoryScreen from './SubCategoryScreen';
import Chat from '../../components/Chat';

const shallowequal = require('shallowequal');

class MainCategoryScreen extends React.Component {

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
            noMoreProducts: false
        };
    }
    
    componentDidMount() {
        this.makeRemoteRequestForCats();        
        this.makeRemoteRequest();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowequal(this.state, nextState) && shallowequal(this.props, nextProps)) {
            return false;
        }
        return true; 
    }
    
    makeRemoteRequest = () => {
        const { params } = this.props.navigation.state;

        let catId = '';
        if ('catId' in params) {
            catId = `&category=${params.catId}`;
        }

        try {
          fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products?per_page=10&status=publish&page=${this.state.page}&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a${catId}`)
            .then(res => res.json())
            .then(res => {
                if (res.length !== 0 ) {
                    this.setState({
                        data: this.state.data.concat(res),
                        loading: false,
                        refreshing: false,
                        loadingMore: false,
                    });
                } else {
                    this.setState({
                        loading: false,
                        refreshing: false,
                        loadingMore: false,
                        noMoreProducts: true
                    });
                }
            }).catch(error => console.log(error));
        } catch (error) {
          console.error(error);
          this.setState({
              error,
              loading: false
          });
        }
    };

    makeRemoteRequestForCats = () => {
        const catId = this.props.navigation.state.params.catId;
        try {
          fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products/categories?parent=${catId}&per_page=20&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a&hide_empty=true`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    subCats: res,
                    loading: false,
                    refreshing: false
                });
            }).catch(error => console.log(error));
        } catch (error) {
          console.error(error);
          this.setState({
              error,
              loading: false
            });
        }
    }

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
        const { loading, noProducts, data, subCats } = this.state;
        if (loading) {
            return (
                <View 
                    style={[positions.alignItemCenter, positions.justifyContentCenter, { flex: 1 }]}
                >
                    <ActivityIndicator size="large" />
                </View>
            );
        } 
        if (subCats.length > 1) {
            const subProductsTabs = subCats.map((cat, index) => (
                <Tab 
                    heading={
                        <TabHeading 
                            style={{ backgroundColor: themeColors.color2 }} 
                        >
                            <Text style={{ color: 'white' }}>{ cat.name }</Text>
                        </TabHeading>
                    } 
                    key={index}
                >
                    <SubCategoryScreen navigation={this.props.navigation} catId={cat.id} />
                </Tab>
            ));
            return (
                <Tabs 
                    locked
                    renderTabBar={() => <ScrollableTab style={{ backgroundColor: themeColors.color2 }} />}
                >
                    <Tab 
                        heading={
                            <TabHeading 
                                style={{ backgroundColor: themeColors.color2 }} 
                            >
                            <Text style={{ color: 'white' }}>All</Text>
                            </TabHeading>
                        }
                    >
                       {!noProducts && 
                            // <View>
                            //     <FlatList
                            //         style={styles.container}
                            //         numColumns={2}
                            //         data={this.state.data}
                            //         renderItem={({ item }) => this.renderProduct(item)}
                            //         // onEndReachedThreshold={0.3}
                            //         // onEndReached={this.handleLoadMore}
                            //         getItemLayout={(data, index) => (
                            //             { length: 40, offset: 40 * index, index }
                            //         )}
                            //         keyExtractor={(item) => item.id}
                            //     />
                            //     <Button
                            //         full
                            //         outline
                            //     >
                            //         <Text>Load More</Text>
                            //     </Button>
                            // </View>
                            <ProductRows 
                                data={data} 
                                onEndReached={this.handleLoadMore}
                                navigation={this.props.navigation}
                                loading={this.state.loadingMore}
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()}
                            />                          
                        }

                        {noProducts && 
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>No Product found.</Text>
                        </View>}

                    </Tab>
    
                    { subProductsTabs }
    
                </Tabs>
            );
        }

        return (
            <View>
                {!noProducts && 
                    <ProductRows 
                        data={data} 
                        onEndReached={this.handleLoadMore}
                        navigation={this.props.navigation}
                        loading={this.state.loadingMore}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                    /> 
                }
                {noProducts && 
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>No Product found.</Text>
                    </View>
                }
            </View>            
        );
    }

    
    render() {
        return (
            <Container>
                { this.renderContent() }
                <Chat />
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

export default MainCategoryScreen;
