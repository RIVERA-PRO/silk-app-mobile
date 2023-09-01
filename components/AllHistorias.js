import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, ImageBackground, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ImageViewer from 'react-native-image-zoom-viewer';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ImgPerfil from './ImgPerfil';
import BotomFormHistoria from './BotomFormHistoria';
import LoadingHistorias from './LoadingHistorias'
export default function AllHistorias() {
    const [loading, setLoading] = useState(true);
    const [historia, setHistoria] = useState([]);
    const navigation = useNavigation();
    const [selectedDescription, setSelectedDescription] = useState(''); // Estado para la descripción en el modal
    const [selectedImage, setSelectedImage] = useState(''); // Estado para la imagen en el modal
    const [selectedName, setSelectedName] = useState('');
    const [selectedPhotoPerfil, setSelectedPhotoPerfil] = useState('');
    const [selectedUserID, setSelectedUserID] = useState('');
    const [selectedHistoriaID, setSelectedHistoriaID] = useState('');
    const [selectedUserFecha, setSelectedUserFecha] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [noHistorias, setNoHistorias] = useState(false);

    const fetchHistorias = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await axios.get('https://silk.onrender.com/historias', { headers });

            if (response.status === 200) {
                const reversedHistorias = response.data.historias.reverse();
                setHistoria(reversedHistorias);
                setLoading(false);
                setNoHistorias(reversedHistorias.length === 0); // Verifica si no hay historias
                console.log(reversedHistorias.length);
            } else {
                console.error('Error fetching historias:', response.status);
                showErrorAlert();
            }
        } catch (error) {
            console.error('Error fetching historias:', error);
            setLoading(false);
            // showErrorAlert();
        }
    };


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchHistorias();
        });

        return () => {
            unsubscribe();
        };
    }, [navigation]);

    const navigateToPerfilScreen = (user_id) => {
        navigation.navigate('PerfilScreen', { user_id });
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
    // Función para abrir el modal y mostrar la imagen al 100%
    const openImageModal = (imageURL, description, imagePerfil, name, fecha, user_ID, HistoriaID) => {
        setSelectedImage(imageURL);
        setSelectedDescription(description);
        setSelectedPhotoPerfil(imagePerfil);
        setSelectedName(name);
        setSelectedUserFecha(fecha);
        setSelectedUserID(user_ID);
        setSelectedHistoriaID(HistoriaID)
        setModalVisible(true);

    };


    // Función para cerrar el modal
    const closeImageModal = () => {
        setSelectedImage('');
        setSelectedDescription('');
        setModalVisible(false);
    };

    const deleteHistoria = async (historiaId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await axios.delete(`https://silk.onrender.com/historias/${historiaId}`, { headers });

            if (response.status === 200) {
                // Actualiza la lista de historias después de eliminar
                fetchHistorias();
            } else {
                console.error('Error al eliminar historia:', response.status);
                showErrorAlert('Error al eliminar la historia');
            }
        } catch (error) {
            console.error('Error al eliminar historia:', error);
            showErrorAlert('Error al eliminar la historia');
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
        }
    };
    return (
        <View style={styles.container}>
            {loading ? (

                <LoadingHistorias />
            ) : (

                <>

                    <ScrollView horizontal={true}>
                        <BotomFormHistoria />
                        {historia?.length === 0 ? (
                            <Text style={styles.textName}></Text>
                        ) : (historia.map((historias, index) => (
                            <>

                                <View key={index} style={styles.historiaCard}>
                                    <View style={styles.cardHistoria}>
                                        {historias.cover_photo ? (
                                            <TouchableOpacity onPress={() => openImageModal(historias.cover_photo, historias.description, historias.photo, historias.name, historias.createdAt, historias.user_id, historias._id)}>
                                                <ImageBackground source={{ uri: historias.cover_photo }} style={styles.contenedorBg}>
                                                    <LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.7)']} style={styles.bg}>
                                                        <View style={styles.imgBorder}>
                                                            <Image source={{ uri: historias.photo }} style={styles.imgPerfil} />
                                                        </View>
                                                        <View style={styles.deColumnPerfil}>
                                                            <Text style={styles.textName}>{historias.name}</Text>
                                                        </View>


                                                    </LinearGradient>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>

                                </View></>
                        ))

                        )}

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={closeImageModal}
                        >
                            <View style={styles.modalContainer}>

                                <View style={styles.deFlex}>

                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('PerfilScreen', { user_id: selectedUserID },
                                            closeImageModal())
                                        }
                                        style={styles.deFlexPerfil} >

                                        <View style={styles.imgBorderModal}>
                                            <Image source={{ uri: selectedPhotoPerfil }} style={styles.imgPerfil} />
                                        </View>
                                        <View style={styles.deColumnPerfil} >
                                            <View style={styles.deColumnPerfil}>
                                                <Text style={styles.textNamePerfil}>{selectedName}</Text>
                                            </View>
                                            <View style={styles.deColumnPerfil}>
                                                <Text style={styles.date}> {new Date(selectedUserFecha).toLocaleString()}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>



                                    {selectedUserID === userData?.user_id && (
                                        <TouchableOpacity onPress={() => (deleteHistoria(selectedHistoriaID), closeImageModal)}>
                                            <AntDesign name="delete" size={24} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={closeImageModal} >
                                        <AntDesign name="close" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                <ImageViewer
                                    imageUrls={[{ url: selectedImage }]}
                                    enableSwipeDown={true}
                                    onSwipeDown={closeImageModal}
                                    style={styles.modalImage}
                                />
                                <Text style={styles.modalDescription}>{selectedDescription}</Text>

                            </View>
                        </Modal>
                    </ScrollView>

                </>


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
    modalDescription: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        zIndex: 2,
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: '80%',
        padding: 10

    },

    textName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        paddingBottom: 15,
        paddingTop: 10
    },
    date: {
        color: '#fff',
        fontSize: 12,
    },
    textNamePerfil: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textDescription: {
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 15,
    },
    imgPerfil: {
        width: 40,
        height: 40,
        objectFit: 'cover',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 2,
        padding: 10,
        margin: 2,

    },
    imgBorderModal: {
        backgroundColor: '#1FC2D7',
        borderRadius: 100,
    },
    imgBorder: {
        backgroundColor: '#1FC2D7',
        borderRadius: 100,
        marginTop: -20
    },
    deColumnPerfil: {
        flexDirection: 'column',
    },
    deFlexPerfil: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 0.2,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    deFlex: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 0.2,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20
    },
    imgHistoria: {
        width: '100%',
        height: 340,
        objectFit: 'cover',
        borderRadius: 15,
    },
    contenedorBg: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        objectFit: 'cover',
        flexDirection: 'column',
        justifyContent: 'flex-end',

    },
    bg: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    cardHistoria: {
        borderRadius: 20,
        height: 160,
        width: 120,
        overflow: 'hidden',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo oscuro semi-transparente
    },
    modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
