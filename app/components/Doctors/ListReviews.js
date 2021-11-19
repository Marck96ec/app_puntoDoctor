import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
    const {navigation, idDoctor, setRating} = props;
    const [userLogged, setUserLogged] = useState(false);

    console.log(userLogged);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    return (
        <View>
            {userLogged ? (
                <Button 
                    title="Escribe una opinión" 
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddReview}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#2D6974"
                    }}
                    onPress={() => navigation.navigate("add-review-doctor",  {
                        idDoctor: idDoctor,
                    })
                }
                />
            ) : (
                <View>
                    <Text
                        style={{ textAlign: "center", color: "#00a680" , padding: 20 }}
                        onPress={() => navigation.navigate("login")}
                    >Para escribir un comentario es necesario estar logeado{" "}
                    <Text style={{ fontWeight: "bold"}}>pulsa AQUI para iniciar sesión</Text>
                    </Text>
                    
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#2D6974",
    }
})
