import React, {useState, useEffect , useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../../components/Loading";
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import ListReviews from '../../components/Doctors/ListReviews';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Doctor(props) {
    
    const {navigation, route} = props;
    const {id, name } = route.params;
    const [consultorio, setConsultorio] = useState(null);
    const [rating, setRating] = useState(0);

    navigation.setOptions({ title: name });

    useFocusEffect(
        useCallback(() => {
            db.collection("consultorios")
            .doc(id)
            //.get()
            .onSnapshot((response) => {
                const data = response.data();
                data.id = response.id;
                setConsultorio(data);
                setRating(data.rating);
            });
        }, [])
    );

    

    if(!consultorio) return <Loading isVisible={true} text="Cargando..." />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <Carousel 
                arrayImages={consultorio.images}
                height={250}
                width={screenWidth}
            />
            <TitleConsultorio 
                name={consultorio.name}
                description={consultorio.description}
                rating={rating}
            />
            <ConsultorioInfo 
                location={consultorio.location}
                name={consultorio.name}
                address={consultorio.addres}
                precio={consultorio.precio}
            />
            <ListReviews 
                navigation={navigation}
                idDoctor={consultorio.id}
                
            />
        </ScrollView>
    )
}

function TitleConsultorio(props) {
    const { name, description, rating} = props;

    return (
        <View style={styles.viewConsultorioTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameConsultorio}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionConsultorio}>{description}</Text>
        </View>
    )
}

function ConsultorioInfo(props){
    const {location, name , address, precio} = props;

    const listInfo = [
        {
        text: address,
        iconName: "map-marker",
        iconType: "material-community",
        action: null,
        },
        {
        text: precio,
        iconName: "currency-usd",
        iconType: "material-community",
        action: null,
        },


];

    return(
        <View style={styles.viewConsultorioInfo}>
            <Text style={styles.consultorioInfoTitle}>Información sobre el consultorio</Text>
            <Map
                location={location}
                name={name}
                height={100}
            />
            {map(listInfo, (item, index) => (
                <ListItem 
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00a680",
                    }}
                    containerStyle={styles.containerListItem}
                    
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor: "#fff",
    },
    viewConsultorioTitle: {
        padding: 15,
    },
    nameConsultorio:{
        fontSize: 20,
        fontWeight: "bold",
    },
    descriptionConsultorio:{
        marginTop: 5,
        color: "grey"
    },
    rating:{
        position: "absolute",
        right: 0
    },
    viewConsultorioInfo: {
        margin: 15,
        marginTop: 25,
    },
    consultorioInfoTitle:{
        fontSize:20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    containerListItem:{
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1,

    },
});
