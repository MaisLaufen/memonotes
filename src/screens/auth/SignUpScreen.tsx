import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { userStore } from '../../stores/userStore';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type SignUpNavProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen = observer(() => {
  const [username, setUsername] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<SignUpNavProp>();

  const handleSignUp = async () => {
    const success = await userStore.register(username, login, password);
    if (success) {
      Alert.alert('Успех', 'Регистрация прошла успешно', [ // TODO: Switch to modal
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Ошибка', 'Пользователь с таким логином уже существует'); // TODO: Switch to modal
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput style={styles.input} placeholder="Имя" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Логин" value={login} onChangeText={setLogin} />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Зарегистрироваться" onPress={handleSignUp} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default SignUpScreen;