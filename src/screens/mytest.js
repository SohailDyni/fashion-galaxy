import React, { Component } from 'react';
import { Drawer } from 'native-base';
import CartScreen from './CartScreen';
import HomeScreen from './HomeScreen';
import Sidebar from '../components/Sidebar';
import scrollAccordion from './scrollAccordion';


export default class mytest extends Component {
  render() {
    closeDrawer = () => {
      this.drawer._root.close()
    };
    openDrawer = () => {
      this.drawer._root.open()
    };
    return (
     <scrollAccordion/>
    );
  }
}