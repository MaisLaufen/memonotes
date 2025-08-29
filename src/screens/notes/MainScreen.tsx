import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { observer } from "mobx-react-lite";
import NotesListScreen from './NotesScreen'
import FoldersScreen from "./FoldersScreen";
import { userStore } from '../../stores/userStore'

const NotesScreen = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "folders">("notes");

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.header}>Мои заметки</Text>

      {/* Поиск */}
      <TextInput
        style={styles.input}
        placeholder="Поиск заметок..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Нижний таббар */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "notes" && styles.activeTab]}
          onPress={() => setActiveTab("notes")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notes" && styles.activeTabText,
            ]}
          >
            Все заметки
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "folders" && styles.activeTab]}
          onPress={() => setActiveTab("folders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "folders" && styles.activeTabText,
            ]}
          >
            Папки
          </Text>
        </TouchableOpacity>
      </View>

      {/* Контент вкладок */}
      <View style={styles.content}>
        {activeTab === "notes" ? (
          <NotesListScreen/>
        ) : (
          <FoldersScreen />
        )}
      </View>

      {/* Кнопка выхода */}
      {/* <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => userStore.logout()}
        >
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  content: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ccc",
    height: 50,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderTopWidth: 2,
    borderColor: "#007BFF",
  },
  tabText: {
    color: "#666",
    fontSize: 16,
  },
  activeTabText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NotesScreen;