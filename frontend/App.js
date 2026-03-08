import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Use 127.0.0.1 for Web. Use 10.0.2.2 for Android Emulator. Use your local IP (e.g., 192.168.1.5) for real phone.
const API_BASE_URL = "http://127.0.0.1:8000";

const colors = {
    background: '#0F172A', // Deep dark premium blue
    card: '#1E293B',
    primary: '#3B82F6', // Trustworthy tech blue
    primaryHover: '#2563EB',
    success: '#10B981', // Green for payouts
    warning: '#F59E0B',
    danger: '#EF4444', // Red for disruptions
    text: '#F8FAFC', // White text
    textMuted: '#94A3B8', // Gray text
    border: '#334155',
};

export default function App() {
    // Current Active Screen
    const [screen, setScreen] = useState('Splash');

    // Form States
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Setup States
    const [platform, setPlatform] = useState('Zomato');
    const [zone, setZone] = useState('Hyderabad - 500081');

    // Policy State
    const [hasPolicy, setHasPolicy] = useState(false);
    const [disruptionModal, setDisruptionModal] = useState(false);

    // Backend Connection States
    const [premiumAmount, setPremiumAmount] = useState('...');
    const [dbStatus, setDbStatus] = useState('');

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;

    const handleSetupComplete = async () => {
        setScreen('Dashboard'); // Move immediately for better UI experience
        try {
            // 1. Send data to our test_db endpoint (Proving we can save to MongoDB)
            const resData = await fetch(`${API_BASE_URL}/test_db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `${platform} Rider - ${phone.substring(0, 4)}` })
            });
            const dbData = await resData.json();

            if (dbData.status === "Success") {
                setDbStatus("✅ Connected to MongoDB remotely!");
            }

            // 2. Get calculated premium from Python backend (Proving dynamic API)
            const premiumRes = await fetch(`${API_BASE_URL}/get_premium`);
            const premiumData = await premiumRes.json();

            if (premiumData.calculated_premium) {
                setPremiumAmount(premiumData.calculated_premium);
            }
        } catch (error) {
            console.log("Error contacting backend: ", error);
            setPremiumAmount(49); // Fallback mock
            setDbStatus("⚠️ Working Offline (Connection Failed)");
        }
    };

    useEffect(() => {
        if (screen === 'Splash') {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }).start();

            // Auto-transition to Login after 2.5 seconds
            setTimeout(() => {
                setScreen('Login');
            }, 2500);
        }
    }, [screen]);

    const triggerDisruption = () => {
        setDisruptionModal(true);
        Animated.spring(slideAnim, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const closeDisruption = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setDisruptionModal(false));
    };

    // --- SCREENS ---

    // 1. Splash Screen
    if (screen === 'Splash') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle="light-content" />
                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <Text style={styles.splashLogo}>🛡️ SafeGig</Text>
                    <Text style={styles.splashTagline}>Your Income, Protected.</Text>
                </Animated.View>
            </View>
        );
    }

    // 2. Login / OTP Screen
    if (screen === 'Login') {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.headerSpacer} />
                <Text style={styles.title}>Welcome to SafeGig</Text>
                <Text style={styles.subtitle}>Enter your phone number to secure your weekly earnings.</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 9876543210"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    {otpSent && (
                        <>
                            <Text style={[styles.label, { marginTop: 15 }]}>Enter 4-Digit OTP</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="----"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={4}
                            />
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => {
                            if (!otpSent) setOtpSent(true);
                            else setScreen('Setup');
                        }}
                    >
                        <Text style={styles.buttonText}>{otpSent ? "Verify & Continue" : "Send OTP"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 3. Setup Screen (One-time info collection)
    if (screen === 'Setup') {
        return (
            <View style={styles.container}>
                <View style={styles.headerSpacer} />
                <Text style={styles.title}>Quick Setup</Text>
                <Text style={styles.subtitle}>Help us customize your risk profile.</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Select Platform</Text>
                    <View style={styles.row}>
                        {['Zomato', 'Swiggy'].map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.chip, platform === p && styles.chipActive]}
                                onPress={() => setPlatform(p)}
                            >
                                <Text style={[styles.chipText, platform === p && styles.chipTextActive]}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.label, { marginTop: 25 }]}>Primary Work Zone (Pincode)</Text>
                    <TextInput
                        style={styles.input}
                        value={zone}
                        onChangeText={setZone}
                    />
                    <Text style={styles.helperText}>📍 We auto-detected Hyderabad based on your GPS.</Text>

                    <TouchableOpacity style={[styles.primaryButton, { marginTop: 30 }]} onPress={handleSetupComplete}>
                        <Text style={styles.buttonText}>Save Profile & Go to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 5. Checkout Screen
    if (screen === 'Checkout') {
        return (
            <View style={styles.container}>
                <View style={styles.headerSpacer} />
                <TouchableOpacity onPress={() => setScreen('Dashboard')} style={{ paddingBottom: 20 }}>
                    <Text style={{ color: colors.primary, fontSize: 16 }}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Confirm Coverage</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Weekly Income Protection</Text>
                    <View style={styles.divider} />

                    <View style={styles.rowBetween}>
                        <Text style={styles.textNorm}>Risk Zone</Text>
                        <Text style={styles.textBold}>{zone}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={styles.textNorm}>Covered Triggers</Text>
                        <Text style={styles.textBold}>Rain, Heat, Strikes</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={styles.textNorm}>Max Payout</Text>
                        <Text style={styles.textBold}>₹4,000 / week</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.rowBetween}>
                        <Text style={{ fontSize: 18, color: colors.text }}>Total Premium</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.success }}>₹{premiumAmount}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.primaryButton, { marginTop: 30, backgroundColor: colors.success }]}
                        onPress={() => {
                            setHasPolicy(true);
                            setScreen('Dashboard');
                        }}
                    >
                        <Text style={styles.buttonText}>Pay ₹{premiumAmount} via UPI</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 4. Dashboard (Main Hub)
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.headerSpacer} />

                {/* Header Profile */}
                <View style={styles.rowBetween}>
                    <View>
                        <Text style={styles.subtitle}>Hello, Partner</Text>
                        <Text style={styles.title}>Your Dashboard</Text>
                    </View>
                    <View style={styles.weatherBadge}>
                        <Text style={{ fontSize: 24 }}>☀️</Text>
                        <Text style={{ color: colors.text, fontWeight: 'bold' }}>38°C</Text>
                    </View>
                </View>

                {/* Offer or Status Card */}
                {!hasPolicy ? (
                    <View style={[styles.card, { borderColor: colors.primary, borderWidth: 1 }]}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.cardTitle}>AI Forecast Alert</Text>
                            <Text>⚠️</Text>
                        </View>
                        <Text style={[styles.textNorm, { marginVertical: 10 }]}>
                            High heat expected this week. Protect your income for the next 7 days in {zone}.
                        </Text>
                        {dbStatus !== '' && (
                            <Text style={[styles.textMuted, { fontSize: 12, marginBottom: 15, fontStyle: 'italic', color: dbStatus.includes('✅') ? colors.success : colors.warning }]}>
                                {dbStatus}
                            </Text>
                        )}
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.textMuted}>Premium</Text>
                                <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.success }}>₹{premiumAmount}</Text>
                            </View>
                            <TouchableOpacity style={styles.primaryButtonHalf} onPress={() => setScreen('Checkout')}>
                                <Text style={styles.buttonText}>Get Covered</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.card, { borderColor: colors.success, borderWidth: 1 }]}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.cardTitle}>Active Protection</Text>
                            <Text>✅</Text>
                        </View>
                        <Text style={[styles.textNorm, { marginVertical: 10 }]}>
                            Your income is secure. AI is monitoring live weather and disruption data in {zone}.
                        </Text>
                        <Text style={styles.textMuted}>Valid until: Next Sunday, 11:59 PM</Text>

                        <TouchableOpacity style={[styles.primaryButton, { marginTop: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.danger }]} onPress={triggerDisruption}>
                            <Text style={[styles.buttonText, { color: colors.danger }]}>Simulate Storm (Demo)</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Recent Payouts */}
                <Text style={[styles.cardTitle, { marginTop: 30, marginBottom: 15 }]}>Recent Payouts</Text>

                <View style={styles.payoutCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.textBold}>Heavy Rain Disruption</Text>
                        <Text style={styles.textMuted}>Feb 14, 2026</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.success }}>+ ₹500</Text>
                </View>

            </ScrollView>

            {/* 6. Disruption Triggered Modal (Animated Bottom Sheet) */}
            {disruptionModal && (
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.sheetHandle} />
                    <View style={{ alignItems: 'center', marginVertical: 20 }}>
                        <Text style={{ fontSize: 50 }}>🚨⛈️</Text>
                    </View>
                    <Text style={[styles.title, { textAlign: 'center', color: colors.danger }]}>Disruption Detected!</Text>
                    <Text style={[styles.textNorm, { textAlign: 'center', marginVertical: 15 }]}>
                        Severe rain recorded in {zone}. Location verified.
                    </Text>

                    <View style={styles.payoutBox}>
                        <Text style={styles.textMuted}>Automated Payout Initiated</Text>
                        <Text style={[styles.title, { color: colors.success, fontSize: 36 }]}>₹ 500.00</Text>
                        <Text style={styles.textNorm}>Sent to your UPI Wallet ends in ***42</Text>
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={closeDisruption}>
                        <Text style={styles.buttonText}>Acknowledge</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    headerSpacer: {
        height: 60,
    },
    splashLogo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    splashTagline: {
        fontSize: 18,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: 20,
        lineHeight: 24,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        color: colors.text,
        fontSize: 16,
    },
    helperText: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 8,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
    },
    primaryButtonHalf: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        color: colors.textMuted,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    weatherBadge: {
        backgroundColor: colors.card,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    textNorm: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    textBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 15,
    },
    payoutCard: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    },
    payoutBox: {
        backgroundColor: colors.background,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: colors.success,
    }
});