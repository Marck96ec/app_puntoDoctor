import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { Icon } from 'react-native-elements'

import DoctorsStack from "./DoctorsStack";
import FavoriteStack from './FavoritesStack';
import TopDoctorsStack from './TopDoctorsStack';
import SearchStack from './SearchStack';
import AccountStack from './AccountStack';

//import Doctors from "../screens/Doctors";
//import Favorites from "../screens/Favorites";
//import TopDoctors from "../screens/TopDoctors";
//import Search from "../screens/Search";
//import Account from "../screens/Account";


const Tab = createBottomTabNavigator();

export default function Navigation() {
    return(
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName="doctors"
                tabBarOptions={{
                    inactiveTintColor: "#646464",
                    activeTintColor: "#00A798",
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                })}
            >
                <Tab.Screen 
                name="doctors" 
                component={DoctorsStack} 
                options={{ title: "Doctores"}}
                />
                <Tab.Screen 
                name="favorites" 
                component={FavoriteStack}
                options={{ title: "Favoritos"}}
                />
                <Tab.Screen 
                name="top-doctors" 
                component={TopDoctorsStack}
                options={{ title: "Top 5"}}
                />
                <Tab.Screen 
                name="search" 
                component={SearchStack}
                options={{ title: "Buscar"}}
                />
                <Tab.Screen 
                name="account" 
                component={AccountStack}
                options={{ title: "Cuenta"}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {
    let iconName;

    switch (route.name) {
        case "doctors":
            iconName = "doctor"
            break;
        case "favorites":
            iconName = "heart-outline"
            break;
        case "top-doctors":
            iconName = "star-outline"
            break;
        case "search":
            iconName = "magnify"
            break;
        case "account":
            iconName = "home-outline"
            break;
        default:
            break;
    }

    return(
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )

}