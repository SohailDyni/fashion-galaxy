import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Image, 
    TouchableOpacity, Clipboard, TouchableHighlight, Alert,
    Modal, TextInput, TouchableWithoutFeedback
} from 'react-native';
import { 
    Card, CardItem, Content, Button,
    Text, Container, Spinner, Row as Column,
} from 'native-base';
import { connect } from 'react-redux';
import CarouselN from 'react-native-banner-carousel';
import { Col, Row, Grid } from 'react-native-easy-grid';
import _ from 'lodash';


import ProductsCarousel from '../components/ProductsCarousel';
import { metrics, fonts } from '../MaterialValues';
import * as actions from '../actions';
import TopHeader from './TopHeader';

///////// CONSTANTS ////////
const SLIDER_1_FIRST_ITEM = 0;

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

// initial aspect ratio 4:3, collapsed: 16:9
const HERO_WIDTH = WINDOW_WIDTH;
const HERO_HEIGHT = WINDOW_WIDTH * (3 / 4);

const DIALOG_WIDTH = metrics.baselineGrid * 40;
const DIALOG_HEIGHT = DIALOG_WIDTH * (9 / 16);
const HEADER_MAX_HEIGHT = (WINDOW_HEIGHT / 2) - 50;
const CUSTOMER_KEY = 'ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4';
const CUSTOMER_SEC = 'cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a';

