import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { userStore } from '../../stores/userStore';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import AlertModal from '../../components/modals/AlertModal';
import MemoInput from '../../components/MemoInput';
import MemoButton from '../../components/MemoButton';
import HrefText from '../../components/HrefText';

type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = observer(() => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation<LoginNavProp>();

  const handleLogin = async () => {
    if (!login && !password) {
      setAlertMessage('Заполните поле логина и пароля');
      setAlertModalVisible(true);
      return;
    }
    if (!login) {
      setAlertMessage('Заполните поле логина');
      setAlertModalVisible(true);
      return;
    }
    if (!password) {
      setAlertMessage('Заполните поле пароля');
      setAlertModalVisible(true);
      return;
    }

    setLoading(true);
    const success = await userStore.login(login, password);
    setLoading(false);

    if (!success) {
      setAlertMessage('Неудачная попытка входа. Попробуйте еще раз');
    } else {
      setAlertMessage('Успешный вход!');
    }
    setAlertModalVisible(true);
  };

return (
  <View style={styles.screen}>

    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <MemoInput placeholder="Логин" value={login} onChangeText={setLogin} />
      <MemoInput placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />

      <MemoButton title="Войти" onPress={handleLogin} loading={loading} />

      <HrefText text="Нету аккаунта?" onPress={() => navigation.navigate('SignUp')} />

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
    }
});

export default LoginScreen;