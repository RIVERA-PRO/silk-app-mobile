import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ImgPerfil from './ImgPerfil';
export default function ButonFormPublicacion() {
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
        <View style={styles.container}>


            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('PublicacionScreen')}
            >
                {userData ? (

                    <ImgPerfil />


                ) : (
                    <Image source={{ uri: 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue-thumbnail.png' }} style={styles.img} />
                )}
                <View


                    style={styles.inputCrear}
                >
                    <Text style={styles.inputCrearText}>Crear una publicación</Text>
                </View>

                <FontAwesome name="picture-o" size={20} color="green" />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginTop: 10,
        paddingVertical: 20,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        margin: 10,
        borderRadius: 10

    },
    createButton: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    formModal: {
        // Your modal styles
    },
    submitButton: {
        backgroundColor: '#2474e1',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 100,
        shadowColor: '#f2f2f2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'

    },

    img: {
        width: 40,
        height: 40,
        borderRadius: 100,
        objectFit: 'cover'
    },
    inputCrear: {

        borderRadius: 50,
        color: '#fff',
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 80,
        backgroundColor: 'rgba(36, 116, 225,0.1)',
    },
    inputCrearText: {
        color: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        backgroundColor: '#18072B',
        height: '100%',


    },
    header: {
        backgroundColor: '#0D0628',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,


        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    titleHeader: {
        color: '#fff',
        fontSize: 15
    },
    deFlexPerfil: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 10
    },
    inputDescripcion: {
        padding: 20,

        color: '#fff'

    },
    deFlexInputUrl: {
        flexDirection: 'row',

        padding: 20,
        gap: 20,

        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 0.4,

    },
    inputUrl: {
        color: '#fff',
        width: '90%'
    }
})
