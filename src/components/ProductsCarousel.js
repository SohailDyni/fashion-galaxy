import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Card, Button, Text } from 'native-base';

import SliderEntry from './SliderEntry';
import styles, { sliderWidth, itemWidth, slideHeight, itemHorizontalMargin } from '../styles/SliderEntryP.style';
import { Carouselstyles } from '../styles/index.style';
import { themeColors } from '../MaterialValues';

export default class ProductsCarousel extends React.PureComponent {

    renderSliderItem = ({ item, index }, parallaxProps) => (
        <SliderEntry
            data={item}
            even={(index + 1) % 2 === 0}
            parallax={false}
            parallaxProps={parallaxProps}
            showText
            productCarousel={false}
            navigation={this.props.navigation}
        />
    );

    renderFooter = () => {
        return (
            <TouchableOpacity
              activeOpacity={1}
              style={[{
                width: itemWidth - 15,
                height: slideHeight,
                paddingHorizontal: itemHorizontalMargin,
                paddingBottom: 18, // needed for shadow
                
            }]}
            onPress={() => this.props.navigation.navigate('NewProductsList', this.props.viewMore)}
            >
                <View style={[styles.imageContainer, styles.imageContainerEven, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text
                        style={{ color: 'white' }}
                        numberOfLines={2}
                    >
                        View More
                    </Text>
                    <View style={[styles.radiusMask, styles.radiusMaskEven]} />
                </View>
                <View style={[styles.textContainer, styles.textContainerEven]}>
                    {/* <Text
                        style={[styles.title]}
                        numberOfLines={2}
                    />
                    <Text
                        style={[styles.subtitle, styles.subtitleEven]}
                    /> */}
                </View>            
            </TouchableOpacity>
        //     <Card 
        //         style={{ alignItems: 'center', justifyContent: 'center', width: itemWidth - 20, maxHeight: slideHeight - 30, flex: 1, paddingBottom: 0, ba }}
        //     >
        //     <Button
        //         small
        //         full
        //         style={{ flex: 1, 
        //             height: '100%', 
        //             justifyContent: 'center', 
        //             backgroundColor: themeColors.color2 
        //         }}
        //     >
        //         <Text>View More</Text>
        //     </Button>
        // </Card>
        );
    }

    render() {
        const { data } = this.props;
        return (
            <Carousel
                data={data}
                renderItem={this.renderSliderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                hasParallaxImages
                firstItem={1}
                inactiveSlideScale={1}
                activeSlideAlignment={'start'}
                inactiveSlideOpacity={1}
                enableMomentum={false}
                containerCustomStyle={Carouselstyles.slider}
                contentContainerCustomStyle={Carouselstyles.sliderContentContainer}
                ListFooterComponent={() => this.renderFooter()}
            />
        );
    }
}
