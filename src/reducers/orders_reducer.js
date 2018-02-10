import { FETCH_ORDERS } from '../actions/types';

const INITIAL_STATE = {
    results: []
};

export default function( state = [], action ){
    switch (action.type) {
        case FETCH_ORDERS:
            return action.payload; 
        default:
            return state;
    }
}