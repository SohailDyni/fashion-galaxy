import React from 'react';
import { Dimensions, View , FlatList} from 'react-native';
import { Spinner } from 'native-base';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';

import ListItem from './ListItem';

const shallowequal = require('shallowequal');

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};

export default class ProductRows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
        };
        const { width } = Dimensions.get('window');

        this._layoutProvider = new LayoutProvider(
            index => {
                if (index % 2 === 0) {
                    return ViewTypes.HALF_LEFT;
                } 
                return ViewTypes.HALF_RIGHT;
            },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.HALF_LEFT:
                        dim.width = width / 2;
                        dim.height = 285;
                        break;
                    case ViewTypes.HALF_RIGHT:
                        dim.width = width / 2;
                        dim.height = 285;
                        break;
                    case ViewTypes.FULL:
                        dim.width = width;
                        dim.height = 140;
                        break;
                    default:
                        dim.width = width / 2;
                        dim.height = 285;
                }
            }
        );

        this._rowRenderer = this.renderProduct.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if (shallowequal(this.state, nextState) && shallowequal(this.props, nextProps)) {
            return false;
        }
        return true; 
    }

    onCardPressed = product => this.props.navigation.navigate('ProductDetail', { product });    
    

    renderProduct = (product, index) => (
        <ListItem
            key={index} 
            product={product}
            navigation={this.props.navigation}
            navigation={this.props.navigation}
        />
    );

    renderFooter = () => {
        const { loading } = this.props;
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {loading && <Spinner size="small" />}
            </View>
        );
    }
    
    
    render() {
        const dataProvider = new DataProvider((r1, r2) => r1 !== r2);
        const { data } = this.props;
        return (
            // <RecyclerListView 
            //     {...this.props}
            //     layoutProvider={this._layoutProvider} 
            //     dataProvider={dataProvider.cloneWithRows(data)} 
            //     rowRenderer={this._rowRenderer} 
            //     keyExtractor={(item) => item.id}
            //     onEndReachedThreshold={350}
            //     renderFooter={() => this.renderFooter()}
            // /> 
            <FlatList
                {...this.props}
                numColumns={2}
                data={data}
                renderItem={({ item, index }) => this.renderProduct(item, index)}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={350}
                ListFooterComponent={() => this.renderFooter()}
            />
        );
    }
}
