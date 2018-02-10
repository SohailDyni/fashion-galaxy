import React, { Component } from 'react';
import { View } from 'react-native';
import {
	Fab, Icon
} from 'native-base';
import AppLink from 'react-native-app-link';


class Chat extends Component {

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


	render() {
		return (
            <View style={{ }}>
                <Fab
                    direction="up"
                    containerStyle={{ bottom: 10 }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.chatPress()} 
                >
                    <Icon name="ios-chatbubbles" />
                </Fab>
            </View>
		);
	}
}

export default Chat;
