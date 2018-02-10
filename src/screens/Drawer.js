import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import CartScreen from './CartScreen';
import HomeScreen from './HomeScreen';
import Sidebar from '../components/Sidebar';

const Drawer = DrawerNavigator({
    home: { screen: HomeScreen },
    CartScreen: { screen: CartScreen },
    },
    {
        initialRouteName: 'home',
        contentOptions: {
          activeTintColor: '#e91e63'
        },
        
        contentComponent: props => <Sidebar {...props} />,
        navigationOptions: {
            header: null
        }
    }
);


export default Drawer;
