import React, { useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Image, Icon , Rating } from "react-native-elements";

export default function ListTopConsultorios(props) {
    const { consultorios, navigation } = props;

    return (
        <FlatList 
            data={consultorios}
            renderItem={(consultorio) => (<Consultorio consultorio={consultorio} navigation={navigation} />)}
            keyExtractor={(item, index) => index.toString() }
        />
    )
}

function Consultorio(props) {
    const { consultorio, navigation } = props;
    const {id, name, rating, images, description } = consultorio.item;
    const [iconColor, setIconColor] = useState("#000");

    useEffect(() => {
        if(consultorio.index === 0) {
            setIconColor("#efb819");
        }else if(consultorio.index === 1){
            setIconColor("#e3e4e5");
        }else if(consultorio.index === 2){
            setIconColor("#cd7f32");
        }
    }, [])

   

    return(
        <TouchableOpacity onPress={() => navigation.navigate("doctors", { screen: "doctor", params: { id }})}>
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image
                    style={styles.consultorioImage}
                    resizeMode="cover"
                    source={
                        images[0]
                            ? { uri: images[0] }
                            :require("../../../assets/img/no-image.png")
                    }
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating 
                        imageSize={20}
                        startingValue={rating}
                        readonly
                        
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 30,
        borderWidth: 0
    },
    containerIcon:{
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1,
    },
    consultorioImage:{
        width: "100%",
        height:200 ,
    },
    titleRating:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    title:{
        fontSize: 20,
        fontWeight: "bold",
    },
    description:{
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    }
})
