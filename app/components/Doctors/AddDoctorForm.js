import React , { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert , Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input , Button } from "react-native-elements";
import { map , size, filter} from "lodash";
import * as MediaLibrary  from "expo-media-library";
import * as ImagePicker from "expo-image-picker";



export default function AddDoctorForm(props) {
    const { toastRef, SetIsLoading, navigation } = props;
    const [doctorName, setDoctorName] = useState("");
    const [doctorAddress, setDoctorAddress] = useState("");
    const [doctorDescription, setDoctorDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);

    const AddDoctor = () => {
        console.log("Ok");
        console.log(doctorName);
    }

    return (
        <ScrollView style={StyleSheet.ScrollView}>
            <FormAdd 
                setDoctorName={setDoctorName}
                setDoctorAddress={setDoctorAddress}
                setDoctorDescription={setDoctorDescription}
            />
            <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected}/>
            <Button 
                title="Crear Doctor"
                onPress={AddDoctor}
                buttonStyle={styles.btnAddDoctor}
            />
        </ScrollView>
    )
}

function FormAdd(props) {
    const { setDoctorName, setDoctorAddress, setDoctorDescription} = props;
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
    }
})