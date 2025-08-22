import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { userStore } from '../stores/userStore';
import AuthStack from './authStack'
import AppStack from './appStack';
import { ActivityIndicator, View } from 'react-native';

const RootNavigation = observer(() => {
  if (userStore.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userStore.isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
});

export default RootNavigation;