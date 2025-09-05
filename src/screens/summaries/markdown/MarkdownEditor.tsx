import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput, StyleSheet, Keyboard, NativeSyntheticEvent, TextInputKeyPressEventData, KeyboardAvoidingView, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownEditorProps {
  content: string;
  onChange: (text: string) => void;
}

// Preview компонент
const Preview = React.memo(({ content }: { content: string }) => {
  const markdownStyles = useMemo(() => ({
    body: { fontSize: 16, color: '#333', lineHeight: 22 },
    heading1: { fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
    heading2: { fontSize: 20, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
    heading3: { fontSize: 18, fontWeight: 'bold', marginTop: 6, marginBottom: 3 },
    code_block: { 
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
      backgroundColor: '#f0f0f0', 
      padding: 12,
      borderRadius: 4,
      marginVertical: 5
    },
    link: { color: '#1E90FF', textDecorationLine: 'underline' },
    paragraph: { marginBottom: 8 },
    list_item: { marginLeft: 10, marginBottom: 4 }
  }), []);

  return (
    <ScrollView style={styles.previewContainer}>
      <Markdown>
        {content || '*Начните писать, и здесь появится предпросмотр...*'}
      </Markdown>
    </ScrollView>
  );
});

// Основной компонент
const MarkdownEditor = React.memo(({ content, onChange }: MarkdownEditorProps) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);
  
  // Debounce функция
  const debounceRef = React.useRef<any>(null);
  
  const debouncedOnChange = useCallback((text: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onChange(text);
    }, 300);
  }, [onChange]);

  const handleTextChange = useCallback((text: string) => {
    setLocalContent(text);
    debouncedOnChange(text);
  }, [debouncedOnChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.previewSection}>
        <Preview content={localContent} />
      </View>
      
      <View style={styles.editorSection}>
        <View style={styles.editorHeader}>
          <Text style={styles.editorHeaderText}>Редактор</Text>
        </View>
        <TextInput
          style={styles.textInput}
          multiline
          value={localContent}
          onChangeText={handleTextChange}
          placeholder="Введите ваш текст здесь (поддерживается Markdown)..."
          placeholderTextColor="#888"
          textAlignVertical="top"
          autoCapitalize="sentences"
          autoComplete="off"
          keyboardAppearance="default"
          autoFocus={false}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewSection: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  editorSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  editorHeader: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  editorHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  textInput: {
    minHeight: 200,
    maxHeight: 300,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    lineHeight: 22,
  },
});

export default MarkdownEditor;