import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { notesStore } from '../../stores/notesStore';
import NoteItem from '../../components/Note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import { Folder } from '../../types/models/folder';

type FolderDetailScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'FolderDetail'>;

const FOLDER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const FolderDetailScreen = observer(() => {
  const navigation = useNavigation<FolderDetailScreenNavigationProp>();
  const route = useRoute();
  const { folderId, folderName, folderColor } = route.params as { 
    folderId: string; 
    folderName: string;
    folderColor: string;
  };
  const subFolders = notesStore.getSubFolders(folderId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [showAddFolderForm, setShowAddFolderForm] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);

  const folderNotes = notesStore.getNotesByFolder(folderId);

  const handleAddNote = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название заметки');
      return;
    }
    
    try {
      await notesStore.addNote(title.trim(), description, folderId);
      setTitle('');
      setDescription('');
      setShowAddForm(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить заметку');
    }
  };

  const handleEditNote = (noteId: string) => {
    navigation.navigate('EditNote', { noteId });
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Удаление заметки',
      'Вы уверены, что хотите удалить эту заметку?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => notesStore.deleteNote(noteId)
        }
      ]
    );
  };

  const handleAddSubFolder = async () => {
    if (!newFolderName.trim()) {
        Alert.alert('Ошибка', 'Введите название папки');
        return;
    }
    
    try {
        await notesStore.addFolder(newFolderName.trim(), newFolderColor, folderId);
        setNewFolderName('');
        setNewFolderColor(FOLDER_COLORS[0]);
        setShowAddFolderForm(false);
    } catch (error) {
        Alert.alert('Ошибка', 'Не удалось создать папку');
    }
    };

  const renderFolderItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity 
        style={styles.subFolderItem}
        onPress={() => {
        navigation.navigate('FolderDetail', {
            folderId: item.id,
            folderName: item.name,
            folderColor: item.color || '#ff0000'
        });
        }}
    >
        <View style={[styles.folderColorIndicator, { backgroundColor: item.color || '#ff0000' }]} />
        <View style={styles.folderInfoText}>
        <Text style={styles.folderItemName}>{item.name}</Text>
        <Text style={styles.folderItemCount}>
            {notesStore.getNotesByFolder(item.id).length} заметок
        </Text>
        </View>
        <Text style={styles.folderArrow}>→</Text>
    </TouchableOpacity>
    );

  const renderAddForm = () => (
    <View style={styles.addNoteForm}>
      <TextInput
        style={styles.noteInput}
        placeholder="Название заметки"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />
      <TextInput
        style={[styles.noteInput, styles.noteDescription]}
        placeholder="Описание (необязательно)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => {
            setShowAddForm(false);
            setTitle('');
            setDescription('');
          }}
        >
          <Text style={styles.cancelButtonText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          onPress={handleAddNote}
          disabled={!title.trim()}
        >
          <Text style={styles.saveButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: folderColor }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.folderTitle}>{folderName}</Text>
        <Text style={styles.noteCount}>{folderNotes.length} заметок</Text>
      </View>

      {/* Кнопка добавления заметки */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addNoteButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addNoteButtonText}>
            {showAddForm ? '✕ Закрыть' : '+ Добавить заметку'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.addNoteButton, { marginTop: 8 }]}
        onPress={() => setShowAddFolderForm(!showAddFolderForm)}
        >
        <Text style={styles.addNoteButtonText}>
            {showAddFolderForm ? '✕ Закрыть создание папки' : '+ Создать подпапку'}
        </Text>
        </TouchableOpacity>

        {showAddFolderForm && (
            <View style={styles.addNoteForm}>
                <TextInput
                style={styles.noteInput}
                placeholder="Название папки"
                value={newFolderName}
                onChangeText={setNewFolderName}
                autoFocus
                />
                <Text style={styles.colorLabel}>Выберите цвет:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
                {FOLDER_COLORS.map((color) => (
                    <TouchableOpacity
                    key={color}
                    style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newFolderColor === color && styles.selectedColor
                    ]}
                    onPress={() => setNewFolderColor(color)}
                    />
                ))}
                </ScrollView>
                <View style={styles.formActions}>
                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                    setShowAddFolderForm(false);
                    setNewFolderName('');
                    setNewFolderColor(FOLDER_COLORS[0]);
                    }}
                >
                    <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.saveButton, !newFolderName.trim() && styles.saveButtonDisabled]}
                    onPress={handleAddSubFolder}
                    disabled={!newFolderName.trim()}
                >
                    <Text style={styles.saveButtonText}>Создать</Text>
                </TouchableOpacity>
                </View>
            </View>
            )}

      {/* Форма добавления заметки */}
      {showAddForm && renderAddForm()}

      {subFolders.length > 0 && (
        <View style={styles.subFoldersContainer}>
            <Text style={styles.sectionTitle}>Подпапки</Text>
            <FlatList
            data={subFolders}
            keyExtractor={(item) => item.id}
            renderItem={renderFolderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subFoldersList}
            />
        </View>
        )}

      {/* Список заметок */}
      {folderNotes.length === 0 && !showAddForm ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>В этой папке пока нет заметок</Text>
          <Text style={styles.emptySubtext}>Нажмите "+ Добавить заметку" чтобы создать первую</Text>
        </View>
      ) : (
        <FlatList
          data={folderNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteItem 
              note={item} 
              color='#00ff00'
              onEdit={() => handleEditNote(item.id)} 
              onDelete={() => handleDeleteNote(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        paddingTop: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 50,
        padding: 10,
    },
    backButtonText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    folderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    noteCount: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    addButtonContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    addNoteButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addNoteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    addNoteForm: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    noteInput: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6,
        fontSize: 16,
        marginBottom: 12,
    },
    noteDescription: {
        height: 80,
        textAlignVertical: 'top',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
    subFoldersContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    },
    sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    },
    subFoldersList: {
    gap: 12,
    },
    subFolderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    },
    folderColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    },
    folderInfoText: {
    flex: 1,
    },
    folderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    },
    folderItemCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    },
    folderArrow: {
    fontSize: 16,
    color: '#999',
    },colorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  colorPicker: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 2,
  },
});

export default FolderDetailScreen;