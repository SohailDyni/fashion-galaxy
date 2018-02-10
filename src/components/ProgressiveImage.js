import React from 'react';
import {
  Image,
  Animated,
  View
} from 'react-native';

export default class ProgressiveImage extends React.Component{
  constructor() {
      super();
      this.state = {
        thumbnailOpacity: new Animated.Value(0),
      };
  }

  onLoad() {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 0,
      duration: 250
    }).start();
  }

  onThumbnailLoad() {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 250
    }).start();
  }

  render() {
    return (
      <View
        width={this.props.style.width}
        height={this.props.style.height}
        backgroundColor={'#CCC'}
      >
        <Animated.Image 
          resizeMode={'contain'}
          key={this.props.key} 
          style={[
            {
              position: 'absolute',
            },
            this.props.style
          ]}
          source={this.props.source}
          onLoad={this.onLoad} 
        />
        <Animated.Image 
          resizeMode={'contain'}
          key={this.props.key} 
          style={[
            {
              opacity: this.state.thumbnailOpacity
            }, 
            this.props.style
          ]}
          source={this.props.thumbnail}
          onLoad={this.onThumbnailLoad} 
        />
      </View>      
    );
  }
}
