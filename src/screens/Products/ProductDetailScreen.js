import React, { Component } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  Text as NText,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList, Image,
  ScrollView,
  Alert,
  CameraRoll
} from 'react-native';
import {  
    Card, Button, Icon, Title,
    CardItem, Col, Row, Text, Footer,
    Spinner
} from 'native-base';
import { connect } from 'react-redux';
import Carousel from 'react-native-banner-carousel';
import Animation from 'lottie-react-native';
import IconBadge from 'react-native-icon-badge';
import WebHtmlView from 'react-native-webhtmlview';
import Lightbox from 'react-native-lightbox';
import Toast from 'react-native-simple-toast';
import { FileSystem, Permissions } from 'expo';

import { metrics, fonts, themeColors } from '../../MaterialValues';
import * as actions from '../../actions';
import Chat from '../../components/Chat';

const shallowequal = require('shallowequal');


///////// CONSTANTS ////////
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 0;
// initial aspect ratio 4:3, collapsed: 16:9
const HERO_WIDTH = WINDOW_WIDTH;
const HERO_HEIGHT = WINDOW_WIDTH * (3 / 4);
const DIALOG_WIDTH = metrics.baselineGrid * 40;
const DIALOG_HEIGHT = DIALOG_WIDTH * (9 / 16);


