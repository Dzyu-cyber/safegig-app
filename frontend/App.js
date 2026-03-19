import React, { useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    const renderContent = () => {
        if (isSplashVisible) {
            return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
        }
        return <AppNavigator />;
    };

    if (Platform.OS === 'web') {
        return (
            <View style={styles.webContainer}>
                <View style={styles.mobileFrame}>
                    {renderContent()}
                </View>
            </View>
        );
    }

    return renderContent();
}

const styles = StyleSheet.create({
    webContainer: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mobileFrame: {
        flex: 1,
        width: '100%',
        maxWidth: 400,
        maxHeight: 850,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
        overflow: 'hidden',
    }
});