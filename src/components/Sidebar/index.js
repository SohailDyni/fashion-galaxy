import React, { Component } from 'react';
import { ImageBackground, Image } from 'react-native';
import { connect } from 'react-redux';
import {
	Content,
	Text,
	List,
	ListItem,
	Icon,
	Container,
	Left,
	Thumbnail,
	H2,
	Col
} from 'native-base';
import AppLink from 'react-native-app-link';
import { phonecall } from 'react-native-communications';

import * as actions from '../../actions';
import styles from './style';

const drawerCover = require('./drawer-cover.png');
const defaultUser = require('../../../assets/images/default-user-icon-profile.png');

class SideBar extends Component {

	static navigationOptions = { header: null };	

	constructor(props) {
		super(props);
		this.state = {
			shadowOffsetWidth: 1,
			shadowRadius: 4,
		};
	}

	chatPress = () => {
		AppLink.maybeOpenURL('fb-messenger://user/785476308139187', { appName: 'Messenger', appStoreId: 'id454638411', playStoreId: 'com.facebook.orca' })
		.catch((err) => {
			console.log(err);
		});
	}

	renderMenuItem(row, secID, rowId) {
		const { navigation } = this.props;

		if (row.route === 'category') {
			return (
				<ListItem 
					button 
					noBorder onPress={() => 
					navigation.navigate(row.route, {
						isLogedIn: row.isLogedIn,
						name: row.name,
						back: 'home',
						slug: row.slug,
						catId: row.catId
					})} key={rowId}
				>
					<Left>
						<Image source={row.icon} style={{ height: 26, width: 26, }} />
						<Text style={styles.text}>
							{ row.name }
						</Text>
					</Left>
				</ListItem>
			);
		}

		return (
			<ListItem 
				button 
				noBorder onPress={() => 
				navigation.navigate(row.route, {
					isLogedIn: row.isLogedIn,
					name: row.name,
					back: 'home',
				})} key={rowId}
			>
				<Left>
					<Icon 
						active 
						name={row.icon} 
						style={{ color: '#777', fontSize: 26, width: 26, textAlign: 'center' }} 
					/>
					<Text style={styles.text}>
						{ row.name }
					</Text>
				</Left>
			</ListItem>
		);
	}
	

	render() {
		const { navigation, customer } = this.props;
		const isLogedIn = Object.keys(customer).length > 0;
		
		const datas = [
			{
				name: 'Home',
				route: 'home',
				icon: 'md-home',
			},
			{
				name: 'All Categories',
				route: 'CategoriesListScreen',
				icon: 'md-menu',
			},
			{
				name: 'Babies Fashion',
				route: 'category',
				slug: 'babies-fashion',
				icon: require('../../../assets/icons/babies-fashion.png'),
				catId: 24
			},
			{
				name: 'Kids Fashion',
				route: 'category',
				slug: 'kids-fashion',
				icon: require('../../../assets/icons/kids-fashion.png'),
				catId: 18
			},
			{
				name: 'Ladies Fashion',
				route: 'category',
				slug: 'ladies-fashion',
				icon: require('../../../assets/icons/ladies-fashion.png'),
				catId: 22
			},
			{
				name: 'Gents Fashion',
				route: 'category',
				slug: 'gents-fashion',
				icon: require('../../../assets/icons/gents-fashion.png'),
				catId: 23
			},
			{
				name: 'Home Decor',
				route: 'category',
				slug: 'home-decor',
				icon: require('../../../assets/icons/home-decors.png'),
				catId: 48
			},
			{
				name: 'Special Soght',
				route: 'category',
				slug: 'special-soghat',
				icon: require('../../../assets/icons/special-soghat.png'),
				catId: 83
			},
			{
				name: 'Cart',
				route: 'CartScreen',
				icon: 'md-cart',
			},
			{
				name: 'Account',
				route: 'Profile',
				icon: 'md-contact',
				isLogedIn
			},
			{
				name: 'Orders',
				route: 'Orders',
				icon: 'md-paper',
				isLogedIn
			},
			{
				name: 'Wish List',
				route: 'Wishlist',
				icon: 'md-heart',
			}
		];

		function imageSource() {
			if (customer.picture) {
				return customer.picture.data.url;
			}
			return customer.avatar_url;
		}

		function getFullName() {
			return `${customer.first_name} ${customer.last_name}`;
		}
		return (
			<Container style={{}}>
				<Content bounces={false} style={{ flex: 1, backgroundColor: '#fff', top: -1 }}>
					<ImageBackground source={drawerCover} style={styles.drawerCover}>
						{isLogedIn && <Col style={styles.drawerImage}>
							<Thumbnail large source={{ uri: imageSource() }} />
							<H2 style={{ color: 'white', marginTop: 5 }}>{getFullName()}</H2>
							<Text style={{ color: 'white', marginTop: 5 }}>{customer.email}</Text>
						</Col>}
						{!isLogedIn && <Col style={styles.drawerImage}>
							<Thumbnail large source={defaultUser} />
							<Text style={{ color: 'white', marginTop: 5 }}>
								Your are not logged in.
							</Text>
						</Col>}
					</ImageBackground>
					<List
						dataArray={datas}
						renderRow={(row, secID, rowId) => this.renderMenuItem(row, secID, rowId)
						}
					/>	
					<ListItem 
						button 
						noBorder 
						onPress={() => {
							if (isLogedIn) {
								this.props.doLogout(navigation);
							} else {
								navigation.navigate('Login');
							} 
						}
						} 
					>
						<Left>
							<Icon 
								active name={'md-cart'} 
								style={{ color: '#777', fontSize: 26, width: 30 }} 
							/>
							<Text style={styles.text}>
								{ isLogedIn ? 'Logout' : 'Login'}
							</Text>
						</Left>
					</ListItem>

					<ListItem 
						button 
						noBorder 
						onPress={() => this.chatPress()
						} 
					>
						<Left>
							<Icon 
								active name={'ios-chatbubbles'} 
								style={{ color: '#777', fontSize: 26, width: 30 }} 
							/>
							<Text style={styles.text}>
								Chat with us
							</Text>
						</Left>
					</ListItem>

					<ListItem 
						button 
						noBorder 
						onPress={() => phonecall('+923336564181', true)} 
					>
						<Left>
							<Icon 
								active name={'md-call'} 
								style={{ color: '#777', fontSize: 26, width: 30 }} 
							/>
							<Text style={styles.text}>
								Contact us
							</Text>
						</Left>
					</ListItem>

				</Content>
			</Container>
		);
	}
}

function mapStateToProps({ customer }) {
	return { customer };
}

export default connect(mapStateToProps, actions)(SideBar);