const HEADER_MAX_HEIGHT = WINDOW_WIDTH;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 70 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class ProductDetailScreen extends Component {
	constructor(props) {
        super(props);
        const { attributes, tags } = props.navigation.state.params.product;
        let colorSelected = '';
        let sizeSelected = '';
        let characterSelected = '';

        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].id === 1) {
                colorSelected = attributes[i].options[0];
            } else if (attributes[i].name === 'Sizes' || attributes[i].name === 'Size') {
                sizeSelected = attributes[i].options[0];
            } else if (attributes[i].name === 'Characters' || attributes[i].name === 'characters') {
                characterSelected = attributes[i].options[0];
            }
        }
        const tagsIds = [];
        tags.map(tag => {
            tagsIds.push(tag.id);
        });

		this.state = {
			scrollY: new Animated.Value(0),
			excerpt: true,
			colorSelected,
            sizeSelected,
            characterSelected,
            quantitySelected: 1,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            slider1Ref: null,
            isFavorite: false,
            activeFab: false,
            relatedProducts: [],
            page: 1,
            loading: true,
            productId: props.navigation.state.params.product.id,
            tagsIds,
            isModalVisible: false,
        };
        this._heartProgress = new Animated.Value(0);

    }


    componentDidMount() {
        this.makeRemoteRequest();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowequal(this.state, nextState) && shallowequal(this.props, nextProps)) {
            return false;
        }
        return true;        
    }

    onCardPressed = product => this.props.navigation.navigate('ProductDetail', { product });  
    
    getProductThumbnail = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-300x300.${extension}`;
    }

    getProductThumbnailMain = url => { 
        const parts = url.split('.');
        let path = parts.slice(0, parts.length - 1);
        path = path.join('.');
        const extension = parts[parts.length - 1];
        return `${path}-600x600.${extension}`;
    }

    getDescription(description) {
        const plainText = this.stripHtmlTtags(description);
		if (this.state.excerpt) {
			return plainText.substring(0, 200);
		}
        return plainText;
    }    
    
    getImagesGallery(item) {
        return { uri: item.src };
    }

    toggleModal = () => {
        Alert.alert(
            'Item added to Cart',
            `You have ${this.props.cartLength + 1} ${this.props.cartLength+1 > 1 ? 'items ' : 'item '} in cart.`,
            [
              { text: 'Continue Shopping', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Go to Cart', onPress: () => this.props.navigation.navigate('CartScreen') },
            ],
            { cancelable: false }
        );
    }
	stripHtmlTtags(str) {
        if ((str === null) || (str === '')) {
			return false;
        }
        str = str.toString();
        str = str.replace(/<[^>]*>/g, '');
        str = str.replace(/&amp;/g, '&');
        return str.replace(/\s\s/g, '');
    }          
    
    makeRemoteRequest = () => {
        try {
          fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products?per_page=10&page=${this.state.page}&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a&tag=${this.state.tagsIds}&exclude=[${this.state.productId}]`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    relatedProducts: 
                        this.state.page === 1 ? 
                        res : [...this.state.relatedProducts, ...res],
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

    renderRelatedProduct = product => (
        <Card style={{ flex: 0.5 }}>
            <TouchableOpacity onPress={() => this.onCardPressed(product)}>
                <CardItem cardBody>
                    <Image 
                        source={{ uri: this.getProductThumbnail(product.images[0].src) }}  
                        style={styles.RPimage}
                    />
                </CardItem>
                <CardItem style={styles.RPtitleContainer}>
                    <Text numberOfLines={2}>{product.name }</Text>
                    <Text style={styles.RPpriceStyle}>Rs. {product.price }</Text>
                </CardItem>
            </TouchableOpacity>
        </Card>
    );

    renderPage(image, index) {
        const { src } = image;
        const uri = this.getProductThumbnailMain(src);
        return (
            <Lightbox 
                key={index}
                downloadImage={() => this.downloadImage(uri)}
            >
                <View>
                    <Image 
                        style={styles.bannerImage} 
                        source={{ uri }} 
                        resizeMode='cover' 
                    />
                </View>
                {/* <ResponsiveImage 
                    source={{ uri: this.getProductThumbnailMain(src) }} 
                    initWidth={414} 
                    initHeight={370} 
                    resizeMode="cover"
                /> */}

            </Lightbox>
        );
    }

    downloadImage = async url => {
        Toast.show('Downloading...', Toast.LONG);
        const slashes = url.split('/');
        const fileName = slashes[slashes.length-1];
        let { uri } = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + fileName)
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
    
        CameraRoll.saveToCameraRoll(uri).then((uriGallery) => {
            Toast.show('Downloading Complete');
            FileSystem.deleteAsync(uri);
        })
        .catch(e => console.log(e));
    }
    }
   
    render() {
        const { navigation, screenProps: { colors: colorsVars } } = this.props;
        const product = navigation.state.params.product;
        const toggleHeart = () => {
            const toValue = this.state.isFavorite ? 0 : 1;
            Animated.timing(this._heartProgress, {
                toValue,
                duration: 700,
            }).start(() => this.setState({
                isFavorite: !this.state.isFavorite,
            }));
            this.props.addToWishlist(product);
        };

        const headerTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });  
        
        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        const titleScale = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0.9],
            extrapolate: 'clamp',
        });
        const titleTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 0, -8],
            extrapolate: 'clamp',
        });
        const variableProd = product.type === 'variable';
        const colorsAttributes = [];
        const sizesAttributes = [];
        const characterAttributes = [];
        if (variableProd) {
            const { attributes } = product;
            for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].id === 1) {
                    const optionS = attributes[i].options;
                    for (let j = 0; j < optionS.length; j++) {
                        colorsAttributes.push(optionS[j]);
                    }
                }

                if (attributes[i].name === 'Sizes' || attributes[i].name === 'Size') {
                    const optionS = attributes[i].options;
                    for (let j = 0; j < optionS.length; j++) {
                        sizesAttributes.push(optionS[j]);
                    }
                }

                if (attributes[i].name === 'Characters' || attributes[i].name === 'characters') {
                    const optionS = attributes[i].options;
                    for (let j = 0; j < optionS.length; j++) {
                        characterAttributes.push(optionS[j]);
                    }
                }
            }
        }

        const hasSizes = sizesAttributes.length > 0;
        const hasColors = colorsAttributes.length > 0;
        const hasCharacters = characterAttributes.length > 0;
        const { slider1ActiveSlide, slider1Ref, loading } = this.state;
        return (
        <View style={styles.fill}>
            <Animated.ScrollView
                style={styles.fill}
                scrollEventThrottle={1}
                onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                { useNativeDriver: true },
                )}
            >

            <View style={styles.scrollViewContent}>
                <Card>
                    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={[styles.titleText, { width: '75%' }]}>{product.name}</Text>
                        <View style={{ position: 'absolute', right: '-20%', top: '-75%', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableWithoutFeedback 
                                onPress={() => toggleHeart()}
                            >
                                <Animation 
                                    source={require('../../animations/heart.json')}
                                    style={styles.toolbarHeart}
                                    progress={this._heartProgress} 
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <Text style={styles.priceText}>Rs { product.price }</Text>
                    <WebHtmlView
                        source={{ html: product.short_description }}
                        innerCSS="body { font-size: 93%; text-align: justify, background-color: white }"
                    />
                    {/* <Text style={styles.descriptionText}>
                        { this.getDescription(product.short_description) }
                    </Text> */}
                    {/* <Button 
                    block block transparent 
                    onPress={() => this.setState({ excerpt: !this.state.excerpt })}
                    >
                        <Text>Show { this.state.excerpt ? 'more' : 'less' }</Text>
                    </Button> */}
                </Card>
                <Card>
                    {variableProd && 
                        <View>
                            { hasColors && <CardItem>
                                <Col>
                                    <Text style={styles.badgesHeading}>Colors</Text>
                                    <ScrollView 
                                        style={[styles.badgesContainer, { height: 60 }]}
                                        horizontal
                                    >
                                        {colorsAttributes.map((option, index) => (
                                                <View 
                                                    style={{ flexDirection: 'column', marginRight: 8 }} 
                                                    key={index}
                                                >
                                                        <Button 
                                                            style={[
                                                                styles.badgesColored, 
                                                                { 
                                                                    backgroundColor: colorsVars[option.toLowerCase()] || 'blue',
                                                                    borderColor: 
                                                                    option === 'White' ? '#000000' 
                                                                    : 'transparent' 
                                                                }
                                                            ]} 
                                                            onPress={() => this.setState({
                                                                colorSelected: option
                                                            })}
                                                        >
                                                            {this.state.colorSelected === option && 
                                                            <View
                                                                style={styles.checkMark}
                                                            >
                                                                <Icon 
                                                                    name="ios-checkmark" 
                                                                    style={styles.checkMarkIcon} 
                                                                />
                                                            </View>}
                                                        </Button>
                                                        <Text 
                                                            style={{ fontSize: 12, marginTop: 5, }}
                                                        >
                                                            { option }
                                                        </Text>
                                                </View>
                                                ) 
                                            )
                                        }
                                    </ScrollView>
                                </Col>
                            </CardItem>}

                            { hasSizes && <CardItem>
                                <Col>
                                    <Text style={styles.badgesHeading}>Sizes</Text>
                                    <ScrollView 
                                        style={[styles.badgesContainer, { height: 60 }]}
                                        horizontal
                                    >
                                    {sizesAttributes.map((option, index) => (
                                            <Button
                                                style={[
                                                styles.badges,
                                                ]} 
                                                key={index} 
                                                onPress={() => this.setState({
                                                    sizeSelected: option
                                                })}
                                            >
                                                <NText 
                                                    style={{ color: '#000000', fontSize: 12 }}
                                                >
                                                    { option }
                                                </NText>
                                                {this.state.sizeSelected === option && <View
                                                    style={styles.checkMark}
                                                >
                                                    <Icon 
                                                        name="ios-checkmark" 
                                                        style={styles.checkMarkIcon} 
                                                    />
                                                </View>}
                                            </Button>
                                                ) 
                                            )
                                        }
                                    </ScrollView>
                                </Col>
                            </CardItem>}

                            { hasCharacters && <CardItem>
                                <Col>
                                    <Text style={styles.badgesHeading}>Characters</Text>
                                    <ScrollView 
                                        style={[styles.badgesContainer, { height: 65 }]}
                                        horizontal
                                    >
                                        {characterAttributes.map((option, index) => (
                                                <View 
                                                    style={{ flexDirection: 'column', marginRight: 8 }} 
                                                    key={index}
                                                >
                                                        <Button 
                                                            style={[
                                                                styles.badges,
                                                            ]} 
                                                            onPress={() => this.setState({
                                                                characterSelected: option
                                                            })}
                                                        >
                                                        <NText 
                                                            style={{ color: '#000000', fontSize: 12 }}
                                                        >
                                                            { option.charAt(0) }
                                                        </NText>
                                                            {this.state.characterSelected === option && 
                                                            <View
                                                                style={styles.checkMark}
                                                            >
                                                                <Icon 
                                                                    name="ios-checkmark" 
                                                                    style={styles.checkMarkIcon} 
                                                                />
                                                            </View>}
                                                        </Button>
                                                        <Text 
                                                            style={{ fontSize: 12, marginTop: 5, }}
                                                        >
                                                            { option }
                                                        </Text>
                                                </View>
                                                ) 
                                            )
                                        }
                                    </ScrollView>
                                </Col>
                            </CardItem>}
                            
                        </View>
                    }
                    <CardItem style={{ alignItems: 'center' }}>
                        <Text>Quantity</Text>
                        <Row style={{ alignItems: 'center', marginLeft: 50 }}>
                            <Button 
                                style={styles.incDecButton}
                                onPress={() => { 
                                    this.setState(
                                        { quantitySelected: this.state.quantitySelected + 1 
                                    });
                                }}
                            >
                                <NText>+</NText>
                            </Button>
                            <Text style={{ paddingLeft: 10, paddingRight: 10 }}>
                                { this.state.quantitySelected }
                            </Text>
                            <Button 
                                style={styles.incDecButton}
                                onPress={() => { 
                                    if (this.state.quantitySelected > 1) {
                                        this.setState(
                                            { quantitySelected: this.state.quantitySelected - 1 }
                                        ); 
                                    }
                                }}
                            >
                                <NText>-</NText>
                            </Button>
                        </Row>
                    </CardItem>
                    
                </Card>

                <Card>
                    <CardItem header>
                        <Text>Discounts</Text>
                    </CardItem>
                    <CardItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text>5% discount on  PKR 3000/-</Text>
                        <Text>7% discount on  PKR 6000/-</Text>
                        <Text>10% discount on  PKR 10000/-</Text>                    
                    </CardItem>
                    
                </Card>

            </View> 

            <View>
                {/* relate products */}
                <Text style={styles.titleText}>Related Products</Text>
                {!loading && <FlatList
                    numColumns={2}
                    data={this.state.relatedProducts}
                    renderItem={({ item }) => this.renderRelatedProduct(item)}
                    keyExtractor={(item) => item.id}
                />}
                {loading && 
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner size="small" />
                    </View>
                }
            </View>  


            </Animated.ScrollView>
            <Animated.View
                style={[
                styles.header,
                { transform: [{ translateY: headerTranslate }] },
                ]}
            >
                <Animated.View
                style={[
                    styles.backgroundImage,
                    {
                    opacity: imageOpacity,
                    transform: [{ translateY: imageTranslate }],
                    },
                ]}
                >

                <Carousel
                    autoplay
                    autoplayTimeout={5000}
                    loop
                    index={0}
                    pageSize={WINDOW_WIDTH}
                >
                    {product.images.map((image, index) => this.renderPage(image, index))}
                </Carousel>
                
                {/* <Carousel
                    ref={(c) => { 
                        if (!this.state.slider1Ref) { 
                            this.setState({ slider1Ref: c }); 
                            } 
                        }
                    }
                    data={product.images}
                    renderItem={this._renderItemWithParallax}
                    sliderWidth={WINDOW_WIDTH}
                    itemWidth={WINDOW_WIDTH}
                    hasParallaxImages={false}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    enableMomentum={false}
                    containerCustomStyle={Carouselstyles.slider}
                    contentContainerCustomStyle={Carouselstyles.sliderContentContainer}
                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                /> */}
                {/* <Pagination
                    dotsLength={product.images.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={Carouselstyles.paginationContainer}
                    dotColor={'rgba(255, 255, 255, 0.92)'}
                    dotStyle={Carouselstyles.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={slider1Ref}
                    tappableDots={!!slider1Ref}
                />  */}
            
                </Animated.View> 
                
            </Animated.View>
            
            <Animated.View
                style={[
                styles.bar,
                {
                    transform: [
                    { scale: titleScale },
                    { translateY: titleTranslate },
                    ],
                },
                ]}
            >
                <View style={styles.headerNav}>
                    <View>
                        <Icon 
                        name="md-arrow-round-back"
                        onPress={() => navigation.goBack()}
                        style={styles.headerIcon}
                        />
                    </View>
                    <Title style={styles.title}>{ product.name }</Title>
                    <View>
                        <IconBadge
                            MainElement={
                            <TouchableOpacity style={styles.iconButton}>
                                <Icon 
                                style={styles.headerIcon} name="md-cart" 
                                onPress={() => navigation.navigate('CartScreen')}
                                />
                            </TouchableOpacity>
                            }
                            BadgeElement={
                            <Text 
                            onPress={() => navigation.navigate('CartScreen')}
                            style={{ color: '#FFFFFF', fontSize: 10, }}
                            >
                                {this.props.cartLength}
                            </Text>
                            }
                            IconBadgeStyle={{ 
                                width: 4,
                                height: 18,
                                top: 0,
                                right: 0,
                                borderRadius: 15,
                                backgroundColor: 'rgb(247,64,68)'
                            }}
                            Hidden={this.props.cartLength === 0}
                        />
                    </View>
                </View>
                    
            </Animated.View>

            {/* <View style={{ }}>
                <Fab
                    active={this.state.activeFab}
                    direction="up"
                    containerStyle={{ bottom: 10 }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setState({ activeFab: !this.state.activeFab })}
                >
                    <Icon name="md-share" />
                    <Button style={{ backgroundColor: '#34A34F', alignItems: 'center' }}>
                    <Icon name="logo-whatsapp" style={{ width: 25, }} />
                    </Button>
                    <Button style={{ backgroundColor: '#3B5998', }}>
                    <Icon name="logo-facebook" style={{ width: 25, }} />
                    </Button>
                    <Button small style={{ backgroundColor: '#DD5144' }}>
                    <Icon name="mail" style={{ width: 25, }} />
                    </Button>
                </Fab>
            </View> */}

            <Chat />
            
            <Footer>
                <Button 
                iconLeft full 
                onPress={() => {
                        this.props.addToCart(
                            {
                                product,
                                quantity: this.state.quantitySelected,
                                color: variableProd ? this.state.colorSelected : null,
                                size: variableProd ? this.state.sizeSelected : null,
                                character: variableProd ? this.state.characterSelected : null,
                                isChecked: false,
                            },
                            () => this.toggleModal()
                        );
                    }}
                    style={{ flex: 1, 
                        height: '100%', 
                        justifyContent: 'center', 
                        backgroundColor: themeColors.color2 
                    }}
                >
                    <Icon name="md-cart" style={{ fontSize: 20 }} /> 
                <Text>  Add to Cart</Text>
                </Button>
            </Footer>
        </View>
        );
        }
}

