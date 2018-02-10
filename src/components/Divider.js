import React from 'react';
import { View } from 'react-native';

export default class Divider extends React.Component {
    render(){
        return(
            <View 
                style={{ height: 1, backgroundColor: '#eee', flex: 1, marginTop: 10, marginBottom: 10 }}
            />
        );
    }
}