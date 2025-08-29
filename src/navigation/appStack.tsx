import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import MainScreen from '../screens/notes/MainScreen';

export type AppStackParamList = {
    Main: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} options={{title: 'Заметки', headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Главный экран' }} />
    </Stack.Navigator>
  );
}