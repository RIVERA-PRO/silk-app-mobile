import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, ImageBackground, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ImgPerfil() {
    const [userData, setUserData] = useState(null);

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
        }
    };

    return (

        <>
            {userData ? (

                <Image source={{ uri: userData.photo }} style={styles.img} />



            ) : (
                <Text>Loading user data...</Text>
            )}
        </>

    );
}


const styles = StyleSheet.create({
    contenedor: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
        gap: 10
    },

    img: {
        height: 35,
        width: 35,
        borderRadius: 100,
        objectFit: 'cover'
    },
    text: {
        color: "#ffff",
        fontSize: 13
    },
    textName: {
        color: "#ffff",
        fontSize: 17,
        fontWeight: 'bold',
    },
    deColumn: {
        flexDirection: 'column',
        gap: 10
    }

});
