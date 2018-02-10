import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';

import { Drawer } from 'native-base';
import TopHeader from './TopHeader';
import Sidebar from '../components/Sidebar';
import HomeScreen from './HomeScreen';

export default class mytest extends Component {
  render() {
    closeDrawer = () => {
      this.drawer._root.close()
    };
    openDrawer = () => {
      this.drawer._root.open()
    };
    const { navigation } = this.props;
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0,height: 500 }}>
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<Sidebar navigation={this.navigation} />}
        onClose={() => closeDrawer()} >
        <TopHeader navigation={this.navigation} openDrawer={openDrawer}/>
        <HomeScreen navigation = { this.navigation }/>
      </Drawer>
      </View>
    );
  }
}