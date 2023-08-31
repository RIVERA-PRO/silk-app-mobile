import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Register from './Register';
import Login from './Login';

export default function Formularios() {
    const [showRegister, setShowRegister] = useState(true);

    const toggleForm = () => {
        setShowRegister(!showRegister);
    };

    return (
        <View style={styles.Formularios}>
            {showRegister ? <Register /> : <Login />}

            <TouchableOpacity onPress={toggleForm} style={styles.button}>
                <Text style={styles.buttonText}>{showRegister ? "Iniciar sesión" : "Registrarse"}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({


});
