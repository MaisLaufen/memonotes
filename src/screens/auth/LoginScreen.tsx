import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { userStore } from '../../stores/userStore';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import AlertModal from '../../modals/AlertModal';

type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = observer(() => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation<LoginNavProp>();

  const handleLogin = async () => {
    if (!login && !password) {
        setAlertMessage("Заполните поле логина и пароля");
        setAlertModalVisible(true);
        return;
    }
    if (!login) {
        setAlertMessage("Заполните поле логина");
        setAlertModalVisible(true);
        return;
    }
    if (!password) {
        setAlertMessage("Заполните поле пароля");
        setAlertModalVisible(true);
        return;
    }
    const success = await userStore.login(login, password);
    if (!success) {
        setAlertMessage('Неудачная попытка входа. Попробуйте еще раз');
        setAlertModalVisible(true);
    } else { // TODO: Вообще убрать это
        setAlertMessage('Успешный вход!')
        setAlertModalVisible(true); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Логин"
        value={login}
        onChangeText={setLogin}
      /> // TODO: Вынести эти поля в отдельные компоненты
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Войти" onPress={handleLogin} /> // TODO: Добавить вывод о состоянии загрузки

      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Зарегистрироваться
      </Text>

      <AlertModal visible={alertModalVisible} title="e" message={alertMessage} onClose={() => setAlertModalVisible(false)} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});

export default LoginScreen;