import React from 'react';
import { 
    TouchableOpacity,
    Text, Image,
} from 'react-native';
import {  
    CardItem,
    Card,
} from 'native-base';

export default class ListItem extends React.PureComponent {

    onCardPressed = product => this.props.navigation.navigate('ProductDetail', { product });    
    
    getProductThumnail = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-300x300.${extension}`;
    }

    render() {
        const { product } = this.props;
        return (
            <Card style={{ flex: 0.5 }}>
                <TouchableOpacity onPress={() => this.onCardPressed(product)}>
                <CardItem cardBody>
                    <Image
                        style={styles.image}
                        resizeMode="stretch"
                        source={{ uri: this.getProductThumnail(product.images[0].src) }}  
                    />
                </CardItem>
                <CardItem style={styles.titleContainer}>
                    <Text style={{ fontSize: 12 }} numberOfLines={3}>{product.name}</Text>
                    <Text style={styles.priceStyle}>Rs. {product.price }</Text>
                </CardItem>
                </TouchableOpacity>
            </Card>
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
