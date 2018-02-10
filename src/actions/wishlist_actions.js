import { AsyncStorage } from 'react-native';

import { 
    ADD_TO_WISHLIST,
    FETCH_WISHLIST,DELETE_OBJ_WISHLIST,
    EMPTY_WISHLIST
} from './types';

export const addToWishlist = (product) => async (dispatch) => {
    dispatch({ type: ADD_TO_WISHLIST, payload: product });
};


export const fetchWishlist = () => async (dispatch) => {
    //await AsyncStorage.removeItem('customer_cart');
    let wishlist = await AsyncStorage.getItem('customer_wishlist');
    if( wishlist ){
        dispatch({ type: FETCH_WISHLIST, payload: JSON.parse(wishlist) });
    }
    else{
        dispatch({ type: FETCH_WISHLIST, payload: [] });
    }
    
};


export const deleteObjWishlist = (wishlistObj, callback) => async (dispatch) => {
     dispatch({ type: DELETE_OBJ_WISHLIST, payload: wishlistObj });
     callback();
 }

export const emptyWishlist = () => {
    return { type: EMPTY_WISHLIST }
}