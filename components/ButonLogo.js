import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../assets/logo.png';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import AllCuentasServer from './AllCuentasServer';

export default function ButonLogo() {
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const lastPressRef = useRef(0); // To track the last press timestamp
    const doublePressDelay = 300; // Define the maximum time between two clicks to consider it a double click (in milliseconds)

    const handlePress = () => {
        const currentTime = new Date().getTime();
        const delta = currentTime - lastPressRef.current;

        if (delta < doublePressDelay) {
            toggleModal(); // If the time between two presses is short, consider it a double click
        }

        lastPressRef.current = currentTime;
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setInputValue(''); // Reset input value when closing the modal
    };

    const handleInputChange = (text) => {
        setInputValue(text);
    };

    return (
        <View style={styles.contenedorLogo}>
            <TouchableOpacity onPress={handlePress}>
                <Image source={logo} style={styles.logoImg} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <ScrollView style={styles.modalContent}>
                    <View style={styles.deFlexHeader}>
                        <TouchableWithoutFeedback onPress={toggleModal} style={styles.modalClose}>
                            <AntDesign name="arrowleft" size={24} color="#fff" />
                        </TouchableWithoutFeedback>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese la palabra clave"
                            value={inputValue}
                            onChangeText={handleInputChange}
                        />
                    </View>

                    {inputValue === 'Admin' ? <AllCuentasServer /> : <AllCuentas />}
                </ScrollView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorLogo: {
        paddingBottom: 80,
        marginTop: -70
    },
    logoImg: {
        height: 70,
        width: 70,
    },
    input: {
        margin: 10,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255,0.9)',
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: '90%'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,

    },
    deFlexHeader: {
        backgroundColor: '#2474e1',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 8,

    },
});
