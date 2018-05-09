import Expo from 'expo';
import React from 'react';
import { View } from 'react-native';
import { TabNavigator, StackNavigator, } from 'react-navigation';
import { Provider } from 'react-redux';

import store from './src/store';
import MainCategoryScreen from './src/screens/Products/MainCategoryScreen';
import ProductDetailScreen from './src/screens/Products/ProductDetailScreen';
import CategoriesListScreen from './src/screens/Products/CategoriesListScreen';
import CategoriesSubListScreen from './src/screens/Products/CategoriesSubListScreen';
import ProductSearch from './src/screens/Products/ProductSearch';
import NewProductsListScreen from './src/screens/Products/NewProductsListScreen';

import Drawer from './src/screens/Drawer';
import { OrdersScreen, WishlistScreen, ProfileScreen, Login, } from './src/screens/Account';
import Shipping from './src/screens/Checkout/Shipping';
import Confirmation from './src/screens/Checkout/Confirmation';
import ThankYou from './src/screens/Checkout/ThankYou';
import { themeColors } from './src/MaterialValues';
import AdBanner from './src/components/AdBanner';

export default class App extends React.Component {

	constructor() {
		super();
		this.state = {
			isReady: false,
			colors: {}
		};
	}
	
	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
		});

		await this.fetchColors();

		this.setState({ isReady: true });
	}

	async fetchColors() {	
		try {
			await fetch('https://fashiongalaxy.pk/app/colors.json')
			.then(res => res.json())
			.then(res => this.setState({
				colors: res
			}))
			.catch(error => console.log(error));
		} catch (error) {
			console.error(error);
		}
	}
		
	render() {
		const { colors } = this.state;
		const MainNavigator = StackNavigator({
			// Login: { screen: Login },	
		
		Login: { screen: Login },
		OpenDrawer: { screen: Drawer, navigationOptions: { header: null } },		
		ThankYou: { screen: ThankYou },
		Checkout: { screen: Shipping },
		Confirmation: { screen: Confirmation },
		category: { screen: MainCategoryScreen, params: { name: 'kids' } },

		Profile: {
			screen: TabNavigator(
				{
					Profile: { screen: ProfileScreen, params: { name: 'Profile' } },
					Orders: { screen: OrdersScreen },
					Wishlist: { screen: WishlistScreen },
				},
				{
					tabBarPosition: 'top',
					animationEnabled: true,
					tabBarOptions: {
						activeTintColor: '#ffffff',
						style: {
							backgroundColor: themeColors.color2,
						},
					},
				},
			),
		},
		ProductDetail: { 
			screen: ProductDetailScreen, 
			navigationOptions: { header: null },
		},
		NewProductsList: { screen: NewProductsListScreen },		
		CategoriesListScreen: { screen: CategoriesListScreen },
		CategoriesSubListScreen: { screen: CategoriesSubListScreen },
		ProductSearch: { screen: ProductSearch },
	},
	{ 
		headerMode: 'float',
		mode: 'card',
		initialRouteName: 'OpenDrawer',
		navigationOptions: {
			// headerStyle: {
			// 	height: 100,   
			// },
			// headerTitleStyle: { color: 'white' },
			// headerTintColor: 'white'
			//header: null
		}
	}
	
	);
	if (!this.state.isReady) {
		return <Expo.AppLoading />;
	}
	return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					{<MainNavigator screenProps={{ colors }} />}
					<AdBanner />
				</View>
			</Provider>
		);
	}
}

