import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigation from './navigation/BottomTabsNavigation';
import Login from './components/Login';
import Register from './components/Register';
import fondo from './assets/fondo.png'
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  const [showRegister, setShowRegister] = useState(true);

  const toggleForm = () => {
    setShowRegister(!showRegister);
  };
  return (
    <NavigationContainer>
      <View style={styles.container}>
        {isLoggedIn ? (
          <BottomTabsNavigation setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <ImageBackground source={fondo} >


            <View style={styles.Formularios}>
              {showRegister ? <Register /> : <Login setIsLoggedIn={setIsLoggedIn} />}

              <TouchableOpacity onPress={toggleForm} style={styles.button}>
                <Text style={styles.buttonText}>{showRegister ? "Iniciar sesión" : "Registrarse"}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Formularios: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',

  },

  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
