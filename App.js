import React, { useEffect} from 'react';
import { LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";


LogBox.ignoreLogs(["Setting a timer","It appears that","Animated: `useNativeDriver` was"]);

export default function App() {

 
  
    return <Navigation />
  
}


