import { AsyncStorage } from 'react-native';
import _ from 'lodash';

import { ADD_TO_CART, FETCH_CART, DELETE_OBJ_CART,
    EMPTY_CART
} from '../actions/types';

const INITIAL_STATE = {
    results: []
};

async function addCartToAsync(data){
    await AsyncStorage.setItem('customer_cart', JSON.stringify(data));
}

function checkUnique( payload, state ){
    for (var i = 0; i < state.length; i++) {
        var obj = state[i];
        if( payload.product.id == obj.product.id ){
            state.splice(i, 1);
        }
    }
    addCartToAsync([payload, ...state]);
    return [payload, ...state];
}

function deleteObj(state, payload){
    state.splice(payload, 1);
    addCartToAsync(state);
    return state;
}



function emptyCart(state){
    
    for (let i = 0; i < state.length; i++) {
        const item = state[i];
        if (item.isChecked) {
            state.splice(i, 1);
        }
    }
    addCartToAsync(state);
    return state;
}


export default function( state = [], action ){
    switch (action.type) {
        case ADD_TO_CART:
            return checkUnique(action.payload, state);
        case FETCH_CART: 
            return action.payload;
        case DELETE_OBJ_CART:
            return deleteObj(state, action.payload);
        case EMPTY_CART:
            return emptyCart(state);
        default:
            return state;
    }
}