import { AsyncStorage } from 'react-native';

async function fetchColors() {
    let colors = {};

    try {
        await fetch('http://fashiongalaxy.pk/app/colors.json')
        .then(res => res.json())
        .then(res => colors = res)
        .catch(error => console.log(error));
    } catch (error) {
      console.error(error);
    }
    finally {
        return colors;
    }
}

const initalState = fetchColors();

export default function( initalState, action ){
    switch (action.type) {
       default:

       
    }
}
