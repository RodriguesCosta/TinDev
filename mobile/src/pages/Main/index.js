import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Logo from '../../assets/logo.png'
import dislike from '../../assets/dislike.png';
import itsamatch from '../../assets/itsamatch.png';
import like from '../../assets/like.png';
import api from '../../services/api';

const style = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },

  acabou: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },

  card: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },

  logo: {
    marginTop: 30,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    }
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: "center",
    alignItems: "center",
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#fff',
    marginVertical: 30,
  },

  machName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },

  machBio: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  matchClose: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: "center",
    marginTop: 30,
    fontWeight: 'bold',
  },

})

export default function Main({ navigation }) {

  const logedUser = navigation.getParam('_id')

  const [users, setUsers] = useState([])
  const [matchDev, setMatchDev] = useState(null)

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: logedUser
        }
      })

      setUsers(response.data)
    }

    loadUsers()
  }, [logedUser])

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: {
        user: logedUser
      }
    })

    socket.on('match', dev => {
      setMatchDev(dev)
    })
  }, [logedUser])

  async function handleLike() {
    const [user, ...rest] = users
    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {
        user: logedUser
      }
    })

    setUsers(rest)
  }

  async function handleDislike() {
    const [user, ...rest] = users
    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {
        user: logedUser
      }
    })

    setUsers(rest)
  }

  async function handleLoginPage() {
    await AsyncStorage.clear()
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={style.container}>
      <TouchableOpacity onPress={handleLoginPage}>
        <Image style={style.logo} source={Logo} />
      </TouchableOpacity>

      <View style={style.cardsContainer}>
        {users.length === 0
          ? <Text style={style.acabou}>Acabou...</Text> : (
            users.map((user, index) => (
              <View key={user._id} style={[style.card, { zIndex: users.length - index }]}>
                <Image style={style.avatar} source={{ uri: user.avatar }} />
                <View style={style.footer}>
                  <Text style={style.name}>{user.name}</Text>
                  <Text numberOfLines={3} style={style.bio}>{user.bio}</Text>
                </View>
              </View>
            ))
          )}
      </View>

      {users.length > 0 && (
        <View style={style.buttonsContainer}>
          <TouchableOpacity onPress={handleDislike} style={style.button}>
            <Image source={dislike} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLike} style={style.button}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={style.matchContainer}>
          <Image style={style.matchImage} source={itsamatch} />
          <Image style={style.matchAvatar} source={{ uri: matchDev.avatar }} />

          <Text style={style.machName}>{matchDev.name}</Text>
          <Text style={style.machBio}>{matchDev.bio}</Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={style.matchClose}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}
