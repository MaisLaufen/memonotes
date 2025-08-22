import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { userStore } from '../../stores/userStore';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import MemoInput from '../../components/MemoInput';
import MemoButton from '../../components/MemoButton';
import HrefText from '../../components/HrefText';
import AlertModal from '../../modals/AlertModal';
import HeaderLogo from '../../components/Header';

type SignUpNavProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen = observer(() => {
  const [username, setUsername] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const navigation = useNavigation<SignUpNavProp>();

  const handleSignUp = async () => {
    if (!username || !login || !password) {
      setAlertMessage('Заполните все поля');
      setAlertModalVisible(true);
      return;
    }

    setLoading(true);
    const success = await userStore.register(username, login, password);
    setLoading(false);

    if (success) {
      setAlertMessage('Регистрация прошла успешно!');
      setAlertModalVisible(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1000);
    } else {
      setAlertMessage('Пользователь с таким логином уже существует');
      setAlertModalVisible(true);
    }
  };

  return (
    <View style={styles.screen}>
    <View style={styles.header}>
      <HeaderLogo/>
    </View>
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <MemoInput placeholder="Имя" value={username} onChangeText={setUsername} />
      <MemoInput placeholder="Логин" value={login} onChangeText={setLogin} />
      <MemoInput placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />

      <MemoButton title="Зарегистрироваться" onPress={handleSignUp} loading={loading} />

      <HrefText text="Уже есть аккаунт? Войти" onPress={() => navigation.navigate('Login')} />

      <AlertModal
        visible={alertModalVisible}
        title="Уведомление"
        message={alertMessage}
        onClose={() => setAlertModalVisible(false)}
      />
    </View>
    </View>
  );
});

const styles = StyleSheet.create({
    screen : {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#0c0b0b"
    },
    header: {
        alignItems: 'center',
        paddingTop: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default SignUpScreen;