import { useState } from "react";
import { FOLDER_COLORS } from "../../theme/folder_colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/appStack";
import ColorPicker from "../../components/ColorPicker";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaFrameContext } from "react-native-safe-area-context";
import { folderStore } from "../../stores/foldersStore";

type FoldersScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;


const CreateFolderScreen = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(FOLDER_COLORS[0]);
    const navigation = useNavigation<FoldersScreenNavigationProp>();
  

  const handleSubmit = () => {
    // Сохранение через store
    folderStore.addFolder(name, color);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#121212' }}>
      <TextInput
        style={{ backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 }}
        placeholder="Название папки"
        value={name}
        onChangeText={setName}
      />
      <ColorPicker selected={color} onSelect={setColor} />
      <TouchableOpacity style={{ backgroundColor: '#34C759', padding: 12, borderRadius: 8, marginTop: 16 }} onPress={handleSubmit}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Создать</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateFolderScreen;