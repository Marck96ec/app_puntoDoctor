import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function AddReviewDoctor(props) {
    const { navigation, route } = props;
    const { idDoctor } = route.params;

    console.log(idDoctor);
    return (
        <View>
            <Text>addrevireDoctor</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
