import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import InputSearch from '../components/InputSearch';
import { useNavigation } from '@react-navigation/native';
import AllPublicacionesPerfil from '../components/AllPublicacionesPerfil';
export default function PerfilScreen({ route }) {
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State to track loading
    const user_id = route.params.user_id;
    const token = AsyncStorage.getItem('token');
    const headers = { headers: { 'Authorization': `Bearer ${token}` } };
    const navigation = useNavigation();
    const fetchUserProfile = () => {
        fetch(`https://silk.onrender.com/users/${user_id}`, headers)
            .then(response => response.json())
            .then(data => {


                setIsLoading(false);
                setUserData(data.user); // Set loading to false after 3 seconds

            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    };
    const formatDateString = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    useEffect(() => {
        fetchUserProfile();
        const interval = setInterval(fetchUserProfile, 60000);
        return () => clearInterval(interval);
    }, [user_id]);

    // You can add a handler to update user_id when a new user is selected
    const handleUserChange = (newUserId) => {
        // Update the user_id state here
    };

    return (
        <View>
            {isLoading ? (
                <ActivityIndicator style={styles.loadingIndicator} />
            ) : (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity

                            onPress={() => navigation.navigate('Home')}
                        >
                            <AntDesign name="arrowleft" size={24} color="#000" />
                        </TouchableOpacity>

                        <InputSearch />
                    </View>
                    <ScrollView>
                        {userData.map((user, index) => (
                            <View style={styles.profileContainer} key={index}>
                                <Image source={{ uri: user.banner }} style={styles.banner} />
                                <LinearGradient colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} style={styles.gradient} />
                                <Image source={{ uri: user.photo }} style={styles.imgPerfil} />
                                <Text style={styles.textName}>{user.name}</Text>

                                <Text style={styles.textDate}>Se unió el {formatDateString(user.createdAt)}</Text>
                            </View>
                        ))}


                        <AllPublicacionesPerfil />
                    </ScrollView>
                </View>
            )}
            {/* You can add UI elements to switch between users and call handleUserChange */}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingIndicator: {
        marginTop: 200,
    },
    container: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',

        paddingTop: 50,
        height: '100%',
    },
    profileContainer: {

        alignItems: 'center',

    },
    imgPerfil: {
        width: 130,
        height: 130,
        borderRadius: 100,
        objectFit: 'cover',
        borderColor: '#fff',
        borderWidth: 3,
        marginTop: -60
    },
    banner: {
        width: '100%',
        height: 150,
        objectFit: 'cover'
    },
    textName: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold'
    },
    textDate: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 14,
        marginTop: 10,
    },
    bg: {
        width: '100%',
        height: 200,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',

    }
});
