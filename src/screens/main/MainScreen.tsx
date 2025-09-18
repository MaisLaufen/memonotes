import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import NotesListScreen from '../notes/NotesScreen'
import FoldersScreen from "../folders/FoldersScreen";
import MainAppBar from "../../components/MainAppBar";
import MainSearchBar from "../../components/MainSearchBar";
import MainTabBar from "../../components/MainTabBar";
import SummariesScreen from "../summaries/SummariesScreen";

const MainScreen = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('notes');
  const tabs = [
    {key: 'notes', label: 'Заметки'},
    {key: 'folders', label: 'Папки'},
    {key: 'summaries', label: 'Коспекты'}
  ]

  return (
    <View style={styles.container}>
    <View style={{height: 15}}/>
    <MainAppBar/>
    <MainSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={() => console.log('search')}
    />
      <MainTabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab}/>

      {/* Контент вкладок */}
      <View style={styles.content}>
        { activeTab === "notes" && <NotesListScreen/> }
        { activeTab === "folders" && <FoldersScreen/> }
        { activeTab === "summaries" && <SummariesScreen/> } 
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
      <View style={{height: 20}}/>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000ff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'red'
  },
  content: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "transparent",
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

export default MainScreen;