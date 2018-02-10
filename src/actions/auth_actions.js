import { AsyncStorage } from 'react-native';

import { 
    FETCH_CUSTOMER, FETCH_ORDERS, LOGOUT_CUSTOMER
} from './types';


async function storeCustomer(customer, navigation, dispatch) {
    await AsyncStorage.setItem('customer_data', JSON.stringify(customer));
    dispatch({ type: FETCH_CUSTOMER, payload: customer });
    navigation.navigate('home');
    const orders = await getOrdersFromApi(customer.id);
    dispatch({ type: FETCH_ORDERS, payload: orders });
}


export const doLogin = () => async (dispatch) => {
    //AsyncStorage.removeItem('customer_data');
    let customer_data = await AsyncStorage.getItem('customer_data');
    if (customer_data) {
        let customer = JSON.parse(customer_data);
        dispatch({ type: FETCH_CUSTOMER, payload: customer });
        const orders = await getOrdersFromApi(customer.id);
        dispatch({ type: FETCH_ORDERS, payload: orders });
    }
}

export const doLogout = (navigation) => async (dispatch) => {
    await AsyncStorage.removeItem('customer_data');
    dispatch({ type: LOGOUT_CUSTOMER, payload: [] });
    dispatch({ type: FETCH_ORDERS, payload: [] });
    navigation.navigate('home');
}

export const updateCustomer = (uID, billing) => async (dispatch) => {
    const customer = await updateCustomerFromApi(uID, billing);
    dispatch({ type: FETCH_CUSTOMER, payload: customer });
}


export const createCustomer = (data, navigation) => async (dispatch) => {
    const customer = await storeCustomer(data, navigation, dispatch);
}


async function updateCustomerFromApi( uID, billing ) {
    try {
      let response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/customers/${ uID }?consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`,{
          method: 'PUT',
          body: `{ "billing": ${JSON.stringify(billing)} }`,
          headers: new Headers({ 'Content-Type': 'application/json' })
      });
      let responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
}



export const fetchCustomer = (navigation, data) => async (dispatch) => {
    const customer = await getCustomerFromApi(data.id);
    await AsyncStorage.setItem('customer_data', JSON.stringify(customer));
    dispatch({ type: FETCH_CUSTOMER, payload: customer });
    navigation.navigate('home');
    const orders = await getOrdersFromApi(customer.id);
    dispatch({ type: FETCH_ORDERS, payload: orders });
}



async function getCustomerFromApi( uID ) {
    try {
      let response = await fetch(`https://fashiongalaxy.pk/wp-json/wc/v2/customers/${ uID }?consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a`);
      let responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
}

const fetchOrders = (uID) => async (dispatch) => {
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