import React from 'react';
import { View, FlatList, Text, Image, Dimensions } from 'react-native';
import {  Container, Content, CardItem, Body, Left, } from 'native-base';
// import { Card, Button } from 'react-native-material-design';
import { Card, } from 'react-native-elements';
 
// import Api from "../WooCommerce/Api";

const WINDOW_WIDTH = Dimensions.get('window').width;

class ClothingScreen extends React.Component{
    
    renderProduct = (product) => {
        return (
            // <Container>
            <Card 
              image={product.image}
              containerStyle={styles.listItem}
            >
                <Text>{product.title }</Text>
                <Text style={ styles.priceStyle }>Rs. {product.price }</Text>
            </Card>
              
        );
    }


    render(){
        return (
                <FlatList
                    style={ styles.flatListStyle }
                    data={ data.getProducts() }
                    renderItem={ ({ item }) => this.renderProduct(item) }
                    numColumns={2}
                    keyExtractor={ item => item.url }
                />
        );
    }

}

const styles = {
  flatListStyle: {
    flex: 1,
    alignItems: 'space-around',
  },
  container: {
    alignItems: 'space-around'
},
listItem: {
    width: (WINDOW_WIDTH/2)-10,
    marginLeft: 5,
    marginRight: 5,
},
priceStyle:{
  fontWeight: 'bold',
}
  
}

export default ClothingScreen;