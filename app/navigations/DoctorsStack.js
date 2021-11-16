import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import Doctors from '../screens/Doctors/Doctors';
import AddDoctor from '../screens/Doctors/AddDoctors';

const Stack = createStackNavigator();

export default function DoctorsStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="doctors"
                component={Doctors}
                options={{ title: "Consultorio"}}
            />
            <Stack.Screen 
                name="add-doctor"
                component={AddDoctor}
                options={{ title: "Añadir nuevo consultorio"}}
            />
        </Stack.Navigator>
    )
}