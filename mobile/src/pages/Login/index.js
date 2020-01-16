import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Logo from '../../assets/logo.png'
import api from '../../services/api';

const style = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#DF4723',
    borderRadius: 4,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

})

export default function Login({ navigation }) {
  const [username, setUsername] = useState('')

  useEffect(() => {
    AsyncStorage.getItem('userid').then(_id => {
      if (_id) {
        navigation.navigate('Main', { _id })
      }
    })
  }, [])

  async function handleLogin() {
    const response = await api.post('/devs', {
      username,
    })

    const { _id } = response.data

    await AsyncStorage.setItem('userid', _id)

    navigation.navigate('Main', { _id })
  }

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior="padding"
      enabled={Platform.OS === 'ios'}
    >
      <Image source={Logo} />

      <TextInput
        style={style.input}
        placeholder="Digite seu usuário do GitHub"
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setUsername}
      />

      <TouchableOpacity onPress={handleLogin} style={style.button}>
        <Text style={style.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
