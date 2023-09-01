import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ImgPerfil from './ImgPerfil';
export default function FormPublicacion() {
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState('');
    const [coverPhoto, setCoverPhoto] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const handleModal = () => {
        setModal(!modal);
    };

    const handleSubmit = async () => {
        if (!description
        ) {
            Alert.alert('Error', 'Los campos de texto y URL de la foto no pueden estar vacíos.');
            return;
        }
        setIsLoading(true);
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const userId = user?.user_id;
        const nameUser = user?.name;
        const mail = user?.mail;
        const photo = user?.photo;

        const data = {
            description,
            cover_photo: coverPhoto,
            user_id: userId,
            categoria: "publicacion",
            name: nameUser,
            photo,
            mail,
        };

        const url = 'https://silk.onrender.com/publicacion';
        const token = await AsyncStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            setIsLoading(false);
            await axios.post(url, data, { headers: headers });
            console.log('Publicacion creada');



            navigation.navigate('Home');
        } catch (err) {
            console.log(err);
            setIsLoading(false); // Hide loading indicator on error
        }

    };

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
            Alert.alert(error);
        }
    };
    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (



        <View style={styles.modalContainer}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="arrowleft" size={24} color="#000" />

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        handleSubmit();
                    }}
                >



                    {isLoading ? <ActivityIndicator style={styles.loader} size="large" color="#000" /> : <Text style={styles.titleHeader}>Crear Publicacion</Text>}
                </TouchableOpacity>
            </View>

            {userData ? (
                <View style={styles.deFlexPerfil}>
                    <View style={styles.imgBorder}>
                        <Image source={{ uri: userData.photo }} style={styles.img} />
                    </View>
                    <View>
                        <Text style={styles.textName}>{userData.name}</Text>
                        <Text style={styles.dateText}>{getCurrentDate()}</Text>
                    </View>
                </View>


            ) : (
                <Image source={{ uri: 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue-thumbnail.png' }} style={styles.img} />
            )}

            <View style={styles.formModal}>
                <TextInput
                    placeholder="¿Qué estás pensando?"
                    placeholderTextColor='rgba(0, 0, 0, 0.7)'
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.inputDescripcion, { minHeight: 100, maxHeight: 200 }]}
                    multiline={true}
                    placeholderStyle={{ fontSize: 26 }} // Ajusta el tamaño de fuente aquí
                />



                <View style={styles.deFlexInputUrl}>
                    <FontAwesome name="picture-o" size={20} color="green" />
                    <TextInput
                        placeholder="URL de la foto"
                        value={coverPhoto}
                        placeholderTextColor='rgba(0, 0, 0, 0.7)'
                        onChangeText={setCoverPhoto}
                        multiline={true}
                        style={[styles.inputUrl,]}
                    />

                </View>
            </View>
        </View>



    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginTop: 10,
        paddingVertical: 20

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
        backgroundColor: '#1FC2D7',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 100,
        shadowColor: '#fff',
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
        width: 50,
        height: 50,
        objectFit: 'cover',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 2,
        padding: 10,
        margin: 2
    },
    imgBorder: {
        backgroundColor: '#1FC2D7',
        borderRadius: 100,
    },
    inputCrear: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 50,
        color: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 80
    },
    inputCrearText: {
        color: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        backgroundColor: '#f2f2f2',
        height: '100%',


    },
    header: {
        backgroundColor: '#fff',
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
        paddingTop: 60
    },
    titleHeader: {
        color: '#fff',
        fontSize: 15
    },
    textName: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 18,
        fontWeight: 'bold'
    },
    dateText: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 13,
    },
    deFlexPerfil: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 10,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        borderBottomWidth: 0.4,
    },
    inputDescripcion: {
        padding: 20,

        color: 'rgba(0, 0, 0, 0.7)',

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
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        borderBottomWidth: 0.4,
        borderTopColor: 'rgba(0, 0, 0, 0.2)',
        borderTopWidth: 0.4,

    },
    inputUrl: {
        color: 'rgba(0, 0, 0, 0.7)',
        width: '90%'
    }
})
