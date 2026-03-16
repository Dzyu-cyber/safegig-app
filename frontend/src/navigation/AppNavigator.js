import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Shield, Home, FileText, User } from 'lucide-react-native';

// Import Screens (to be created)
import OnboardingScreen from '../screens/OnboardingScreen';
import WorkerDashboardScreen from '../screens/WorkerDashboardScreen';
import PolicyManagementScreen from '../screens/PolicyManagementScreen';
import ClaimsHistoryScreen from '../screens/ClaimsHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') return <Home color={color} size={size} />;
                    if (route.name === 'Policy') return <Shield color={color} size={size} />;
                    if (route.name === 'Claims') return <FileText color={color} size={size} />;
                    if (route.name === 'Profile') return <User color={color} size={size} />;
                },
                tabBarActiveTintColor: '#0d4a25',
                tabBarInactiveTintColor: '#64748b',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                    elevation: 0,
                    shadowOpacity: 0,
                },
            })}
        >
            <Tab.Screen name="Home" component={WorkerDashboardScreen} />
            <Tab.Screen name="Claims" component={ClaimsHistoryScreen} />
            <Tab.Screen name="Policy" component={PolicyManagementScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
