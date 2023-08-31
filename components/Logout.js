import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
export default function Logout() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigation.reset({ index: 0, routes: [{ name: 'LoginForm' }] });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // This will run when the component is in focus
    //         handleLogout();
    //     });

    //     return unsubscribe;
    // }, []);

    return (
        <View>
            <TouchableOpacity onPress={handleLogout} style={styles.BtnLogou}>
                <MaterialIcons name="logout" size={24} color="#fff" />
                <Text style={styles.social}>Logout</Text>

            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    social: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    BtnLogou: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        gap: 10
    }
})