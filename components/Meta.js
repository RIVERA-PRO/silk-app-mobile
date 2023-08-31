import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import metaImage from '../assets/META.png';

export default function Meta() {
    return (
        <View style={styles.container}>

            <View style={styles.containerMeta}>
                <Image source={metaImage} style={styles.image} />
                <Text style={styles.text}>Meta</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20
    },
    containerMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10
    },
    image: {
        width: 20,
        height: 12,
        objectFit: 'cover',

    },
    text: {
        fontSize: 17,
        color: '#fff'
    },
});
