import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import spiral from '../assets/spiral.png';

export default function SpiralLoader() {
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const rotateAnimation = Animated.timing(rotateValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        });

        Animated.loop(rotateAnimation).start();
    }, []);

    const spin = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.Image
                source={spiral}
                style={[styles.spiral, { transform: [{ rotate: spin }] }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    spiral: {
        width: 30,
        height: 30,
    },
});
