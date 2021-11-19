import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet,View, Text} from "react-native";
import { Icon } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListDoctors from "../../components/Doctors/ListDoctors";


const db = firebase.firestore(firebaseApp);


export default function Doctors(props) {
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [consultorios, setConsultorios] = useState([]);
    const [totalConsultorios, setTotalConsultorios] = useState(0);
    const [startConsultorios, setStartConsultorios] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitConsultorios = 7;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("consultorios").where('existencia', '==', true).onSnapshot((snap) => {
                setTotalConsultorios(snap.size);
            });
    
            
    
            db.collection("consultorios")
            .where('existencia', '==', true)
            .orderBy("createAt", "desc")
            .limit(limitConsultorios).onSnapshot((response) => {
                setStartConsultorios(response.docs[response.docs.length -1]);
                const resultConsultorios = [];
                response.forEach((doc) => {
                    
                    const consultorio = doc.data();
                    consultorio.id = doc.id;
                    resultConsultorios.push(consultorio);
                });
                setConsultorios(resultConsultorios);
            });
        }, [])
    );

    

    const handleLoadMore = () => {
        const resultConsultorios = [];

        consultorios.length < totalConsultorios && setIsLoading(true);

        db.collection("consultorios")
        .where('existencia', '==', true)
            .orderBy("createAt", "desc")
            .startAfter(startConsultorios.data().createAt)
            .limit(limitConsultorios)
            .get()
            .then((response) => {
                if(response.docs.length > 0) {
                    setStartConsultorios(response.docs[response.docs.length - 1]);
                }else {
                    setIsLoading(false);
                }
                
                response.forEach((doc) => {
                   
                    const consultorio = doc.data();
                    consultorio.id = doc.id;
                    resultConsultorios.push( consultorio );

                });

                setConsultorios([...consultorios, ...resultConsultorios]);
            });
    }

    return(
        <View style={styles.viewBody}>
            <ListDoctors 
                consultorios={consultorios}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />

            {user && (
            <Icon 
                reverse
                type="material-community"
                name="plus"
                color="#00A798"
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate("add-doctor") }
            />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
    }
})