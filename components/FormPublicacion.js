import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
    return (



        <View style={styles.modalContainer}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        handleSubmit();
                    }}
                >



                    {isLoading ? <ActivityIndicator style={styles.loader} size="large" color="#fff" /> : <Text style={styles.titleHeader}>Crear Publicacion</Text>}
                </TouchableOpacity>
            </View>

            {userData ? (
                <View style={styles.deFlexPerfil}>
                    <Image source={{ uri: userData.photo }} style={styles.img} />
                    <Text style={styles.titleHeader}>{userData.name}</Text>
                </View>


            ) : (
                <Image source={{ uri: 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue-thumbnail.png' }} style={styles.img} />
            )}

            <View style={styles.formModal}>

                <TextInput
                    placeholder="¿Qué estás pensando?"
                    placeholderTextColor="#ffffff"
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.inputDescripcion, { minHeight: 200, maxHeight: 200 }]}
                    multiline={true}
                />


                <View style={styles.deFlexInputUrl}>
                    <FontAwesome name="picture-o" size={20} color="green" />
                    <TextInput
                        placeholder="URL de la foto"
                        value={coverPhoto}
                        placeholderTextColor="#ffffff"
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
        backgroundColor: '#0D0628',
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
        backgroundColor: '#2474e1',
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
        width: 40,
        height: 40,
        borderRadius: 100,
        objectFit: 'cover'
    },
    inputCrear: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 50,
        color: '#fff',
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 80
    },
    inputCrearText: {
        color: '#fff'
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
        paddingTop: 60
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
