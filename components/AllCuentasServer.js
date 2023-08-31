import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Clipboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function AllCuentasServer() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setTimeout(() => {
            fetch('https://silk.onrender.com/users')
                .then(response => response.json())
                .then(data => {
                    const randomUsers = getRandomUsers(data.users, 100);
                    setUsers(randomUsers);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error al obtener los usuarios:', error);
                    setLoading(false);
                    showErrorAlert();
                });
        }, 2000); // Simular tiempo de carga de 2 segundos
    };

    const getRandomUsers = (users, count) => {
        const shuffledUsers = users.sort(() => 0.5 - Math.random());
        return shuffledUsers.slice(0, count);
    };

    const showErrorAlert = () => {
        Alert.alert(
            '¡Ops!',
            'Ha ocurrido un error en la petición',
            [
                {
                    text: 'Aceptar',
                    onPress: () => console.log('Error alert closed'),
                },
            ],
            { cancelable: false }
        );
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    const copyToClipboard = (text) => {
        Clipboard.setString(text);

    };

    return (
        <View style={styles.container}>

            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
            ) : (
                <ScrollView>
                    <Text style={styles.title}>{users.length} Usuarios registrados</Text>
                    {users.map((user, index) => (
                        <View key={index} style={styles.userContainer}>
                            <View style={styles.deFlex}>
                                <Text style={styles.textColorTitle}>Email:  <Text style={styles.textColor}>{user.mail}</Text></Text>
                                <TouchableOpacity onPress={() => copyToClipboard(user.mail)}>
                                    <AntDesign name="copy1" size={18} color='rgba(36, 116, 225,0.9)' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.deFlex}>
                                <Text style={styles.textColorTitle}>Contraseña: <Text style={styles.textColor}>{user.password}</Text></Text>
                                <TouchableOpacity onPress={() => copyToClipboard(user.password)}>
                                    <AntDesign name="copy1" size={18} color='rgba(36, 116, 225,0.9)' />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.textColorTitle}>{formatDate(user.createdAt)}</Text>
                        </View>
                    ))}

                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20

    },
    loader: {
        marginTop: 20,
    },
    userContainer: {
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        padding: 10,
        margin: 10,

        borderRadius: 10,
        flexDirection: 'column',
        gap: 7

    },
    title: {
        textAlign: 'center',
        fontSize: 17
    },
    copyButton: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 5,
        marginBottom: 10,
        textAlign: 'center',
    },
    deFlex: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textColor: {
        color: '#2474e1',
        fontSize: 15
    },
    textColorTitle: {
        color: 'rgba(0, 0, 0,0.6)',
    }

});
