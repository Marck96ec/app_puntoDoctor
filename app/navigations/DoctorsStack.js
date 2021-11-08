import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import Doctors from '../screens/Doctors';

const Stack = createStackNavigator();

export default function DoctorsStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="doctors"
                component={Doctors}
                options={{ title: "Doctor"}}
            />
        </Stack.Navigator>
    )
}