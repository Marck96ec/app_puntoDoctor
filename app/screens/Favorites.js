import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet , View, Text, FlatList , ActivityIndicator, TouchableOpacity, Alert} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";


import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
    const { navigation } = props;
    const [consultorios, setConsultorios] = useState(null);
    const [userLogged, setUserLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const toastRef = useRef();

    console.log(consultorios);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useFocusEffect(
        useCallback(
            () => {
                if (userLogged) {
                    const idUser = firebase.auth().currentUser.uid;
                    db.collection("favorites")
                        .where("idUser", "==", idUser)
                        .get()
                        .then((response) => {
                            const idConsultorioArray = [];
                            response.forEach((doc) => {
                                console.log(doc.data());
                                idConsultorioArray.push(doc.data().idConsultorio);
                            });
                            getDataConsultorio(idConsultorioArray).then((response) => {
                                const consultorios = [];
                                response.forEach((doc) => {
                                    const consultorio = doc.data();
                                    consultorio.id = doc.id;
                                    consultorios.push(consultorio);
                                });
                                setConsultorios(consultorios);
                            });
                            
                        })
                }
                setReloadData(false);
            },[userLogged, reloadData],
        )
    );
    

    const getDataConsultorio = (idConsultorioArray) => {
        const arrayConsultorio = [];
        idConsultorioArray.forEach((idConsultorio) => {
            const result = db.collection("consultorios").doc(idConsultorio).get();
            arrayConsultorio.push(result);
        })
        return Promise.all(arrayConsultorio);
    }

    if(!userLogged){
        return <UserNoLogged navigation={navigation} />
    }
    
  if (consultorios?.length === 0){

        return <NotFoundConsultorios />
    }

    return(
        <View styles={styles.viewBody} >
            {consultorios ? (
                <FlatList 
                    data={consultorios}
                    renderItem={(consultorio) => <Consultorio consultorio={consultorio} setIsLoading={setIsLoading} toastRef={toastRef} setReloadData={setReloadData} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString() }
                />
            ) : (
                <View style={styles.loaderRestaurants} >
                    <ActivityIndicator />
                    <Text style={{ textAlign: "center" }}>Cargando Consultorios</Text>
                </View>
            )}
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text="Eliminado Consultorio" isVisible={isLoading} />
            
        </View>
    );
}

function NotFoundConsultorios(){
    return (
        <View style={{ flex:1 , alignItems: "center", justifyContent: "center"  }}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                No tienes consultorios en tu lista
            </Text>
        </View>
    )
}

function UserNoLogged(props) {
    const { navigation } = props;

    return(
        <View style= {{ flex: 1 , alignItems: "center" , justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{ fontSize: 20 , fontWeight: "bold" , textAlign: "center" }}> 
                Necesitas estar logueado para ver esta sección.
            </Text>
            <Button 
                title="Ir al login"
                containerStyle={{ marginTop: 20, width: "80%"}}
                buttonStyle={{ backgroundColor: "#2D6974"}}
                onPress={() => navigation.navigate("account", { screen: "login" })}
            />
        </View>
    )
}

function Consultorio(props) {

    const { consultorio, setIsLoading, toastRef , setReloadData, navigation} = props;
    const { id, name, images } = consultorio.item;

    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar Consultorio de Favoritos",
            "¿Estas seguro de que quieres eliminar el consultorio de favoritos?",
            [
                {
                    text: "Cancelar",
                    style: "Cancel",
                },
                {
                    text: "Eliminar",
                    onPress:removeFavorite,
                }
            ],
            { cancelable : false}
        )
    }

    const removeFavorite = () => {
        setIsLoading(true);
        db.collection("favorites")
        .where("idConsultorio", "==", id )
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
            response.forEach((doc) => {
                const idFavorite =  doc.id;
                db.collection("favorites")
                    .doc(idFavorite)
                    .delete()
                    .then(() => {
                        setIsLoading(false);
                        setReloadData(true);
                        toastRef.current.show("Consultorio eliminado correctamente");
                    })
                    .catch(() => {
                        setIsLoading(false);
                        toastRef.current.show("Error al eliminar el consultorio");
                    })
            });

        })
    }

    return (
        <View style={styles.consultorio}>
            <TouchableOpacity onPress={() => navigation.navigate("doctors" , { screen: "doctor", params: {id}, })}>
                <Image 
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff" />}
                    source={
                        images[1]
                        ? { uri: images[1] }
                        : require("../../assets/img/no-image.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorite}
                        onPress={confirmRemoveFavorite}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
    },
    consultorio:{
        margin:10 ,
    },image:{
        width: "100%",
        height: 180,
    },info:{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",

    },
    name: {
        fontWeight: "bold",
        fontSize: 30,
    },
    favorite:{
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100,
    }
})