import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/main/MainScreen';
import EditNoteScreen from '../screens/notes/EditNoteScreen';
import FolderDetailScreen from '../screens/folders/FolderDetailScreen';
import CreateFolderScreen from '../screens/folders/CreateFolderScreen';
import CreateNoteScreen from '../screens/notes/CreateNoteScreen';
import EditSummaryScreen from '../screens/summaries/EditSummaryScreen';

export type AppStackParamList = {
    Main: undefined;
    EditNote: {noteId: string};
    FolderDetail: {
      folderId: string,
      folderName: string,
      folderColor: string,
      parentFolderId: string | null};
    CreateFolder: undefined;
    CreateNote: undefined;
    EditSummary: {
      summaryId?: string,
      folderId?: string
    };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} options={{title: 'Заметки', headerShown: false}} />
        <Stack.Screen name="EditNote" component={EditNoteScreen} options={{title: 'Изменение заметки', headerShown: false}}/>
        <Stack.Screen name="EditSummary" component={EditSummaryScreen} options={{title: 'Конспекты', headerShown: false}}/>
        <Stack.Screen name="CreateFolder" component={CreateFolderScreen} options={{title: 'Создание папки', headerShown: false}}/>
        <Stack.Screen name="CreateNote" component={CreateNoteScreen} options={{title: 'Создание заметки', headerShown: false}}/>
        <Stack.Screen name="FolderDetail" component={FolderDetailScreen} options={{title: 'В папке', headerShown: false}}/>
    </Stack.Navigator>
  );
}