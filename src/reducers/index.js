import { combineReducers } from 'redux';

import products from './products_reducer';

import cart from './cart_reducer';

import customer from './auth_reducer';

import orders from './orders_reducer';

import wishlist from './wishlist_reducer';

// import colors from './colors_reducer';

export default combineReducers({
    products, cart, customer, orders, wishlist
});
