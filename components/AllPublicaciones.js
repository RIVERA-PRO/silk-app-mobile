import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@react-navigation/elements';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import LoadingPublicacines from './LoadingPublicacines';
export default function AllPublicaciones() {
    const [loading, setLoading] = useState(true);
    const [publicacion, setPublicacion] = useState([]);
    const navigation = useNavigation();
    const token = AsyncStorage.getItem('token');
    const headers = { headers: { 'Authorization': `Bearer ${token}` } };
    const [comments, setComments] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComments, setSelectedComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [likes, setLikes] = useState({});

    const fetchUsers = () => {
        fetch('https://silk.onrender.com/publicacion', headers)
            .then(response => response.json())
            .then(data => {
                // Invertir el orden de las publicaciones
                const reversedPublicaciones = data.publicaciones.reverse();
                setPublicacion(reversedPublicaciones);
                // Fetch comments and likes for each publication
                const fetchDataPromises = reversedPublicaciones.map(pub => (
                    Promise.all([
                        fetch(`https://silk.onrender.com/comments?chapter_id=${pub._id}`, headers)
                            .then(response => response.json()),
                        fetch(`https://silk.onrender.com/likes?chapter_id=${pub._id}`, headers)
                            .then(response => response.json())
                    ])
                        .then(([commentsResponse, likesResponse]) => {
                            const publicationId = pub._id;
                            const comments = commentsResponse.comments.filter(comment => comment.publicacion_id === publicationId);
                            const likes = likesResponse.likes.filter(like => like.publicacion_id === publicationId);
                            return { publicationId, comments, likes };
                        })
                ));

                Promise.all(fetchDataPromises)
                    .then(dataArray => {
                        const commentsMap = {};
                        const likesMap = {};
                        dataArray.forEach(({ publicationId, comments, likes }) => {
                            commentsMap[publicationId] = comments;
                            likesMap[publicationId] = likes;
                        });
                        setComments(commentsMap);
                        setLikes(likesMap);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
                setLoading(false);
                // showErrorAlert();
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



    const addCommentToPublication = async (publicationId, commentText) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const comment = {
                text: commentText,

            };
            setSelectedComments(prevComments => [...prevComments, comment]);
            const response = await fetch(`https://silk.onrender.com/comments?id=${publicationId}`, { // Remove the query parameter
                method: 'POST',
                headers,
                body: JSON.stringify(comment),
            });
            if (!response.ok) {
                console.error('Error creating comment:', response.status, response.statusText);
                return;
            }
            const data = await response.json();
            console.log('Comment created:', data);
            setCommentInput('');
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };



    const deleteComment = async (commentId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(`https://silk.onrender.com/comments/${commentId}`, {
                method: 'DELETE',
                headers: headers,
            });

            if (!response.ok) {
                console.error('Error deleting comment:', response.status, response.statusText);
                return;
            }


            setComments(prevComments => ({
                ...prevComments,
                [selectedPublication._id]: prevComments[selectedPublication._id].filter(comment =>
                    comment._id !== commentId
                ),
            }));
            setModalVisible(false);
        } catch (error) {
            console.error('Error during delete:', error);
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

    const addLikeToPublication = async (publicationId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Check if the user has already liked the publication
            const existingLikes = likes[publicationId] || [];
            const userHasLiked = existingLikes.some(like => like.user_id._id === userData?.user_id);

            if (userHasLiked) {
                // User has already liked the publication, send a DELETE request to remove the like
                const response = await fetch(`https://silk.onrender.com/likes/${publicationId}`, {
                    method: 'DELETE',
                    headers,
                });

                if (!response.ok) {
                    console.error('Error deleting like:', response.status, response.statusText);
                    return;
                }

                // Remove the like from the likes state
                setLikes(prevLikes => ({
                    ...prevLikes,
                    [publicationId]: existingLikes.filter(like => like.user_id !== userData?.user_id),
                }));
            } else {
                // User hasn't liked the publication, send a POST request to add the like
                const like = {
                    like: 1, // Set the like property to 1 to indicate a like
                };

                const response = await fetch(`https://silk.onrender.com/likes?id=${publicationId}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(like),
                });

                if (!response.ok) {
                    console.error('Error creating like:', response.status, response.statusText);
                    return;
                }

                // Update the likes state with the new like
                setLikes(prevLikes => ({
                    ...prevLikes,
                    [publicationId]: [...existingLikes, like],
                }));
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    const deletePublication = async (publicationId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await axios.delete(`https://silk.onrender.com/publicacion/${publicationId}`, {
                headers: headers,
            });

            if (response.status !== 200) {
                console.error('Error deleting publication:', response.status);
                return;
            }

            // Actualizar el estado local para reflejar la eliminación
            setPublicacion(prevPublicaciones => prevPublicaciones.filter(pub => pub._id !== publicationId));
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };
    return (
        <View style={styles.container}>
            {loading ? (
                <LoadingPublicacines />
            ) : (
                <ScrollView>

                    {publicacion.map((publicaciones, index) => (
                        <View key={index} style={styles.publicacionCard}>
                            <TouchableOpacity onPress={() => navigateToPerfilScreen(publicaciones.user_id)}>
                                <View style={styles.deFlexPerfil}>
                                    <View style={styles.deFlexPerfil2}>
                                        <View style={styles.imgBorder}>
                                            <Image source={{ uri: publicaciones.photo }} style={styles.imgPerfil} />
                                        </View>

                                        <View style={styles.deColumnPerfil}>
                                            <Text style={styles.textName}>{publicaciones.name.slice(0, 20)}</Text>
                                            <Text style={styles.date}>
                                                {new Date(publicaciones.createdAt).toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                    {publicaciones?.user_id === userData?.user_id && (
                                        <TouchableOpacity onPress={() => deletePublication(publicaciones._id)}>
                                            <AntDesign name="close" size={18} color="black" />
                                        </TouchableOpacity>
                                    )}
                                </View>


                            </TouchableOpacity>
                            <Text style={styles.textDescription}>{publicaciones.description}</Text>
                            {publicaciones.cover_photo ? (
                                <Image source={{ uri: publicaciones.cover_photo }} style={styles.imgPublicacion} />
                            ) : null}

                            <View style={styles.deFlexComentLike}>
                                <TouchableOpacity
                                    onPress={() => {
                                        addLikeToPublication(publicaciones._id); // Call the function to add/remove a like
                                    }}
                                    style={styles.commentIconBtn}
                                >
                                    <Ionicons name="heart-outline" size={24} color="#1E0C46" />
                                    <Text style={styles.cantidad}>
                                        {likes[publicaciones._id]?.length || 0} {/* Display the like count */}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedPublication(publicaciones);
                                        setSelectedComments(comments[publicaciones._id] || []); // Update the selected comments based on publication's _id
                                        setModalVisible(true);
                                    }}
                                    style={styles.commentIconBtn}
                                >


                                    <FontAwesome name="commenting" size={24} color="#1E0C46" />
                                    <Text style={styles.cantidad}>
                                        {comments[publicaciones._id]?.length || 0} {/* Update the comment count */}
                                    </Text>
                                </TouchableOpacity>


                            </View>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.closeButtonText}>X</Text>
                                    </TouchableOpacity>

                                    <ScrollView style={styles.comentariosContain}>
                                        {selectedComments.map((comment, commentIndex) => (
                                            <View key={commentIndex} style={styles.commentContainer}>
                                                <View style={styles.deFlexPerfilComment}>
                                                    <TouchableOpacity onPress={() => {

                                                        navigation.navigate('PerfilScreen', { user_id: comment.user_id._id });

                                                    }}>
                                                        <Image source={{ uri: comment.user_id?.photo }} style={styles.img} />
                                                    </TouchableOpacity>

                                                    <View style={styles.comment}>

                                                        <View style={styles.deFlexNameDelete}>
                                                            <View>

                                                                {comment.user_id?.name ? (
                                                                    <Text style={styles.textName}>{comment.user_id?.name}</Text>
                                                                ) : null}

                                                            </View>
                                                            {comment.user_id?._id === userData?.user_id && (
                                                                <TouchableOpacity onPress={() => deleteComment(comment._id)}>
                                                                    <MaterialIcons name="delete" size={18} color="#18072B" />
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                        {comment.createdAt ? (
                                                            <Text style={styles.date}> {new Date(comment?.createdAt).toLocaleString()}</Text>
                                                        ) : null}
                                                        <Text style={styles.comentarioText}>{comment.text}</Text>
                                                    </View>

                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>

                                    <View style={styles.deFlexInputCreate}>
                                        <TextInput
                                            style={styles.commentInput}
                                            placeholder="Comentar..."
                                            value={commentInput}
                                            onChangeText={text => setCommentInput(text)}
                                        />
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => {
                                                if (selectedPublication) {
                                                    addCommentToPublication(selectedPublication._id, commentInput);
                                                    setCommentInput('');
                                                }
                                            }}
                                        >
                                            <Ionicons name="ios-send-sharp" size={27} color="#18072B" />
                                        </TouchableOpacity>
                                    </View>


                                </View>
                            </Modal>

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
        backgroundColor: '#fff',
        marginTop: 10,
        flexDirection: 'column',
        gap: 7,
        paddingVertical: 10,
        padding: 10,
        margin: 10,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        borderRadius: 15

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
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 15,
        fontWeight: 'bold'
    },
    date: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 12
    },
    textDescription: {

        color: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 15
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
    deColumnPerfil: {

    },
    deFlexPerfil: {
        flexDirection: 'row',

        paddingVertical: 10,
        borderBottomWidth: 0.2,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'space-between',

    },
    deFlexPerfil2: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        borderRadius: 30,
        paddingRight: 15,
        shadowColor: '#f2f2f2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        height: 43
    },
    imgPublicacion: {
        width: '100%',
        height: 340,
        objectFit: 'cover',
        borderRadius: 15,


    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',

        borderTopRightRadius: 20,
        borderTopLeftRadius: 20

    },
    commentContainer: {
        borderRadius: 8,

    },
    commentText: {
        color: '#000',
    },
    closeButton: {

        padding: 20,
        borderRadius: 8,
        borderColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20


    },
    closeButtonText: {
        color: '#000',
        textAlign: 'right',
        fontWeight: 'bold'
    },

    commentInput: {
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        width: '86%',
        padding: 6,

    },
    addButton: {

        padding: 10,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#000',
        textAlign: 'center',
    },
    deFlexInputCreate: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        borderColor: '#f2f2f2',
        borderTopWidth: 1,


    },

    img: {
        height: 35,
        width: 35,
        borderRadius: 100,
        objectFit: 'cover'
    },
    deFlexPerfilComment: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,

    },
    comment: {
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        padding: 10,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

    },
    comentarioText: {
        color: 'rgba(0, 0, 0, 0.7)',

        paddingVertical: 10,
        fontSize: 15

    },
    deFlexNameDelete: {
        flexDirection: 'row',
        gap: 6,

        justifyContent: 'space-between'
    },
    commentIconBtn: {

        flexDirection: 'row',
        justifyContent: 'center',
        padding: 7,
        borderRadius: 7,
        alignItems: 'center',
        gap: 5
    },
    cantidad: {
        color: '#1E0C46'
    },
    comentariosContain: {
        padding: 10
    },
    deFlexComentLike: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderTopColor: 'rgba(0, 0, 0, 0.2)',
        borderTopWidth: 0.2
    }

});
