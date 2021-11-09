import React from 'react';
import { StyleSheet,View,Text } from 'react-native';
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as MediaLibrary  from "expo-media-library";
import * as ImagePicker from "expo-image-picker";


export default function InfoUser(props) {
    const { userInfo,toasRef }= props;
    const { uid, photoURL, displayName ,email } = userInfo;


    const changeAvatar = async () => {
        const resultPermission = await MediaLibrary.requestPermissionsAsync();
        const resultPermissionCamera = resultPermission.status;
        console.log(resultPermissionCamera);

        if (resultPermissionCamera === "denied") {
            toasRef.current.show("Es necesario aceptar los permisos de la galeria");
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            if (result.cancelled) {
                toasRef.current.show("Has cerrado la seleccion de imagenes");
            } else {
                uploadImage(result.uri).then(() => {
                    console.log("Imagen subida");
                }).catch(() => {
                    toasRef.current.show("Error al actualizar el avatar.");
                });
            }
        }
    }

const uploadImage = async (uri) => {
    const response = await fetch(uri);
    //console.log(JSON.stringify(response));
    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
}
    //console.log(photoURL);
    //console.log(displayName);
    //console.log(email);
    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={
                    photoURL ? { uri : photoURL}
                    : require("../../../assets/img/avatar-default.jpg")
                }
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    }
});