const styles = StyleSheet.create({
    fill: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#03A9F4',
      overflow: 'hidden',
      height: HEADER_MAX_HEIGHT,
    },
    headerNav: {
      backgroundColor: 'transparent', 
      borderColor: 'transparent',
      alignItems: 'flex-end', 
      height: 50, 
      paddingBottom: 10,
      justifyContent: 'space-between',
      width: WINDOW_WIDTH,
      maxWidth: WINDOW_WIDTH,
      flexDirection: 'row',
        paddingHorizontal: 5
    },
    bannerImage: {
        // height: WINDOW_WIDTH - 30,
        // width: WINDOW_WIDTH
        // flex: 1,
        height: WINDOW_WIDTH,
        width: WINDOW_WIDTH,
        // ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      //width: null,
      height: HEADER_MAX_HEIGHT,
    },
    bar: {
      backgroundColor: 'transparent',
      marginTop: Platform.OS === 'ios' ? 18 : 24,
      //height: 32,
      // alignItems: 'center',
      // justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    fabButton: {
        width: 45, height: 45, borderRadius: 45, 
    },
    fabButtonIcon: {
        
    },
    title: {
      color: 'white',
      fontSize: 18,
      marginHorizontal: 10,
      flex: 1, 
      flexWrap: 'wrap',
      textAlign: 'center',
    //   alignSelf: 'center'
    },
    headerIcon: {
        color: 'black',
        fontSize: 28,
        lineHeight: 25,
    },
    scrollViewContent: {
      marginTop: HEADER_MAX_HEIGHT,
    },
    row: {
      height: 40,
      margin: 16,
      backgroundColor: '#D3D3D3',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
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
        // flexDirection: 'row',
        flex: 1,
    },
    badges: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 5,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 7
    },
    checkMark: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(254,196,70,0.8)',
    },
    checkMarkIcon: {
    fontSize: 35,
    width: 30,
    height: 40,
    color: 'black',
    alignSelf: 'center',
    textAlign: 'center'
    },
    badgesColored: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
    // elevation: 1

    },
    badgesColoredText: {
    width: '100%', 
    height: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 50,

    },
    badgesHeading: {
        marginTop: metrics.baselineGrid,
        marginBottom: metrics.baselineGrid,
    },
    badgesDivider: {
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
    marginLeft: metrics.screenEdgeMarginHorizontal,
    marginRight: metrics.screenEdgeMarginHorizontal,
    marginBottom: metrics.baselineGrid,
    textAlign: 'justify',
    },
    fullScreen: {
    //   position: 'absolute',
    //   left: 0,
    //   right: 0,
    //   top: 0,
    //   bottom: 0,
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
        width: 250,
        height: 250,
        // marginRight: -80,
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0
    },
    badge: {
        position: 'absolute', top: -8, width: 15, height: 15, right: 0, alignItems: 'center'
    },
    iconButton: {
        paddingLeft: 0, paddingRight: 0,
    },
    badgeText: {
        fontSize: 10, 
        paddingLeft: 0, 
        paddingBottom: 0, 
        paddingRight: 0, 
        paddingTop: 0, 
        marginTop: 0,
    },
    icon: {
        fontSize: 30,
    },
    RPtitleContainer: {
        flexDirection: 'column', 
        alignItems: 'flex-start'
    },
    RPimage: {
        height: 190,         
        width: null,
        flex: 1,
        resizeMode: 'stretch'
    },
    RPpriceStyle: {
        fontWeight: 'bold',
    },
    downloadBtn: {
        zIndex: 10,
        marginTop: 10,
    },
    downloadTxt: {
        color: '#fff',
    }
});
  

function mapStateToProps(state) {
  return { cartLength: state.cart.length };
}

export default connect(mapStateToProps, actions)(ProductDetailScreen);
