import { 
    FETCH_PRODUCTS, FETCH_PRODUCTS_CATS,
    FETCH_PRODUCTS_CATS_SUB,

} from './types';


// async function getProductsFromApi(catId='') {
//     const category =  catId == '' ? '' : '&category='+catId;
//     try {
//       let response = await fetch('https://fashiongalaxy.pk/wp-json/wc/v2/products?per_page=10&page=1&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a'+category);
//       let responseJson = await response.json();
//       return responseJson;
//     } catch(error) {
//       console.error(error);
//     }
// }





// export const fetchProducts = (callback, catId) => async (dispatch) => {
//     const products = await getProductsFromApi(catId);
//     dispatch({ type: FETCH_PRODUCTS, payload: products });
//     callback();
// }



// async function getProductsCats() {
//     try {
//       let response = await fetch('https://fashiongalaxy.pk/wp-json/wc/v2/products/categories?parent=0&per_page=20&hide_empty=true&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a');
//       let responseJson = await response.json();
//       return responseJson;
//     } catch(error) {
//       console.error(error);
//     }
// }

// export const fetchProductsCats = (callback) => async (dispatch) => {
//     const categories = await getProductsCats();
//     dispatch({ type: FETCH_PRODUCTS_CATS_SUB, payload: categories });
//     callback();
// }


// async function getProductsCatsSub(id) {
//     try {
//       var response = await fetch('https://fashiongalaxy.pk/wp-json/wc/v2/products/categories?parent='+ id +'&per_page=20&hide_empty=true&consumer_key=ck_f67cf0524d5255e440c15b79eefd5baf3727e9b4&consumer_secret=cs_bd2d40e087738b7fcad5f576ba426cb20efaca5a');
//       var responseJson = await response.json();
//       return responseJson;
//     } catch(error) {
//       console.error(error);
//     }
// }

// export const fetchProductsCatsSub = (callback, id) => async (dispatch) => {
//     const categories = await getProductsCatsSub(id);
//     dispatch({ type: FETCH_PRODUCTS_CATS, payload: categories });
//     callback();
// }