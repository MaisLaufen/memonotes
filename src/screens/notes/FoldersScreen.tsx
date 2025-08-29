import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FoldersScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Здесь будут отображаться папки с заметками</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'pink'},
});

export default FoldersScreen;