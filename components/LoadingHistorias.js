import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ImgPerfil from './ImgPerfil';
export default function LoadingHistorias() {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();
    useEffect(() => {
        getUserData();
    }, []);
    const getUserData = async () => {
        try {
            const userDataJSON = await AsyncStorage.getItem('user');
            if (userDataJSON) {
                const userDataObj = JSON.parse(userDataJSON);
                setUserData(userDataObj);
            }
        } catch (error) {
            console.error('Error getting user data:', error);
            Alert.alert(error);
        }
    };
    return (
        <ScrollView horizontal={true}>
            <View style={styles.cardHistoria}>
                <Text style={styles.foto}></Text>
                <Text style={styles.text}></Text>
            </View>
            <View style={styles.cardHistoria}>
                <Text style={styles.foto}></Text>
                <Text style={styles.text}></Text>
            </View>
            <View style={styles.cardHistoria}>
                <Text style={styles.foto}></Text>
                <Text style={styles.text}></Text>
            </View>
            <View style={styles.cardHistoria}>
                <Text style={styles.foto}></Text>
                <Text style={styles.text}></Text>
            </View>
            <View style={styles.cardHistoria}>
                <Text style={styles.foto}></Text>
                <Text style={styles.text}></Text>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({

    cardHistoria: {
        borderRadius: 20,
        height: 160,
        width: 120,
        overflow: 'hidden',

        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10
    },

    text: {
        height: 20,
        width: 80,
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        borderRadius: 6,
        marginBottom: 10
    },
    foto: {
        height: 40,
        width: 40,
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        borderRadius: 100,

    },
})
