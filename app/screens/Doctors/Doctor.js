import React, {useState, useEffect , useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
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
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    navigation.setOptions({ title: name });

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

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

    useEffect(() => {
        if (userLogged && consultorio) {
            db.collection("favorites")
                .where("idConsultorio", "==", consultorio.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    if(response.docs.length === 1){
                        setIsFavorite(true);
                    }
                })
        }
        
    }, [userLogged, consultorio])

    const addFavorite = () => {
        if (!userLogged) {
            toastRef.current.show("Para usar el sistema de favoritos tienes que estar logueado");
        }else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idConsultorio: consultorio.id
            }
            db.collection("favorites")
                .add(payload)
                .then(() =>{
                    setIsFavorite(true);
                    toastRef.current.show("Restaurante añadido a favoritos");
                })
                .catch(() => {
                    toastRef.current.show("Error al añadir el consultorio a favoritos");
                })
        }
    }

    const removeFavorite = () => {
        db.collection("favorites")
            .where("idConsultorio", "==", consultorio.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const idFavorite = doc.id;
                    db.collection("favorites")
                    .doc(idFavorite)
                    .delete()
                    .then(() => {
                        setIsFavorite(false);
                        toastRef.current.show("Consultorio eliminado de favoritos");
                    })
                    .catch(() => {
                        toastRef.current.show(
                            "Error al eliminar el consultorio de favoritos"
                        );
                    })
                })
            })
    }

    if(!consultorio) return <Loading isVisible={true} text="Cargando..." />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#f00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
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
            <Toast 
                ref={toastRef}
                position="center"
                opacity={0.9}
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
    viewFavorite:{
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 5,

    }
});
