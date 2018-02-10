import React from 'react';
import { View, TouchableOpacity, Text, Image, Dimensions,ListView, Animated } from 'react-native';
import {  
    Card,List,Icon,Button,ListItem, Right, Container,
    Row,Badge, Content, CardItem,Col, Body, Left,Thumbnail,
    Footer, FooterTab
} from 'native-base';


const WINDOW_WIDTH = Dimensions.get('window').width;

var isHidden = true;
class slideUp extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          basic: true,
          bounceValue: new Animated.Value(this.props.toValue ? this.props.toValue : 200),
          iconName: 'md-arrow-dropdown',
        };
      }
   

    _toggleSubview() {
        this.setState({
          iconName: isHidden ? "md-arrow-dropup" : "md-arrow-dropdown"
        });
    
        var toValue = this.props.toValue ? this.props.toValue : 200;
    
        if(isHidden) {
          toValue = 0;
        }
    
        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
          this.state.bounceValue,
          {
            toValue: toValue,
            velocity: 3,
            tension: 2,
            friction: 8,
          }
        ).start();
        isHidden = !isHidden;        
        
    }

    render(){
        const { navigation } = this.props;
        return (
                <Animated.View style={ [styles.detailCard, {transform: [{translateY: this.state.bounceValue}]}]}>
                    { this.props.children }
                </Animated.View> 
        );
    }

}

const styles = {
    detailCard: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        height: 200,

    },
}

export default slideUp;