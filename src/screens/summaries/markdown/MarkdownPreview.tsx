import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface PreviewProps {
  content: string;
}

const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <ScrollView style={styles.container}>
      <Markdown style={markdownStyles}>
        {content || 'Начните писать, чтобы увидеть предпросмотр...'}
      </Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
});

// Стили без строгой типизации
const markdownStyles = {
  heading1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 10,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  em: {
    fontStyle: 'italic' as const,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  codespan: {
    backgroundColor: '#333',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  list_item: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  bullet_list: {
    paddingLeft: 20,
  },
};

export default Preview;