import React, { useEffect} from 'react';
import { LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
import { decode, encode } from "base-64";

LogBox.ignoreLogs(["Setting a timer","It appears that","Animated: `useNativeDriver` was"]);

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
    return <Navigation />
}


