import React from 'react'
import {  StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Avatar, Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native"

export default function ListDoctors(props) {
    const {consultorios, handleLoadMore, isLoading} = props;
    const navigation = useNavigation();
    
    return (
        <View>
            {size(consultorios) > 0 ? (
                <FlatList 
                    data={consultorios}
                    renderItem={ (consultorio) => <Consultorio consultorio={consultorio} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ) : (
                <View style={styles.loaderConsultorios}>
                    <ActivityIndicator size="large" color="#00A798"/>
                    <Text>Cargando Consultorios</Text>
                </View>
            )}
        </View>
    );
}

function Consultorio(props) {
    const {consultorio, navigation} = props;
    const {id, images, name, addres, description} = consultorio.item;
    const imageConsultorio = images[1];
    const imageDoctor = images[0];

    const goConsutorio = () => {
        navigation.navigate("doctor" , {
            id, 
            name,
        });
    }

    return(
        <TouchableOpacity onPress={goConsutorio}>
            <View style={styles.viewConsultorio} >
                <View style={styles.viewConsultorioImage} >
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#00A798"/>}
                        source={
                            imageConsultorio
                            ? { uri: imageConsultorio }
                            : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageConsultorio}
                    />
                    <Avatar
                        size="small"
                        rounded
                        title="MT"
                        source={
                            imageDoctor
                            ? { uri: imageDoctor }
                            : require("../../../assets/img/avatar-default.jpg")
                        }
                        
                        containerStyle={styles.imageDoctor}
                        />
                </View>
                
                <View>
                    <Text style={styles.consultorioName}>{name}</Text>
                    <Text style={styles.consultorioAddress}>{addres}</Text>
                    <Text  style={styles.consultorioDescription}>
                        {description.substr(0, 60)}...
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList(props) {
    const { isLoading } = props;

    if(isLoading){
        return (
            <View style={styles.loaderConsultorios}>
                <ActivityIndicator size="large" color="#00A798" />
            </View>
        )
    }else {
        return(
            <View style={styles.notFoundConsultorios}>
                <Text>No quedan consultorios por cargar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderConsultorios: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    viewConsultorio: {
        flexDirection: "row",
        margin: 10,
    },
    viewConsultorioImage: {
        marginRight: 15
    },
    imageConsultorio: {
        width: 80,
        height: 80,
    },
    consultorioName: {
        fontWeight: "bold",
    },
    consultorioAddress: {
        paddingTop: 2 ,
        color: "#c2c2c2",
    },
    consultorioDescription: {
        paddingTop: 2 ,
        color: "grey",
        width: 300,
    },
    imageDoctor:{
        position: "absolute",
        bottom: 45,
        right: 3,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
    },
    notFoundConsultorios:{
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    }
})
