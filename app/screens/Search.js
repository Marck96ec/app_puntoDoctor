import React, { useState, useEffect } from 'react';
import { StyleSheet ,View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id"});

export default function Search(props) {
    const {navigation} = props;
    const [search, setSearch] = useState("");
    const [consultorios, setConsultorios] = useState([]);

    useEffect(() => {
        if (search) {
            fireSQL.query(`SELECT * FROM consultorios WHERE name LIKE '${search}%'`)
                .then((response) => {
                    setConsultorios(response);
                 })
        }
        
    }, [search])

    return(
        <View>
            <SearchBar
                placeholder="Buscar consultorio ... "
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={StyleSheet.SearchBar}
            />
            {consultorios.length === 0 ? (
                <NoFoundConsultiorios />
            ) : (
                <FlatList 
                    data={consultorios}
                    renderItem={(consultorio) => <Consultorio consultorio={consultorio} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
}

function NoFoundConsultiorios() {
    return (
        <View style={{ flex: 1 , alignItems: "center" }}>
            <Image 
                source={require("../../assets/img/no-result-found.png")}
                resizeMode="cover"
                style={{ width: 200 , height: 200 }}
            />
        </View>
    )
    
}

function Consultorio(props){
    const {consultorio , navigation } = props;
    const { id, name, images} = consultorio.item;

    return (
        <ListItem 
            title={name}
            leftAvatar={{
                source: images[1] ? { uri : images[1] } : require("../../assets/img/no-result-found.png")
            }}
            rightIcon={<Icon type="material-community" name="chevron-right" />}
            onPress={() => navigation.navigate("doctors", {
                screen: "doctor",
                params: { id, name }
            })}
        />
    )
}

const styles = StyleSheet.create({
    SearchBar:{
        marginBottom: 20,
    }
})