import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, ImageBackground, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilComponent() {
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
                <View style={styles.contenedor}>
                    <View style={styles.imgBorder}>
                        <Image source={{ uri: userData.photo }} style={styles.img} />
                    </View>

                    <View style={styles.deColumn}>
                        <Text style={styles.textName}>{userData.name}</Text>
                        <Text style={styles.text}>{userData.mail.slice(0, 22)}</Text>
                    </View>

                </View>
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
    imgBorder: {
        backgroundColor: '#1FC2D7',
        borderRadius: 100,
    },

    img: {
        height: 60,
        width: 60,
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 2,
        padding: 10,
        margin: 3
    },
    text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 13
    },
    textName: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 17,
        fontWeight: 'bold',
    },
    deColumn: {
        flexDirection: 'column',
        gap: 10
    }

});
