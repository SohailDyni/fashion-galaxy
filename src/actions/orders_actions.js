import { AsyncStorage } from 'react-native';

import { 
    FETCH_ORDERS
} from './types';


//ordreO for order orders action
export const fetchOrdersO = (uID) => async (dispatch, getState) => {
        const orders = await getOrdersFromApi(uID);
        dispatch({ type: FETCH_ORDERS, payload: orders });
}



async function getOrdersFromApi( uID ) {
    try {
      let response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/orders?customer=${ uID }&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`);
      let responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
}

export const createOrder = (data, navigation, orderNote) => async (dispatch) => {
    try {
        let response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/orders?consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        let responseJson = await response.json();
        if( responseJson.id ){
            navigation.navigate('ThankYou', responseJson.number);
            fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/orders/${responseJson.id}/notes?consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`,{
                method: 'POST',
                body: JSON.stringify(orderNote),
                headers: new Headers({ 'Content-Type': 'application/json' })
            });
        }
    } catch(error) {
        console.error(error);
    }
}