import React from 'react';
import { StatusBar,Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./src/screens/Home";
import Trips from './src/screens/Trips';
import Trip from "./src/screens/Trip";
import Services from "./src/screens/Services";
import Service from "./src/screens/Service";
import Alert from './src/screens/Alert';

const Stack = createStackNavigator();

function App({navigation}) {
    var color='dark-content'
    const mode = Appearance.getColorScheme()
    if (mode==='dark'){
        color='light-content'
    }else{
        color='dark-content'
    }
    return(
        <NavigationContainer>
            <StatusBar barStyle={color} />
            <Stack.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,})}
            >
                <Stack.Screen name="Garage" component={Home}/>
                <Stack.Screen name="Trips" component={Trips}/>
                <Stack.Screen name="Trip" component={Trip}/>
                <Stack.Screen name="Services" component={Services}/>
                <Stack.Screen name="Service" component={Service}/>
                <Stack.Screen name="Alert" component={Alert}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;