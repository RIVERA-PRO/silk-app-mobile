import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AllPublicaciones() {
    const [loading, setLoading] = useState(true);
    const [publicacion, setPublicacion] = useState([]);
    const navigation = useNavigation();
    const token = AsyncStorage.getItem('token');
    const headers = { headers: { 'Authorization': `Bearer ${token}` } };

    const fetchUsers = () => {
        fetch('https://silk.onrender.com/publicacion', headers)
            .then(response => response.json())
            .then(data => {
                // Invertir el orden de las publicaciones
                const reversedPublicaciones = data.publicaciones.reverse();
                setPublicacion(reversedPublicaciones);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
                setLoading(false);
                showErrorAlert();
            });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUsers();
        });

        // Al salir de la pantalla, limpiamos el listener
        return () => {
            unsubscribe();
        };
    }, [navigation]);

    const navigateToPerfilScreen = (user_id) => {

        navigation.navigate('PerfilScreen', { user_id });
        console.log(user_id)
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

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
            ) : (
                <ScrollView>
                    {publicacion.map((publicaciones, index) => (
                        <View key={index} style={styles.publicacionCard}>
                            <TouchableOpacity onPress={() => navigateToPerfilScreen(publicaciones.user_id)}>
                                <View style={styles.deFlexPerfil}>
                                    <Image source={{ uri: publicaciones.photo }} style={styles.imgPerfil} />
                                    <View style={styles.deColumnPerfil}>
                                        <Text style={styles.textName}>{publicaciones.name}</Text>
                                        <Text style={styles.date}>
                                            {new Date(publicaciones.createdAt).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.textDescription}>{publicaciones.description}</Text>
                            {publicaciones.cover_photo ? (
                                <Image source={{ uri: publicaciones.cover_photo }} style={styles.img} />
                            ) : null}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {


    },
    loader: {
        marginTop: 20,
    },
    publicacionCard: {
        backgroundColor: '#0D0628',

        marginTop: 10,


        flexDirection: 'column',
        gap: 7,
        paddingVertical: 10,


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
    textName: {
        color: '#fff',
        fontSize: 15
    },
    date: {
        color: '#fff',
        fontSize: 12
    },
    textDescription: {

        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    img: {
        width: '100%',
        height: 400,
        objectFit: 'cover',
        borderRadius: 20,


    },
    imgPerfil: {
        width: 40,
        height: 40,
        objectFit: 'cover',
        borderRadius: 100
    },
    deColumnPerfil: {

    },
    deFlexPerfil: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        padding: 10
    }

});
