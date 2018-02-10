import React from 'react';
import { View,Animated, FlatList, Text, Image, Dimensions, StyleSheet,ScrollView, TouchableOpacity } from 'react-native';
import {  Card, Button, Fab,Icon,  Badge,  Container, Content, CardItem,Col, Row, } from 'native-base';
// import Api from "../WooCommerce/Api";
import { metrics, fonts, colors } from '../../MaterialValues';
import ActionButton from 'react-native-action-button'
// import Icon from 'react-native-vector-icons/Ionicons';
import ImageSlider from 'react-native-image-slider';

  
///////// CONSTANTS ////////
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

// initial aspect ratio 4:3, collapsed: 16:9
const HERO_WIDTH = WINDOW_WIDTH;
const HERO_HEIGHT = WINDOW_WIDTH * 3 / 4;
const HERO_HEIGHT_COLLAPSED = WINDOW_WIDTH * 9 / 16;
const HERO_DELTA_Y_COLLAPSED = HERO_HEIGHT - HERO_HEIGHT_COLLAPSED;
const HERO_ELEVATION_COLLAPSED = metrics.elevation.appBar - 1;

const DIALOG_WIDTH = metrics.baselineGrid * 40;
const DIALOG_HEIGHT = DIALOG_WIDTH * 9 / 16;
const FAB_SIZE = metrics.fabSize;
const FAB_CONTAINER_INIT_SIZE = FAB_SIZE + 40;
const FAB_COLOR = '#ff6f00';

const TOOLBAR_ICON_COLOR_LIGHT = '#FEFEFE';
const TOOLBAR_ICON_COLOR_DARK = '#222222';

class ProductDetailScreen extends React.Component{
    constructor(props) {
        super(props);
        this._scrollY = new Animated.Value(0);
        this.state = {
            fabActive: 'true',
            basic: true,
            bounceValue: new Animated.Value(WINDOW_WIDTH/3),
            iconName: 'md-arrow-dropdown',
          };
    }

    

    render(){
        const {product} = this.props;
        const HEADER_HEIGHT = 300
        // const product = data.oneProduct();
        const titleHeight = 8 * metrics.baselineGrid;
        const initialFabTop = HERO_HEIGHT + titleHeight - FAB_SIZE / 2;
        const fabStyle = [{ top: initialFabTop }, getFabStyleOnScroll(this._scrollY, titleHeight)];
        // style={getHeroStyleOnScroll(this._scrollY)}
        return (
            <Container>
                
                <View style={{width: 60, backgroundColor: 'red'}}>
                
                
                    <ImageSlider images={[
                        product.image,
                        require('../images/img6.jpg'),
                        require('../images/img7.jpg')
                    ]}
                    height={ HERO_HEIGHT }
                    style={ styles.heroImage }
                    />
                </View>
                <ScrollView
                    //style={ [styles.fullScreen, { marginTop: 0 }] }
                    onScroll={ e => this._scrollY.setValue(e.nativeEvent.contentOffset.y) }
                >
                    
                    <Card>
                        <Text style={ styles.titleText }>{ product.title }</Text>
                        <Text style={ styles.descriptionText }>{ product.description }</Text>
                        <Text style={ styles.priceText }>Rs { product.price }</Text>
                    </Card>
                    <Card>
                        <CardItem>
                            <Col>
                                <Text style={ styles.badgesHeading }>Sizes</Text>
                                <View style={ styles.badgesContainer }>
                                    <Badge  style={ styles.badges }>
                                        <Text>S</Text>
                                    </Badge>
                                    <Badge style={ styles.badges }>
                                        <Text>M</Text>
                                    </Badge >
                                    <Badge style={ styles.badges }>
                                        <Text>L</Text>
                                    </Badge>
                                </View>
                            </Col>
                        </CardItem>

                        <CardItem>
                            <Col>
                                <Text style={ styles.badgesHeading }>Sizes</Text>
                                <View style={ styles.badgesContainer }>
                                    <Badge style={ [styles.badgesColored, {backgroundColor: colors.red}] }/>                          
                                    <Badge style={ [styles.badgesColored, {backgroundColor: colors.blue}] }/>
                                    <Badge style={ [styles.badgesColored, {backgroundColor: colors.green}] }/>
                                    <Badge style={ [styles.badgesColored, {backgroundColor: colors.purple}] }/>
                                </View>
                            </Col>
                        </CardItem>
                        <CardItem style={{ alignItems: 'center'}}>
                                <Text style={{  }}>Quantity</Text>
                                <Row style={{ alignItems: 'center',marginLeft: 50 }}>
                                    <Badge style={ styles.incDecButton }>
                                        <Text>+</Text>
                                    </Badge>
                                    <Text style={{ paddingLeft: 10, paddingRight: 10 }}>1</Text>
                                    <Badge style={ styles.incDecButton }>
                                        <Text>-</Text>
                                    </Badge>
                                    <Button onPress={() => this._toggleSidebar()}><Text>click me</Text></Button>
                                </Row>
                        </CardItem>

                    </Card>

                </ScrollView>

            </Container>
        );
    }

}


