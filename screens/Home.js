import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import fondo from '../assets/fondo.png'
import { FontAwesome } from '@expo/vector-icons';
import ButonLogo from '../components/ButonLogo';
import { MaterialIcons } from '@expo/vector-icons';
import Formularios from '../components/Formularios';
import Logout from '../components/Logout';
import FormPublicacion from '../components/FormPublicacion';
import AllPublicaciones from '../components/AllPublicaciones';
import AllCuentasServer from '../components/AllCuentasServer';
import HeaderBlanco from '../components/HeaderBlanco';
import ButonFormPublicacion from '../components/ButonFormPublicacion';
import AllHistorias from '../components/AllHistorias'
const windowWidth = Dimensions.get('window').width;

export default function Home() {
    const navigation = useNavigation();


    return (

        <View>
            <HeaderBlanco />
            <ScrollView>
                <ImageBackground style={styles.contenedor}>
                    <AllHistorias />

                    {/* <AllCuentasServer /> */}

                    <ButonFormPublicacion />
                    <AllPublicaciones />

                </ImageBackground>
                <View style={styles.espacio}>

                </View>
            </ScrollView>
        </View>




    );

}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: 'rgba(36, 116, 225,0.1)',
    },
    espacio: {
        height: 200,
        backgroundColor: 'rgba(36, 116, 225,0.1)',
    },


});
