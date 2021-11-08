import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopDoctors from "../screens/TopDoctors";

const Stack = createStackNavigator();

export default function TopDoctorsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="top-doctors"
                component={TopDoctors}
                options={{ title: "Mejores Doctores"}}
            />
        </Stack.Navigator>
    )
}