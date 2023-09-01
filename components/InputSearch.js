import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import the necessary hook

export default function InputSearch() {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredPublicaciones, setFilteredPublicaciones] = useState([]);
    const navigation = useNavigation(); // Initialize the navigation
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        // Implement your fetching logic for users and publicaciones here
        // Replace the following with your actual API calls
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://silk.onrender.com/users");
                const data = await response.json();
                // Apply filtering based on the search term
                const filteredUserResults = data.users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
                setFilteredUsers(filteredUserResults);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPublicaciones = async () => {
            try {
                const response = await fetch("https://silk.onrender.com/publicacion");
                const data = await response.json();
                // Apply filtering based on the search term and description
                const filteredPublicacionResults = data.publicaciones.filter(publicacion => publicacion.description.toLowerCase().includes(searchTerm.toLowerCase()));
                setFilteredPublicaciones(filteredPublicacionResults);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
        fetchPublicaciones();
    }, [searchTerm]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openModal} style={styles.input}>
                <Text style={styles.inputText}>Buscar</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modaLHeader}>
                        <TouchableOpacity onPress={closeModal}>
                            <AntDesign name="arrowleft" size={24} color="#000" />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Buscar.."
                            placeholderTextColor='rgba(0, 0, 0, 0.6)'
                            style={[styles.inputSearch,]}
                            multiline={true}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                    </View>
                    <ScrollView>
                        {filteredUsers.concat(filteredPublicaciones).map((item) => (
                            <TouchableOpacity style={styles.resultItem} key={item._id} onPress={() => {

                                navigation.navigate('PerfilScreen', { user_id: item._id });
                                closeModal(!modalVisible)
                            }}>
                                <Image source={{ uri: item.photo }} style={styles.img} />

                                {item.name && <Text style={styles.resultText}>{item.name}</Text>}
                                {item.description && <Text style={styles.resultText}>{item.description}</Text>}

                                {item.categoria && (
                                    <Text style={item.categoria === "publicacion" ? styles.categoriaPublicacion : styles.categoriaOtra}>
                                        {item.categoria}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>


                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    input: {
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        width: '100%',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 100
    },
    inputText: {
        color: 'rgba(0, 0, 0, 0.6)',
    },
    modaLHeader: {
        flexDirection: 'row',
        backgroundColor: '#fff',

        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    inputSearch: {
        backgroundColor: '#f2f2f2',
        width: '90%',
        padding: 7,
        paddingHorizontal: 20,
        borderRadius: 100
    },
    resultItem: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 0.2,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    resultText: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold'
    },
    img: {
        width: 40,
        height: 40,
        borderRadius: 100
    },
    categoriaPublicacion: {
        color: 'rgba(0, 0, 0, 0.3)',
    },
    categoriaOtra: {
        color: 'green', // Cambia este color a tu preferencia
    },
});
