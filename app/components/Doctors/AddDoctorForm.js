import React , { useState , useEffect} from 'react';
import { StyleSheet, View, ScrollView, Alert , Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input , Button } from "react-native-elements";
import { map , size, filter} from "lodash";
import * as MediaLibrary  from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";

const widthScreen = Dimensions.get("window").width;



export default function AddDoctorForm(props) {
    const { toastRef, setIsLoading, navigation } = props;
    const [doctorName, setDoctorName] = useState("");
    const [doctorAddress, setDoctorAddress] = useState("");
    const [doctorDescription, setDoctorDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationDoctor, setLocationDoctor] = useState(null);

    const AddDoctor = () => {
        if(!doctorName || !doctorAddress || !doctorDescription){
            toastRef.current.show("Todos los campos del formulario son obligatorios");
        }else if (size(imagesSelected) === 0) {
            toastRef.current.show("El Consultorio tiene que tenerl almenos una foto");
        }else if (!locationDoctor) {
            toastRef.current.show("Tienes que localizar el consultorio en el mapa");
        }else {
            setIsLoading(true);
            uploadImageStorage().then(response => {
                setIsLoading(false);
            });
        }
    }

    const uploadImageStorage = async () => {

        const imageBlob = [];

        Promise.all(
            map(imagesSelected, async image => {
                const response = await fetch(image)
                const blob = await response.blob();
                const name = uuid();
                const ref = firebase.storage().ref("consultorios").child(name);
                await ref.put(blob).then(async result => {
                    await firebase
                        .storage()
                        .ref(`consultorios/${name}`)
                        .getDownloadURL()
                        .then( (photoUrl) => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );

        

        return imageBlob;
    }

    return (
        <ScrollView style={StyleSheet.ScrollView}>
            <ImageDoctor imagenDoctor2={imagesSelected[0]} imagenDoctor={imagesSelected[1]}/>
            <FormAdd 
                setDoctorName={setDoctorName}
                setDoctorAddress={setDoctorAddress}
                setDoctorDescription={setDoctorDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationDoctor={locationDoctor}
            />
            <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected} />
            <Button 
                title="Crear Doctor"
                onPress={AddDoctor}
                buttonStyle={styles.btnAddDoctor}
            />
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} setLocationDoctor={setLocationDoctor} toastRef={toastRef} />
        </ScrollView>
    )
}

function ImageDoctor(props) {
    const {imagenDoctor,imagenDoctor2} = props;

    return (
        <View style={styles.viewPhoto} >
            <Image 
                source={imagenDoctor ? { uri: imagenDoctor } : require("../../../assets/img/no-image.png")}
                style={{ width: widthScreen , height: 200}}
            />
            
            <Avatar 
                containerStyle={styles.viewPhotoperfil}
                size="xlarge"
                rounded
                source={imagenDoctor2 ? { uri: imagenDoctor2 } : require("../../../assets/img/avatar-default.jpg")}
                
                
            />
        </View>
    )
}

function FormAdd(props) {
    const { setDoctorName, setDoctorAddress, setDoctorDescription, setIsVisibleMap, locationDoctor} = props;
    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del Doctor"
                containerStyle={styles.input}
                onChange={e => setDoctorName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={e => setDoctorAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationDoctor ? "#a60d0d" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input 
                placeholder="Descripción del Doctor"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setDoctorDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const {isVisibleMap, setIsVisibleMap , setLocationDoctor, toastRef } = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
           console.log(status);
           if (status !== "granted") {
               TransformStreamDefaultController.current.show(
                   "Tienes que aceptar los permisos de localizacion para crear un consultorio",3000);
           }else {
               const loc = await Location.getCurrentPositionAsync({});
               setLocation({
                   latitude: loc.coords.latitude,
                   longitude: loc.coords.longitude,
                   latitudeDelta: 0.001,
                   longitudeDelta: 0.001,
               });
           }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationDoctor(location);
        toastRef.current.show("Localización guardada correctamente");
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap} >
            <View>
                {location && (
                    <MapView
                     style={styles.mapStyle}
                     initialRegion={location}
                     showUserLocation={true}
                     onRegionChange={(region) => setLocation(region)}
                     >
                         <MapView.Marker 
                         coordinate={{
                             latitude: location.latitude,
                             longitude: location.longitude
                         }}
                         draggable
                         />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                         <Button 
                            title="Guardar Ubicación" 
                            containerStyle={styles.viewMapBtnContainerSave}
                            buttonStyle={styles.viewMapBtnSave}
                            onPress={confirmLocation}
                         />
                         <Button 
                            title="Cancelar Ubicación" 
                            containerStyle={styles.viewMapBtnContainerCancel} 
                            buttonStyle= {styles.viewMapBtnCancel}
                            onPress={() => setIsVisibleMap(false) }
                         />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage(props) {
    const { toastRef, imagesSelected, setImagesSelected } = props;

    const imageSelect = async () => {
        const resultPermission = await MediaLibrary.requestPermissionsAsync();
        const resultPermissionCamera = resultPermission.status;

        
        if (resultPermissionCamera === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente.", 3000);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            })


            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galería sin seleccionar ninguna imagen.", 2000);
     
            } else {

                setImagesSelected([...imagesSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {

       

        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [{
                text: "Cancel",
                style: "cancel"
            },{
                text: "Eliminar",
                onPress: () => {
                    setImagesSelected(
                        filter(imagesSelected, (imageUrl) => imageUrl !== image)
                    );
                    
                   
                }
            }],
            {cancelable: false}
        )
    }

    return (
        <View style={styles.viewImages}>
            {size(imagesSelected) < 4 && (
                <Icon 
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            
            {map(imagesSelected, (imageDoctor, index) => (
                <Avatar 
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: imageDoctor}}
                    onPress={() => removeImage(imageDoctor)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    ScrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddDoctor: {
        backgroundColor: "#2D6974",
        margin: 20
    },
    viewImages:{
       flexDirection: "row",
       marginLeft: 20,
       marginRight: 20,
       marginTop: 30, 
    },
    containerIcon:{
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 55,
        width: 55,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 55,
        height: 55,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    viewPhotoperfil:{
        position: "absolute",
        bottom: 40,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
    },
    mapStyle:{
        width: "100%",
        height: 550,

    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel:{
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor: "#2D6974",
    }
})