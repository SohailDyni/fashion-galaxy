import React from 'react';
import { 
    TouchableOpacity,
    Text, Image, Animated
} from 'react-native';
import {  
    CardItem,
    Card,
} from 'native-base';

import CarouselStyle from '../styles/SliderEntry.style';

const HEIGHT = 230;

export default class ProductsCarouselItem extends React.PureComponent {

    onCardPressed = product => this.props.navigation.navigate('ProductDetail', { product });    
    
    getProductThumnail = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-300x300.${extension}`;
    }

    render() {
        const { item, animatedScale, index } = this.props;
        return (
            <Card key={index}>
                <Animated.View
                    style={[
                    {
                        transform: [{ scale: animatedScale }],
                    },
                    CarouselStyle.slideInnerContainer
                    ]}
                >
                        {/* <Card> */}
                    <TouchableOpacity onPress={() => this.onCardPressed(item)}>
                        <CardItem 
                            cardBody
                            style={{ marginRight: 0 }}
                        >
                            <Image
                                style={pstyles.image}
                                resizeMode="cover"
                                source={{ uri: this.getProductThumnail(item.images[0].src) }}  
                            />
                        </CardItem>
                        <CardItem style={pstyles.titleContainer}>
                            <Text style={{ fontSize: 12 }} numberOfLines={2}>{item.name}</Text>
                            <Text style={pstyles.priceStyle}>Rs. {item.price }</Text>
                        </CardItem>
                    </TouchableOpacity>
                </Animated.View>
            </Card>
        );
    }
}


const pstyles = {
    container: {
        paddingLeft: 5, 
        paddingRight: 5
    },
    titleContainer: {
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    image: {
        height: 152, 
        // width: (WINDOW_WIDTH / 2) - 30,
        width: null,
        flex: 1,
    },
    priceStyle: {
        fontWeight: 'bold',
    },
    slideInnerContainer: {
        height: HEIGHT,
        paddingHorizontal: 5,
        paddingBottom: 18, // needed for shadow
    },
  
};
