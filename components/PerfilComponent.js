import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, ImageBackground, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export default function PerfilComponent() {
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
        }
    };

    return (

        <>
            {userData ? (

                <TouchableOpacity
                    onPress={() => navigation.navigate('PerfilScreen', { user_id: userData.user_id })}
                    style={styles.contenedor} >




                    <View style={styles.imgBorder}>
                        <Image source={{ uri: userData.photo }} style={styles.img} />
                    </View>

                    <View style={styles.deColumn}>
                        <Text style={styles.textName}>{userData.name}</Text>
                        <Text style={styles.text}>{userData.mail.slice(0, 22)}</Text>
                    </View>


                </TouchableOpacity>

            ) : (
                <Image source={{ uri: 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue-thumbnail.png' }} style={styles.img} />
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
