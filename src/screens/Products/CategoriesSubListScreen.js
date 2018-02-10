import React, { Component } from 'react';
import { 
	Container, Body, Spinner, 
	Content, List, Thumbnail, ListItem, Text 
} from 'native-base';
import { View } from 'react-native';

import { positions } from '../../MaterialValues';
import TopHeaderCat from '../TopHeaderCat';

class CategoriesSubListScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
        header: <TopHeaderCat navigation={navigation} />
    });

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: 1,
			error: null,
			loading: true,
			refreshing: false,
		};
	}

	componentDidMount() {
		this.makeRemoteRequest();
	}

	onListItemPress(catId, name) {
		this.props.navigation.navigate('category', { name, catId });
	}
	// VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. Object {

	makeRemoteRequest = () => {
		try {
		fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/products/categories?parent=${this.props.navigation.state.params.id}&per_page=20&hide_empty=true&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`)
			.then(res => res.json())
			.then(res => {
				this.setState({
					data: res,
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

	renderContent() {
		if (this.state.loading) {
			return (
				<View 
					style={[positions.alignItemCenter, positions.justifyContentCenter, { flex: 1 }]}
				>
					<Spinner size="large" />
				</View>
			);
		}

		return (
			<Content>
				<List 
					dataArray={this.state.data}
					renderRow={category => this.renderListItems(category)} 
				/>
			</Content>
		);
	}

	renderListItems(category) {
		return (
			<ListItem 
				onPress={
					this.onListItemPress.bind(this, category.id, category.name)
				} 
				style={styles.listItems}
			>
				<Thumbnail 
					square 
					size={40} 
					source={ 
						category.image.length <= 0 ? 
						require('../../../assets/images/img1.jpg') :
						{ uri: category.image.src }
					}
				/>
				<Body>
					<Text>{ category.name }</Text>
				</Body>
			</ListItem>
		);
	}

	render() {
		return (
		<Container>
			{ this.renderContent() }
		</Container>
		);
	}
}


const styles = {
    listItems: {
        marginLeft: 0,
        paddingLeft: 10,
        borderBottomColor: 'transparent',
    }
};

export default CategoriesSubListScreen;