const getHeroStyleOnScroll = (scrollY: Animated.Value) => {
    // const offsetYWhenCollapsed = HERO_DELTA_Y_COLLAPSED / 2;
    // const inputRange = [0, HERO_DELTA_Y_COLLAPSED, HERO_DELTA_Y_COLLAPSED + 0.1];
    // const height = scrollY.interpolate({
    //   inputRange,
    //   outputRange: [HERO_HEIGHT, HERO_HEIGHT_COLLAPSED + offsetYWhenCollapsed, HERO_HEIGHT_COLLAPSED + offsetYWhenCollapsed],
    // });
    // const translateY = scrollY.interpolate({
    //   inputRange,
    //   outputRange: [0, -offsetYWhenCollapsed, -offsetYWhenCollapsed],
    // });
    // const elevation = scrollY.interpolate({
    //   inputRange,
    //   outputRange: [1, HERO_ELEVATION_COLLAPSED, HERO_ELEVATION_COLLAPSED],
    // });
    // console.log('here');
    // return {
    //   height,
    //   elevation,
    //   backgroundColor: 'white',
    //   transform: [
    //     { translateY },
    //   ]
    // }
}


const getFabStyleOnScroll = (scrollY, titleHeight) => {
    // const fabYStop = HERO_HEIGHT - HERO_HEIGHT_COLLAPSED + titleHeight;
    // const translateY = scrollY.interpolate({
    //     inputRange: [0, fabYStop, fabYStop + 1],
    //     outputRange: [0, -fabYStop, -fabYStop],
    //   });
    //   return {
    //     transform: [
    //       { translateY }
    //     ]
    //   };
    return {}
  }

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    actionButton: {
        position: 'absolute',
        bottom: 70,
    },
    badgesContainer: {
        flexDirection: 'row',
    },
    badges: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgesColored: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
    },
    badgesHeading: {
        marginTop: metrics.baselineGrid,
        marginBottom: metrics.baselineGrid,
    },
    badgesDivider:{
        backgroundColor: '#00000075',
        marginTop: metrics.screenEdgeMarginHorizontal,
    },
    incDecButton: {
        width: 40,
        height: 40,
        borderRadius: 0,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',

    },
    window: {
      flex: 1,
    },
    heroImage: {
      width: HERO_WIDTH,
      height: HERO_HEIGHT,
    },
    titleContainer: {
      backgroundColor: '#efefef',
      padding: metrics.screenEdgeMarginHorizontal,
    },
    titleText: {
      ...fonts.sizes.headline,
    //   ...fonts.families.sansSerifCondensed
    margin: metrics.screenEdgeMarginHorizontal
    },
    descriptionText: {
      ...fonts.sizes.body2,
      marginLeft: metrics.screenEdgeMarginHorizontal,
      marginRight: metrics.screenEdgeMarginHorizontal,
      marginBottom: metrics.baselineGrid,
    },
    fullScreen: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    priceContainer: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      paddingLeft: metrics.screenEdgeMarginHorizontal,
      paddingRight: metrics.screenEdgeMarginHorizontal,
      paddingTop: metrics.gutterVertical,
      paddingBottom: metrics.gutterVertical,
    },
    priceText: {
        ...fonts.sizes.title,
      fontWeight: 'bold',
      marginLeft: metrics.screenEdgeMarginHorizontal,
      marginRight: metrics.screenEdgeMarginHorizontal,
      marginBottom: metrics.baselineGrid,
      
    },
    dialog: {
      backgroundColor: '#FAFAFA',
      elevation: metrics.elevation.dialog,
      alignSelf: 'center',
      paddingLeft: metrics.baselineGrid * 8,
      paddingRight: metrics.baselineGrid * 8,
      paddingTop: metrics.baselineGrid * 4,
      paddingBottom: metrics.baselineGrid * 4,
      width: DIALOG_WIDTH,
      height: DIALOG_HEIGHT,
      justifyContent: 'center',
      // alignItems: 'center',
    },
    fabContainer: {
      position: 'absolute',
      right: -4,
      elevation: metrics.elevation.fabResting,
      // backgroundColor: 'green',
    },
    fab: {
        position: 'absolute',
        right: metrics.screenEdgeMarginHorizontal,
    },
    toolbarHeart: {
      width: 160,
      height: 160,
      marginRight: -64,
    }
  })
  
  const avartarSize = metrics.baselineGrid * 5;
  const commentStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: metrics.screenEdgeMarginHorizontal,
      marginRight: metrics.screenEdgeMarginHorizontal,
      height: metrics.baselineGrid * 9,
    },
    avartar: {
      width: avartarSize,
      height: avartarSize,
      borderRadius: avartarSize / 2,
      borderWidth: 1,
      borderColor: '#e2e2e2',
      marginRight: metrics.gutterHorizontal,
    },
    textContainer: {
      flex: 1,
    },
    text: {
      ...fonts.sizes.body1,
    },
    authorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    

  });


const Screen = ({ navigation }) => (
<ProductDetailScreen product={navigation.state.params.product} />
);

export default {ProductDetailScreen, Screen};