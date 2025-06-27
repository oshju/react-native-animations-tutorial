import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface User {
    // Define user interface as needed
}

export default function Domingo() {
    const [user, setUser] = useState<User | null>(null);
    const rotateValue = useRef(new Animated.Value(0)).current;

    // Interpolación explícita para la rotación
    const rotateInterpolate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        startIconAnimation();
    }, []);

    const startIconAnimation = () => {
        Animated.sequence([
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(rotateValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start(() => {
            startIconAnimation();
        });
    };

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
            >
                <Ionicons name="star" size={100} color="#FFD700" />
            </Animated.View>
            <Animated.Image
                source={require('../../assets/images/react-logo.png')}
                style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
                resizeMode="contain"
            />
            <Text style={styles.text}>Hello</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 100,
        height: 100,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'blue',
        margin: 10,
        textAlign: 'left',
        textAlignVertical: 'center',
        paddingLeft: 10,
    },
});