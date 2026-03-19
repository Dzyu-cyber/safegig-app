import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Image, Dimensions, StatusBar } from 'react-native';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const textFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation sequence
        Animated.sequence([
            // Fade in and scale up the logo
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                }),
            ]),
            // Fade in the text/name
            Animated.timing(textFadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            // Small delay to let the user see it
            Animated.delay(1200),
            // Fade everything out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onFinish) onFinish();
        });
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Animated.View style={[
                styles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}>
                <Image 
                    source={require('../../assets/logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Animated.Text style={[
                    styles.appName,
                    { opacity: textFadeAnim }
                ]}>
                    SAFEGIG
                </Animated.Text>
                <Animated.Text style={[
                    styles.tagline,
                    { opacity: textFadeAnim }
                ]}>
                    Secure Your Hustle
                </Animated.Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 4,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
        letterSpacing: 2,
        textTransform: 'uppercase',
    }
});
