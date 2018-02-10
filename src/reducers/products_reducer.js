import { FETCH_PRODUCTS, FETCH_PRODUCTS_CATS, FETCH_PRODUCTS_CATS_SUB } from '../actions/types';

const INITIAL_STATE = {
    results: []
};

export default function( state = INITIAL_STATE, action ){
    switch (action.type) {
        case FETCH_PRODUCTS:
            return action.payload; 
        case FETCH_PRODUCTS_CATS:
            return action.payload;
            case FETCH_PRODUCTS_CATS_SUB:
            return action.payload;   
        default:
            return state;
    }
}