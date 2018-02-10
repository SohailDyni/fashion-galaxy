import { AsyncStorage } from 'react-native';

import { ADD_TO_WISHLIST, DELETE_OBJ_WISHLIST, FETCH_WISHLIST, EMPTY_WISHLIST
} from '../actions/types';

const INITIAL_STATE = {
    results: []
};

async function addWishlistToAsync(data){
    await AsyncStorage.setItem('customer_wishlist', JSON.stringify(data));
}

function checkUnique( payload, state ){
    for (var i = 0; i < state.length; i++) {
        var obj = state[i];
        if( payload.id == obj.id ){
            obj = payload;
            return [...state];
        }
    }
    addWishlistToAsync([payload, ...state]);
    return [payload, ...state];
}

function deleteObj(state, payload){
    state.splice(payload, 1);
    addWishlistToAsync(state);
    return state;
}

async function emptyWishlist(){
    await AsyncStorage.setItem('customer_wishlist', JSON.stringify([]));
    return [];
}


export default function( state = [], action ){
    switch (action.type) {
        case ADD_TO_WISHLIST:
            return checkUnique(action.payload, state);
        case FETCH_WISHLIST: 
            return action.payload;
        case DELETE_OBJ_WISHLIST:
            return deleteObj(state, action.payload);
        case EMPTY_WISHLIST:
            return emptyWishlist();
        default:
            return state;
    }
}