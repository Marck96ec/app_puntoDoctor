import React, { useState, useEffect, useRef } from 'react';
import {View, Text} from "react-native";
import Toast from "react-native-easy-toast";
import ListTopConsultorios from '../components/Ranking/ListTopConsultorios';

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopDoctors(props) {
    const { navigation } = props;
    const [consultorios, setConsultorios] = useState([]);
    const toastRef = useRef();

    useEffect(() => {
       db.collection("consultorios") 
       .orderBy("rating", "desc")
       .limit(5)
       .get()
       .then((response) => {
        const consultorioArray = [];
        response.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            consultorioArray.push(data);
        })
        setConsultorios(consultorioArray);
       })

    }, [])

    return(
        <View>
            <ListTopConsultorios consultorios={consultorios} navigation={navigation} />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}