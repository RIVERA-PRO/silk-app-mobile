import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function AllCuentasServer() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
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
                <ScrollView horizontal={true}>

                    {users.map((user, index) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PerfilScreen', { user_id: user._id })}
                        >
                            <View key={index} style={styles.userContainer}>


                                <Image source={{ uri: user.photo }} style={styles.img} />

                                <Text style={styles.textColorTitle}> {user.name.slice(0, 14)}</Text>

                            </View>
                        </TouchableOpacity>


                    ))}

                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#fff',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        borderRadius: 10


    },
    loader: {
        marginTop: 20,
    },
    userContainer: {



        borderRadius: 10,
        flexDirection: 'column',
        gap: 7,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#f2f2f2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#1FC2D7',
        borderWidth: 0.3,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,

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
    textColorTitle: {
        color: 'rgba(0, 0, 0,0.6)',
        fontSize: 15,
        fontWeight: 'bold'
    },

    img: {
        height: 140,
        width: 130,
        borderRadius: 10,
        objectFit: 'cover'
    },

});
