import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import Doctors from '../screens/Doctors/Doctors';
import AddDoctor from '../screens/Doctors/AddDoctors';
import Doctor from '../screens/Doctors/Doctor';

const Stack = createStackNavigator();

export default function DoctorsStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="doctors"
                component={Doctors}
                options={{ title: "Consultorios"}}
            />
            <Stack.Screen 
                name="add-doctor"
                component={AddDoctor}
                options={{ title: "Añadir nuevo consultorio"}}
            />
            <Stack.Screen 
                name="doctor"
                component={Doctor}
                
            />
        </Stack.Navigator>
    )
}