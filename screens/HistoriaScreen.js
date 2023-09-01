import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import FormHistoria from '../components/FormHistoria';
export default function HistoriaScreen() {
    return (
        <View>
            <FormHistoria />
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#fff',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 200
    },

});
