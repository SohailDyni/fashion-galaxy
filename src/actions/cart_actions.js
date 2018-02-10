import { AsyncStorage } from 'react-native';

import { 
    ADD_TO_CART,
    FETCH_CART,DELETE_OBJ_CART,
    EMPTY_CART
} from './types';

export const addToCart = (product, callback) => async (dispatch) => {
    dispatch({ type: ADD_TO_CART, payload: product });
    callback();
};


export const fetchCart = () => async (dispatch) => {
    //await AsyncStorage.removeItem('customer_cart');
    let cart = await AsyncStorage.getItem('customer_cart');
    if( cart ){
        dispatch({ type: FETCH_CART, payload: JSON.parse(cart) });
    }
    else{
        dispatch({ type: FETCH_CART, payload: [] });
    }
    
};


export const deleteObjCart = (cartObj, callback) => async (dispatch) => {
     dispatch({ type: DELETE_OBJ_CART, payload: cartObj });
     callback();
};

 export const emptyCart = cart => async (dispatch) => {
    dispatch({ type: EMPTY_CART, payload: cart });
};
