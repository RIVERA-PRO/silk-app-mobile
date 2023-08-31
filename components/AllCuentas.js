import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Clipboard } from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
export default function AllCuentas() {
    const [userRecords, setUserRecords] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const storedRecords = await AsyncStorage.getItem('userData');
            if (storedRecords) {
                const parsedRecords = JSON.parse(storedRecords);
                setUserRecords(parsedRecords);
            }
        } catch (error) {
            console.error('Error fetching user records:', error);
        }
    };

    const deleteAllRecords = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            setUserRecords([]);
        } catch (error) {
            console.error('Error deleting all records:', error);
        }
    };

    const deleteRecord = async (index) => {
        try {
            const updatedRecords = userRecords.filter((_, i) => i !== index);
            await AsyncStorage.setItem('userData', JSON.stringify(updatedRecords));
            setUserRecords(updatedRecords);
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };
    const copyToClipboard = (content) => {
        Clipboard.setString(content);
    };
    return (
        <View>
            <TouchableOpacity style={styles.deleteButtonAll} onPress={deleteAllRecords}>
                <Text style={styles.textDelete}>Borrar todos</Text>
                <MaterialIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
            <ScrollView>
                {userRecords.map((record, index) => (
                    <View key={index} style={styles.recordContainer}>
                        <View style={styles.deColum}>
                            <View style={styles.deFlex}>

                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={() => copyToClipboard(record.mail)}
                                >
                                    <Text style={styles.textColorTitle}>Email:  <Text style={styles.textColor}>{record.mail}</Text></Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.deFlex}>


                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={() => copyToClipboard(record.password)}
                                >
                                    <Text style={styles.textColorTitle}>Contraseña: <Text style={styles.textColor}>{record.password}</Text> </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => deleteRecord(index)} style={styles.deleteButton}>
                            <MaterialIcons name="delete" size={24} color="#2474e1" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    deleteButtonAll: {
        backgroundColor: '#2474e1',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
        padding: 8,
        borderRadius: 10,
    },
    deleteButton: {

        padding: 8,
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
        paddingTop: 20
    },
    recordContainer: {
        backgroundColor: 'rgba(36, 116, 225,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textDelete: {
        color: '#fff',

    },
    deFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    deColum: {
        flexDirection: 'column',
        gap: 10
    },
    textColor: {
        color: '#2474e1',
    },
    textColorTitle: {
        color: 'rgba(0, 0, 0,0.6)',
    }

});
