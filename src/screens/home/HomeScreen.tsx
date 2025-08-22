import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { userStore } from '../../stores/userStore';

const HomeScreen = observer(() => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Привет, {userStore.currentUser?.username}!</Text>
      <Button title="Выйти" onPress={() => userStore.logout()} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});

export default HomeScreen;