import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import Preview from './markdown/MarkdownPreview';
import MarkdownEditor from './markdown/MarkdownEditor';
import { summariesStore } from '../../stores/summaryStore';

type EditSummaryScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'EditSummary'>;

const EditSummaryScreen = () => {
  const navigation = useNavigation<EditSummaryScreenNavigationProp>();
  const route = useRoute();
  const { summaryId, folderId } = route.params as {
    summaryId: string;
    folderId: string;
  } || {};
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);

  // Получаем существующий конспект если редактируем
  useEffect(() => {
    if (summaryId) {
      const existingSummary = summariesStore.getSummaryById(summaryId);
      if (existingSummary) {
        setTitle(existingSummary.title);
        setContent(existingSummary.content);
      }
    }
  }, [summaryId]);

  // Заголовок навигации
  useEffect(() => {
    navigation.setOptions({
      headerTitle: summaryId ? 'Редактировать конспект' : 'Новый конспект',
    });
  }, [navigation, summaryId]);

  // Сохранение конспекта
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название конспекта');
      return;
    }

    setIsSaving(true);
    
    try {
      if (summaryId) {
        // Обновление существующего конспекта
        await summariesStore.updateSummary(summaryId, {
          title: title.trim(),
          content: content,
        });
        Alert.alert('Успех', 'Конспект успешно обновлен');
      } else {
        // Создание нового конспекта
        await summariesStore.addSummary(title.trim(), content, folderId);
        Alert.alert('Успех', 'Конспект успешно создан');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить конспект');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, summaryId, navigation]);

  // Мемоизированные стили
  const modeButtonStyles = useMemo(() => ({
    edit: [styles.modeButton, mode === 'edit' && styles.activeModeButton],
    preview: [styles.modeButton, mode === 'preview' && styles.activeModeButton]
  }), [mode]);

  const modeButtonTextStyles = useMemo(() => ({
    edit: [styles.modeButtonText, mode === 'edit' && styles.activeModeButtonText],
    preview: [styles.modeButtonText, mode === 'preview' && styles.activeModeButtonText]
  }), [mode]);

  // Memoized components
  const renderEditor = useMemo(() => (
    <MarkdownEditor 
      content={content} 
      onChange={setContent} 
    />
  ), [content]);

  const renderPreview = useMemo(() => (
    <View style={styles.fullPreviewContainer}>
      <Preview content={content} />
    </View>
  ), [content]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Название конспекта"
            placeholderTextColor="#888"
            maxLength={100}
            returnKeyType="done"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeSwitcher}>
        <TouchableOpacity
          style={modeButtonStyles.edit}
          onPress={() => setMode('edit')}
        >
          <Text style={modeButtonTextStyles.edit}>
            Редактор
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={modeButtonStyles.preview}
          onPress={() => setMode('preview')}
        >
          <Text style={modeButtonTextStyles.preview}>
            Предпросмотр
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {mode === 'edit' ? renderEditor : renderPreview}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 8,
    padding: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeModeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  fullPreviewContainer: {
    flex: 1,
    padding: 16,
  },
});

export default EditSummaryScreen;