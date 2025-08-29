import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import MainScreen from '../screens/notes/MainScreen';
import EditNoteScreen from '../screens/notes/EditNoteScreen';
import FolderDetailScreen from '../screens/notes/FolderDetailScreen';

export type AppStackParamList = {
    Main: undefined;
    EditNote: {noteId: string};
    FolderDetail: {
      folderId: string,
      folderName: string,
      folderColor: string};
    Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} options={{title: 'Заметки', headerShown: false}} />
        <Stack.Screen name="EditNote" component={EditNoteScreen} options={{title: 'Изменение заметки', headerShown: false}}/>
        <Stack.Screen name="FolderDetail" component={FolderDetailScreen} options={{title: 'В папке', headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Главный экран' }} />
    </Stack.Navigator>
  );
}