const fashionData = {
    babies: {
        main: 24,
        shoes: 387,
        clothing: 384,
        accessories: 198,
        height: 250,
    },
    kids: {
        main: 18,
        shoes: 90,
        clothing: 96,
        accessories: 146,
        height: 250,
    },
    gents: {
        main: 23,
        shoes: 66,
        clothing: 66,
        accessories: 77,
        height: 250,
    },
    ladies: {
        main: 22,
        shoes: 51,
        clothing: 51,
        accessories: 62,
        height: 250,
    }
};

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
            data: [],
            colorSelected: '',
            sizeSelected: '',
            quantitySelected: 1,
            sliderData: [],
            slider1Ref: null,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            isLoading: false,
            onSaleProductsLoading: true,
            lastetProdustLoading: true,
            featuredProductsLoading: true,
            coupons: [],
            sliderImages: [],
            sliderImagesLoading: true,
            modalVisible: false,
            modaCouponCode: '',
            phoneNumber: '',
            emptyNumber: false,
            sendMsg: false,
            couponRes: '',
        };
        this.props.fetchCart();
        this.props.doLogin();
    }

    componentDidMount() {
        this.fetchSliderImages();
        this.makeRemoteRequestForLastestProducts();
        this.fetchCoupons();     
        this.makeRemoteRequestForSaleProducts();
        this.makeRemoteRequestForFeaturedProducts();
    }

    onSaleProducts = [];
    lastetProdust = [];
    featuredProducts = [];

    fetchSliderImages = async () => {
        try {
            const response = await fetch('https://fashiongalaxy.pk/app/slider.json');
            const responseJson = await response.json();
            this.setState({ sliderImages: responseJson, sliderImagesLoading: false });
        } catch (error) {
            console.error(error);
        }
    }


    makeRemoteRequestForSaleProducts = async () => {
        try {
            const response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products/?on_sale=true&status=publish&consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}`);
            const responseJson = await response.json();
            this.onSaleProducts = _.concat(this.onSaleProducts, responseJson);
            this.setState({ onSaleProductsLoading: false });
        } catch (error) {
            console.error(error);
        }
    }

    fetchCoupons = async () => {
        try {
            const response = await fetch(`https://fashiongalaxy.pk/app/coupons.json`);
            const responseJson = await response.json();
            if (responseJson.length > 0) {
                this.setState({ coupons: responseJson });
            }
        } catch (error) {
            console.error(error);
        }
    }

    makeRemoteRequestForLastestProducts = async () => {
        try {
            const response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products/?consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}&status=publish&per_page=10`);
            const responseJson = await response.json();
            this.lastetProdust = _.concat(this.lastetProdust, responseJson);
            this.setState({ lastetProdustLoading: false });
        } catch (error) {
            console.error(error);
        }
    }

    makeRemoteRequestForFeaturedProducts = async () => {
        try {
            const response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products/?featured=true&status=publish&consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}`);
            const responseJson = await response.json();
            this.featuredProducts = _.concat(this.featuredProducts, responseJson);
            this.setState({ featuredProductsLoading: false });
        } catch (error) {
            console.error(error);
        }
    }

    // _renderSliderItem = ({ item, index }, parallaxProps) => (
    //     <SliderEntrySlider
    //         data={item}
    //         even={(index + 1) % 2 === 0}
    //         parallax={false}
    //         parallaxProps={parallaxProps}
    //         showText={false}
    //         productCarousel={false}
    //     />
    // );

    showCouponCode = item => {
        this.openModal();

        // Alert.alert(
        //     'Coupon Code',
        //     `The coupon code "${item.code}" has been copied to your Clipboard.`,
        //     [
        //       { text: 'Continue Shopping', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        //       { text: 'Go to Cart', onPress: () => this.props.navigation.navigate('CartScreen') },
        //     ],
        //     { cancelable: false }
        // );
    }

    renderPage(image, index) {
        return (
            <TouchableHighlight 
                key={index}
                onPress={() => 
                    this.props.navigation.navigate('category', {
                        name: image.name,
                        catId: image.id
                    })
                }
            >
                <Image style={{ width: WINDOW_WIDTH, height: 160 }} source={{ uri: image.image }} />
            </TouchableHighlight>
        );
    }

    renderBanner(name) {
        if (name in fashionData) {
            const ids = fashionData[name];
            let bgColor = '#00000060';

            switch (name) {
                case 'babies':
                    bgColor = 'rgba(208, 135, 240, 0.7)';
                    break;
                case 'kids':
                    bgColor = '#69696960';
                    break;
                case 'gents':
                    bgColor = '#1976D270';
                    break;
                case 'ladies':
                    bgColor = '#E91E6370';
                    break;
                default:
                    break;
            }

            return (
                <Card>
                    <CardItem cardBody style={{ marginTop: 0, alignItems: 'flex-start' }}>
                        <Grid>
                            <TouchableOpacity 
                                onPress={() => 
                                this.props.navigation.navigate('category', {
                                    name: `${name.toUpperCase()} FASHION`,
                                    catId: ids.main
                                })}
                            >
                                <Row>
                                    <Image 
                                        source={{ uri: `https://fashiongalaxy.pk/app/images/${name}-fashion.jpg` }}
                                        style={[cstyles.catImg, 
                                        { height: 150 }]}
                                    />
                                    <View style={[cstyles.catNameCon, { backgroundColor: bgColor }]}>
                                        <Text 
                                            style={cstyles.catName}
                                        >
                                            {name.toUpperCase()} FASHION
                                        </Text>
                                    </View>
                                </Row>
                            </TouchableOpacity>

                            <Row>
                                <Col>
                                    <TouchableOpacity
                                        onPress={() => 
                                        this.props.navigation.navigate('category', {
                                            name: `${name.toUpperCase()} CLOTHING`,
                                            catId: ids.clothing
                                        })}
                                    >
                                        <Card>
                                            <Image
                                            source={{ uri: `https://fashiongalaxy.pk/app/images/${name}-clothing.jpg` }} 
                                                style={cstyles.catSubImg}
                                            />
                                            <View style={[cstyles.catSubNameCon, { backgroundColor: bgColor }]}>
                                                <Text style={cstyles.catSubName}>
                                                    Clothings
                                                </Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                </Col>

                                <Col>
                                    <TouchableOpacity
                                        onPress={() => 
                                        this.props.navigation.navigate('category', {
                                            name: `${name.toUpperCase()} SHOES`,
                                            catId: ids.shoes
                                        })}
                                    >
                                        <Card>
                                            <Image 
                                                source={{ uri: `https://fashiongalaxy.pk/app/images/${name}-shoes.jpg` }} 
                                                style={cstyles.catSubImg}
                                            />
                                            <View style={[cstyles.catSubNameCon, { backgroundColor: bgColor }]}>
                                                <Text style={cstyles.catSubName}>
                                                    Shoes
                                                </Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                </Col>

                                <Col>
                                    <TouchableOpacity
                                        onPress={() => 
                                        this.props.navigation.navigate('category', {
                                            name: `${name.toUpperCase()} ACCESSORIES`,
                                            catId: ids.accessories
                                        })}
                                    >
                                        <Card>
                                            <Image
                                                source={{ uri: `https://fashiongalaxy.pk/app/images/${name}-accessories.jpg` }} 
                                                style={cstyles.catSubImg}
                                            />
                                            <View style={[cstyles.catSubNameCon, { backgroundColor: bgColor }]}>
                                                <Text style={cstyles.catSubName}>
                                                    Accessories
                                                </Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </Grid>
                    </CardItem>
                </Card>
            );
        }
    }

    openModal(item) {
        this.setState({
            modalVisible:true,
            modaCouponCode: item.code
        });
    }
    
    closeModal() {
        this.setState({modalVisible:false, couponRes: '', emptyNumber: false});
    }

    sendMessage() {
        const { modaCouponCode, phoneNumber, sendMsg, couponRes } = this.state;
        if ( phoneNumber === '' ) {
            this.setState({ emptyNumber : true });
            return;
        }

        this.setState({ sendMsg: true });

        try {
            fetch(`http://coupons.fashiongalaxy.pk/send_sms.php?number=${phoneNumber}&password=fashiongalaxy.PK&code=${modaCouponCode}`)
            .then(res => res.json())
            .then(res => this.setState({ couponRes: res.msg, sendMsg: false }))
            .catch(err => console.log(err));
        } catch (error) {
            console.error(error);
        }

    }
    

    render() {
        const { navigation } = this.props;
        const { isLoading, coupons,
            onSaleProductsLoading, featuredProductsLoading, lastetProdustLoading,
            sliderImages, sliderImagesLoading, emptyNumber, couponRes, sendMsg
        } = this.state;

        const { lastetProdust, featuredProducts, onSaleProducts } = this;
        
        return (
        <Container>
            <TopHeader navigation={this.props.navigation} />
            { isLoading && 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size="large" /> 
            </View>
            }
            { !isLoading && <Content>
                <View>

                {!sliderImagesLoading && <CarouselN
                    autoplay
                    autoplayTimeout={5000}
                    loop
                    index={0}
                    pageSize={WINDOW_WIDTH}
                >
                    {sliderImages.map((image, index) => this.renderPage(image, index))}
                </CarouselN>}

                {sliderImagesLoading && 
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 160 }}>
                        <Spinner size="small" />
                    </View>
                }


                    {/* <Carousel
                        ref={(c) => { 
                                if (!this.state.slider1Ref) { 
                                    this.setState({ slider1Ref: c }); 
                                } 
                            }
                        }
                        data={sliderImg}
                        renderItem={this._renderSliderItem}
                        sliderWidth={WINDOW_WIDTH}
                        itemWidth={WINDOW_WIDTH}
                        hasParallaxImages={false}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        enableMomentum={false}
                        containerCustomStyle={Carouselstyles.slider}
                        contentContainerCustomStyle={Carouselstyles.sliderContentContainer}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                    />
                    <Pagination
                        dotsLength={3}
                        activeDotIndex={slider1ActiveSlide}
                        containerStyle={Carouselstyles.paginationContainer}
                        dotColor={'rgba(255, 255, 255, 0.92)'}
                        dotStyle={Carouselstyles.paginationDot}
                        inactiveDotColor={colors.black}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={slider1Ref}
                        tappableDots={!!slider1Ref}
                    /> */}
                    
                </View>


                <Column style={cstyles.shortLinkIconsCon}>
                    <View style={cstyles.shortLinkIconCon}>
                        <TouchableOpacity 
                            rounded 
                            style={cstyles.shortLinkIconBtn} 
                            onPress={() => navigation.navigate('CategoriesListScreen',
                                { name: 'All Categories' })
                            }
                        >
                            <Image 
                                source={require('../../assets/icons/categories.png')}
                                style={{ width: 40, height: 40 }}
                            />
                            {/* <Icon name="md-menu" style={cstyles.shortLinkIcon} /> */}
                        </TouchableOpacity>
                            <Text>Categories</Text>
                    </View>

                    <View style={cstyles.shortLinkIconCon}>
                        <TouchableOpacity 
                            rounded 
                            style={cstyles.shortLinkIconBtn}
                            onPress={() => navigation.navigate('CartScreen', 
                                { name: 'Cart' })
                            }
                        >
                            <Image 
                                source={require('../../assets/icons/cart.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>
                            <Text>My Cart</Text>
                    </View>

                    <View style={cstyles.shortLinkIconCon}>
                        <TouchableOpacity 
                            rounded 
                            style={cstyles.shortLinkIconBtn}
                            onPress={() => navigation.navigate('Wishlist', 
                                { name: 'Wish List' })
                            }
                        >
                            <Image 
                                source={require('../../assets/icons/like.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>
                            <Text>Wish List</Text>
                    </View>

                    <View style={cstyles.shortLinkIconCon}>
                        <TouchableOpacity 
                            rounded 
                            style={cstyles.shortLinkIconBtn}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Image 
                                source={require('../../assets/icons/account.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>
                            <Text>Account</Text>
                    </View>

                </Column>

                {coupons.length > 0 && <Card>
                    {coupons.map((item, index) => {
                        return (
                            <TouchableHighlight
                                key={index}
                                onPress={() => this.openModal(item)}
                            >
                                <Image 
                                    style={{ width: WINDOW_WIDTH, height: (WINDOW_WIDTH / 4) * 3 }} 
                                    source={{ uri: item.image }} 
                                    resizeMode='cover'
                                    key={index}
                                />
                            </TouchableHighlight>
                        );
                    })}
                </Card>}

                {/* Babies Fashion */}
                {this.renderBanner('babies')}

                {/* Kids Fashion */}
                {this.renderBanner('kids')}

                {/* Lastes PRoducts */}
                <Card style={cstyles.cardCon}>
                    <CardItem header style={{ justifyContent: 'space-between' }}>
                        <Text>New Arrivals</Text>
                        <Button 
                            small 
                            transparent
                            onPress={() => navigation.navigate(
                                'NewProductsList',
                                {
                                    query: `https://fashiongalaxy.pk/wp-json/wc/v2/products/?consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}&status=publish`,
                                    name: 'New Arrivals'
                                }
                            )}
                        >
                            <Text>View more</Text>
                        </Button>
                    </CardItem>
                    {!lastetProdustLoading && 
                        <ProductsCarousel 
                            data={lastetProdust}
                            navigation={navigation}
                            viewMore={{
                                query: `https://fashiongalaxy.pk/wp-json/wc/v2/products/?consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}&status=publish`,
                                name: 'New Arrivals'
                            }}
                        />
                    }
                    {lastetProdustLoading && 
                        <Spinner 
                            size="small"
                            style={{ alignSelf: 'center' }}
                        />
                    }
                </Card>


                {/* Gents Fashion */}
                {this.renderBanner('gents')}

                {/* On Sale Products */}
                <Card style={cstyles.cardCon}>
                    <CardItem header style={{ justifyContent: 'space-between' }}>
                        <Text>On Sale Products</Text>
                        <Button 
                            small 
                            transparent
                            onPress={() => navigation.navigate(
                                'NewProductsList',
                                {
                                    query: `https://fashiongalaxy.pk/wp-json/wc/v2/products/?on_sale=true&status=publish&consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}`,
                                    name: 'On Sale Products'
                                }
                            )}
                        >
                            <Text>View more</Text>
                        </Button>
                    </CardItem>
                    {!onSaleProductsLoading && 
                        <ProductsCarousel 
                            data={onSaleProducts}
                            navigation={navigation}
                            viewMore={{
                                query: `https://fashiongalaxy.pk/wp-json/wc/v2/products/?on_sale=true&status=publish&consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}`,
                                name: 'On Sale Products'
                            }}
                        />
                    }
                    {onSaleProductsLoading && 
                        <Spinner 
                            size="small"
                            style={{ alignSelf: 'center' }}
                        />
                    }
                </Card>

                {/* Ladies Fashion */}
                {this.renderBanner('ladies')}
                

                {/* Featured Products */}
                <Card style={cstyles.cardCon}>
                    <CardItem header style={{ justifyContent: 'space-between' }}>
                        <Text>Featured Products</Text>
                        <Button 
                            small 
                            transparent
                            onPress={() => navigation.navigate(
                                'NewProductsList',
                                {
                                    query: `https://fashiongalaxy.pk/wp-json/wc/v2/products/?featured=true&status=publish&consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}`,
                                    name: 'Featured Products'
                                }
                            )}
                        >
                            <Text>View more</Text>
                        </Button>
                    </CardItem>
                    {!featuredProductsLoading && 
                        <ProductsCarousel 
                            data={featuredProducts}
                            navigation={navigation}
                            viewMore={{
                                query: `https://fashiongalaxy.pk/wp-json/wc/v2/products/?featured=true&status=publish&consumer_key=${CUSTOMER_KEY}&consumer_secret=${CUSTOMER_SEC}`,
                                name: 'Featured Products'
                            }}
                        />
                    }
                    {featuredProductsLoading && 
                        <Spinner 
                            size="small"
                            style={{ alignSelf: 'center' }}
                        />
                    }
                </Card>

                {/* Toys */}
                <Card>
                    <CardItem cardBody style={{ marginTop: 0, alignItems: 'flex-start' }}>
                        <Grid>
                            <TouchableOpacity
                                onPress={() => 
                                this.props.navigation.navigate('category', {
                                    name: 'Home Decors',
                                    back: 'home',
                                    catId: 48
                                })}
                            >
                                <Row>
                                    <Image                                             
                                        source={{ uri: 'https://fashiongalaxy.pk/app/images/home-decors.jpg' }} 

                                        style={[cstyles.catImg, { height: 180 }]}
                                    />
                                    <View style={cstyles.catNameCon}>
                                        <Text style={cstyles.catName}>Home Decors</Text>
                                    </View>
                                </Row>     
                            </TouchableOpacity>
                            <Row>
                                <Col>
                                    <TouchableOpacity
                                       onPress={() => 
                                        this.props.navigation.navigate('category', {
                                            name: 'Special Soghat',
                                            back: 'home',
                                            catId: 83
                                        })} 
                                    >
                                        <Card>
                                            <Image 
                                                source={{ uri: 'https://fashiongalaxy.pk/app/images/special-soghat.jpg' }}
                                                style={[cstyles.catImg, { height: 180 }]}
                                            />
                                            <View style={cstyles.catNameCon}>
                                                <Text style={cstyles.catName}>
                                                    Special Soghat
                                                </Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </Grid>
                    </CardItem>
                </Card>

            </Content>}
            <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    onRequestClose={() => this.closeModal()}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
                <View style={cstyles.dialog} key="prompt">

                    <View style={cstyles.dialogOverlay}/>
                    {!sendMsg && couponRes === '' && <View style={[cstyles.dialogContent]}>
                        <View style={[cstyles.dialogTitle]}>
                            <Text style={[cstyles.dialogTitleText]}>Enter your mobile number to get coupon code.</Text>
                            {emptyNumber && <Text style={{ fontSize: 12, color: 'red', textAlign: 'center' }}>Please enter a valid phone number</Text>}
                        </View>
                        <View style={cstyles.dialogBody}>
                            <TextInput
                                style={[cstyles.dialogInput]}
                                onChangeText={val => this.setState({ phoneNumber: val })}
                                placeholder={'start typing'}
                                autoFocus
                                underlineColorAndroid="white"
                                onSubmitEditing={() => this.sendMessage()}
                            />
                        </View>
                        <View style={[cstyles.dialogFooter]}>
                            <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <View style={[cstyles.dialogAction]}>
                                <Text style={[cstyles.dialogActionText]}>Cancel</Text>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.sendMessage()}>
                            <View style={[cstyles.dialogAction]}>
                                <Text style={[cstyles.dialogActionText]}>Send</Text>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>}

                    
                    {sendMsg && <View style={[cstyles.dialogContent]}>
                        <View style={cstyles.dialogBody}>
                            <Spinner />
                        </View>
                        
                    </View>}
                    {!sendMsg && couponRes !== '' && <View style={[cstyles.dialogContent]}>
                        <View style={[cstyles.dialogTitle]}>
                            <Text style={[cstyles.dialogTitleText]}>{couponRes}</Text>
                        </View>
                        <View style={[cstyles.dialogFooter]}>
                            <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <View style={[cstyles.dialogAction]}>
                                <Text style={[cstyles.dialogActionText]}>Close</Text>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>}
                    
                </View>
            </Modal>

        </Container>

        );
    }

}

const cstyles = StyleSheet.create({
    fill: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    horizontalWrapper: {
        flexDirection: 'row',
      },
      animal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      animalAnimatedBox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
    card: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    headerNav: {
      backgroundColor: '#FFFFFF00', 
      alignItems: 'center',
      borderBottomColor: 'transparent', 
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: null,
      height: HEADER_MAX_HEIGHT,
    },
    bar: {
      backgroundColor: 'transparent',
      marginTop: Platform.OS === 'ios' ? 28 : 38,
      height: 32,
      // alignItems: 'center',
      // justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    title: {
      color: 'white',
      fontSize: 18,
    },
    headerIcon: {
      color: 'white',
      fontSize: 20,
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
        shadowRadius: 5,
        shadowOffset: {
            height: 0,
            width: 0
        },
    },
    badgesColored: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
    shadowRadius: 5,
    shadowOffset: {
        height: 0,
        width: 0
    },
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
    ...fonts.sizes.body2,
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
    width: 160,
    height: 160,
    marginRight: -64,
    },
    catImg: { 
        width: null,
        flex: 1,
        resizeMode: 'stretch',
    },
    catNameCon: {
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: 50, 
        backgroundColor: '#00000060', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    catName: { fontSize: 20, 
        color: 'white', 
        fontWeight: 'bold'
    },
    catSubImg: { width: null, flex: 1, height: 110, resizeMode: 'cover', },
    catSubNameCon: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: 30, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    catSubName: { 
        fontSize: 15, 
        color: 'white',
        fontWeight: 'bold'
    },
    homeDecors: { width: null, flex: 1, height: 150, },
    shortLinkIconsCon: { 
        margin: 10, 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10 
    },
    shortLinkIconCon: {
        alignItems: 'center',
        marginHorizontal: 5
    },
    shortLinkIcon: { color: 'white' },
    shortLinkIconBtn: { 
        marginBottom: 5
    },
    dialogOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    dialogContent: {
        elevation: 5,
        marginTop: 150,
        width: 300,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        overflow: 'hidden'
    },
    dialogTitle: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    dialogTitleText: {
        fontSize: 18,
        fontWeight: '600'
    },
    dialogBody: {
        paddingHorizontal: 10
    },
    dialogInput: {
        height: 50,
        fontSize: 18
    },
    dialogFooter: {
        borderTopWidth: 1,
        flexDirection: 'row',
    },
    dialogAction: {
        flex: 1,
        padding: 15
    },
    dialogActionText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#006dbf'
    },
    dialog: {
        flex: 1,
        alignItems: 'center'
    },
    
});

export default connect(null, actions)(HomeScreen);
