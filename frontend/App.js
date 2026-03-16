import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    if (isSplashVisible) {
        return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
    }

    return <AppNavigator />;
}