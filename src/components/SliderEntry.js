import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntryP.style';


export default class SliderEntry extends PureComponent {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        navigation: PropTypes.object
    };

    getProductThumnail = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-300x300.${extension}`;
    }

    get image () {
        const { data: { images }, parallax, parallaxProps, even } = this.props;
        return parallax ? (
            <ParallaxImage
              source={{ uri: images[0].src }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={[styles.image, { position: 'relative', }]}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: this.getProductThumnail(images[0].src) } }
              style={styles.image}
            />
        );
    }

    _renderText(){
        const { data: { name, price }, even } = this.props;
        const uppercaseTitle = name ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { name.toUpperCase() }
            </Text>
        ) : false;
        if( this.props.showText ){
            return (
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                { uppercaseTitle }
                    <Text
                    style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                    numberOfLines={2}
                    >
                        Rs { price }
                    </Text>
                </View>
            );
        }
    }

    render () {
        const { even, navigation } = this.props;
        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { navigation.navigate('ProductDetail',{ product: this.props.data }) }}
              >
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                { this._renderText() }
            </TouchableOpacity>
        );
    }
}
