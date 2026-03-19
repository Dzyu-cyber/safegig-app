import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, StatusBar, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CircleCheck, Shield, MapPin, Droplets, Thermometer, Wind, ArrowRight } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { API_BASE_URL } from '../utils/Constants';

export default function OnboardingScreen({ navigation }) {
    const [step, setStep] = useState(1);

    // Form States
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [platform, setPlatform] = useState('Zomato');
    const [city, setCity] = useState('Bengaluru');
    const [selectedPlan, setSelectedPlan] = useState('Standard');

    // Loading State
    const [isLoading, setIsLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const otpRefs = useRef([]);

    const nextStep = async () => {
        setIsLoading(true);
        try {
            if (step === 1) {
                // Mocking OTP Verification success
                // In Phase 2: Insert Firebase Auth call here
                console.log("OTP verified for", phone);
                setStep(2);
            } else if (step === 2) {
                // Save Profile (Mock Mode for Vercel Demo)
                await new Promise(r => setTimeout(r, 800));
                setStep(3);
            } else if (step === 3) {
                // Fetch dynamic premium (Mock Mode)
                await new Promise(r => setTimeout(r, 600));
                setStep(4);
            } else if (step === 4) {
                // Purchase policy (Mock Mode)
                await new Promise(r => setTimeout(r, 1000));
                setStep(5);
            } else if (step === 5) {
                // On success, go to dashboard
                navigation.replace('MainTabs');
            }
        } catch (error) {
            console.error("API Error in Onboarding:", error);
            // Fallback for demo
            if (step < 5) setStep(step + 1);
            else navigation.replace('MainTabs');
        } finally {
            setIsLoading(false);
            // Animate transition
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true })
            ]).start();
        }
    };

    const prevStep = () => {
        if (step > 1 && step < 5) setStep(step - 1);
        // Step 5 is success, no going back
    };

    // Header component
    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={prevStep} style={styles.iconButton} disabled={step === 5 || step === 1}>
                {(step > 1 && step < 5) && <ArrowLeft color={theme.colors.textDark} size={24} />}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complete Registration</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    // Progress bar
    const ProgressBar = () => (
        <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((s) => (
                <View key={s} style={[styles.progressItem, { backgroundColor: step >= s ? theme.colors.primary : theme.colors.primaryLight + '20' }]} />
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f6f8f7" />
            <Header />
            {step < 5 && <ProgressBar />}

            <Animated.ScrollView contentContainerStyle={styles.scrollContent} style={{ opacity: fadeAnim }}>

                {/* STEP 1: PHONE & OTP */}
                {step === 1 && (
                    <View style={styles.section}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={styles.title}>Welcome to SafeGig</Text>
                            <Text style={styles.subtitle}>Protecting India's gig economy workers against climate risks.</Text>
                        </View>

                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.phoneInputContainer}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryCodeText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Enter mobile number"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        {phone.length >= 10 && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.label}>OTP Verification</Text>
                                <View style={styles.otpContainer}>
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <TextInput
                                            key={index}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            style={styles.otpInput}
                                            maxLength={1}
                                            keyboardType="number-pad"
                                            value={otp[index]}
                                            onChangeText={(val) => {
                                                const newOtp = [...otp];
                                                newOtp[index] = val;
                                                setOtp(newOtp);
                                                // Auto-focus move logic
                                                if (val.length === 1 && index < 5) {
                                                    otpRefs.current[index + 1].focus();
                                                }
                                            }}
                                            onKeyPress={({ nativeEvent }) => {
                                                if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                                                    otpRefs.current[index - 1].focus();
                                                }
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* STEP 2: PROFILE DETAILS */}
                {step === 2 && (
                    <View style={styles.section}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Partner Details</Text>
                            <Text style={styles.subtitle}>We use this to verify your gig work status.</Text>
                        </View>

                        <Text style={styles.label}>Gig Platform</Text>
                        <View style={styles.row}>
                            {['Zomato', 'Swiggy', 'Zepto'].map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.chip, platform === p && styles.chipActive]}
                                    onPress={() => setPlatform(p)}
                                >
                                    <Text style={[styles.chipText, platform === p && styles.chipTextActive]}>{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { marginTop: 20 }]}>Full Name</Text>
                        <TextInput style={styles.input} placeholder="As per Aadhaar" />

                        <Text style={[styles.label, { marginTop: 20 }]}>UPI ID for Payouts</Text>
                        <TextInput style={styles.input} placeholder="username@upi" />
                    </View>
                )}

                {/* STEP 3: WORK ZONE */}
                {step === 3 && (
                    <View style={styles.section}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Work Location</Text>
                            <Text style={styles.subtitle}>Select your primary delivery zone.</Text>
                        </View>

                        <Text style={styles.label}>City</Text>
                        <View style={styles.row}>
                            {['Bengaluru', 'Mumbai', 'Delhi NCR'].map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.chip, city === c && styles.chipActive]}
                                    onPress={() => setCity(c)}
                                >
                                    <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.mapMock}>
                            <MapPin size={32} color={theme.colors.primary} style={{ marginBottom: 10 }} />
                            <Text style={{ fontWeight: 'bold' }}>{city} Zone</Text>
                        </View>

                        <View style={styles.riskGrid}>
                            <View style={[styles.riskCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                                <Droplets color="#2563eb" size={24} style={{ marginBottom: 5 }} />
                                <Text style={[styles.riskLabel, { color: '#2563eb' }]}>FLOOD</Text>
                                <Text style={styles.riskValue}>Medium</Text>
                            </View>
                            <View style={[styles.riskCard, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                                <Thermometer color="#ea580c" size={24} style={{ marginBottom: 5 }} />
                                <Text style={[styles.riskLabel, { color: '#ea580c' }]}>HEAT</Text>
                                <Text style={styles.riskValue}>High</Text>
                            </View>
                            <View style={[styles.riskCard, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
                                <Wind color="#475569" size={24} style={{ marginBottom: 5 }} />
                                <Text style={[styles.riskLabel, { color: '#475569' }]}>AQI</Text>
                                <Text style={styles.riskValue}>142</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* STEP 4: PLAN SELECTION */}
                {step === 4 && (
                    <View style={styles.section}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Choose Protection Plan</Text>
                            <Text style={styles.subtitle}>Pick the shield that fits your risk.</Text>
                        </View>

                        {/* Essential Plan */}
                        <TouchableOpacity style={[styles.planCard, selectedPlan === 'Essential' && styles.planCardActive]} onPress={() => setSelectedPlan('Essential')}>
                            <View style={[styles.planIcon, { backgroundColor: '#22c55e' }]}>
                                <Text style={styles.planIconText}>B</Text>
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 15 }}>
                                <Text style={styles.planTitle}>Basic Shield</Text>
                                <Text style={styles.planSubtitle}>Rainfall & Extreme Heat</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[styles.planPrice, { color: theme.colors.primary }]}>₹49</Text>
                                <Text style={styles.planPeriod}>/week</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Standard Plan (Recommended) */}
                        <TouchableOpacity style={[styles.planCard, styles.planCardRecommended, selectedPlan === 'Standard' && styles.planCardActive]} onPress={() => setSelectedPlan('Standard')}>
                            <View style={styles.recommendedBadge}>
                                <Text style={styles.recommendedText}>Recommended</Text>
                            </View>
                            <View style={[styles.planIcon, { backgroundColor: '#f97316' }]}>
                                <Text style={styles.planIconText}>S</Text>
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 15 }}>
                                <Text style={styles.planTitle}>Standard Shield</Text>
                                <Text style={styles.planSubtitle}>Basic + Pollution & Strikes</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[styles.planPrice, { color: '#f97316' }]}>₹89</Text>
                                <Text style={styles.planPeriod}>/week</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Max Plan */}
                        <TouchableOpacity style={[styles.planCard, selectedPlan === 'Max' && styles.planCardActive]} onPress={() => setSelectedPlan('Max')}>
                            <View style={[styles.planIcon, { backgroundColor: '#ef4444' }]}>
                                <Text style={styles.planIconText}>M</Text>
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 15 }}>
                                <Text style={styles.planTitle}>Max Shield</Text>
                                <Text style={styles.planSubtitle}>Standard + App & Natural Disasters</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[styles.planPrice, { color: '#ef4444' }]}>₹149</Text>
                                <Text style={styles.planPeriod}>/week</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 5: SUCCESS & POLICY */}
                {step === 5 && (
                    <View style={styles.section}>
                        <View style={styles.successCard}>
                            <View style={styles.successHeader}>
                                <View>
                                    <Text style={styles.successStatus}>POLICY ACTIVE</Text>
                                    <Text style={styles.successTitle}>SafeGig {selectedPlan}</Text>
                                </View>
                                <Shield color="#ffffff" size={40} opacity={0.5} />
                            </View>

                            <View style={styles.successDetails}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: `rgba(255,255,255,0.2)`, paddingBottom: 10, marginBottom: 15 }}>
                                    <Text style={{ color: `rgba(255,255,255,0.8)`, fontSize: 12 }}>Policy Number</Text>
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' }}>GS-BLR-2026-00421</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={{ color: `rgba(255,255,255,0.8)`, fontSize: 10, marginBottom: 4 }}>Holder</Text>
                                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Rahul S.</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: `rgba(255,255,255,0.8)`, fontSize: 10, marginBottom: 4 }}>Platform</Text>
                                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{platform}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.successFooter}>
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Valid through Mar 2026</Text>
                            </View>
                        </View>

                        <View style={styles.successMessage}>
                            <CircleCheck color={theme.colors.success} size={24} />
                            <Text style={styles.successMessageText}>Policy successfully activated! Check your WhatsApp for details.</Text>
                        </View>
                    </View>
                )}
            </Animated.ScrollView>

            {/* Bottom Sticky Button */}
            <View style={styles.footerCTA}>
                <TouchableOpacity style={styles.primaryButton} onPress={nextStep} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>
                                {step === 1 ? 'Verify Phone' : step === 4 ? `Pay & Activate` : step === 5 ? 'Go to Dashboard' : 'Continue'}
                            </Text>
                            {step < 5 && <ArrowRight color="#fff" size={20} style={{ marginLeft: 8 }} />}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.m, backgroundColor: 'rgba(255,255,255,0.8)' },
    iconButton: { padding: 8, borderRadius: theme.borderRadius.full, width: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark },
    progressContainer: { flexDirection: 'row', paddingHorizontal: theme.spacing.m, paddingVertical: theme.spacing.m, gap: theme.spacing.s },
    progressItem: { flex: 1, height: 8, borderRadius: theme.borderRadius.full },
    scrollContent: { paddingHorizontal: theme.spacing.m, paddingBottom: 100 },
    section: { marginTop: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 8 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textDark, marginBottom: 4 },
    subtitle: { fontSize: 16, color: theme.colors.textMuted },
    label: { fontSize: 14, fontWeight: '600', color: theme.colors.textDark, marginBottom: 8 },

    // Form Inputs
    input: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.m, padding: theme.spacing.m, fontSize: 16, color: theme.colors.textDark },
    phoneInputContainer: { flexDirection: 'row', gap: 8 },
    countryCode: { backgroundColor: theme.colors.primary + '10', borderWidth: 1, borderColor: theme.colors.primary + '30', borderRadius: theme.borderRadius.m, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
    countryCodeText: { fontWeight: 'bold', color: theme.colors.textDark },
    phoneInput: { flex: 1, backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.m, padding: theme.spacing.m, fontSize: 16 },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
    otpInput: { width: 45, height: 50, backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.m, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },

    // Chips & Grids
    row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    chip: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.m, paddingVertical: 12, paddingHorizontal: 20 },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.textDark, fontWeight: '600' },
    chipTextActive: { color: theme.colors.white },

    mapMock: { height: 160, borderRadius: theme.borderRadius.m, backgroundColor: theme.colors.primary + '10', borderWidth: 1, borderColor: theme.colors.primary + '30', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    riskGrid: { flexDirection: 'row', gap: 10 },
    riskCard: { flex: 1, padding: 12, borderRadius: theme.borderRadius.m, borderWidth: 1, alignItems: 'center' },
    riskLabel: { fontSize: 10, fontWeight: 'bold' },
    riskValue: { fontSize: 14, fontWeight: 'bold', marginTop: 4, color: theme.colors.textDark },

    // Plan Selection
    planCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f0fdf4', borderWidth: 2, borderColor: '#4ade8030', borderRadius: theme.borderRadius.l, marginBottom: 15 },
    planCardActive: { borderColor: theme.colors.primary, backgroundColor: '#e2e8f0' },
    planCardRecommended: { backgroundColor: theme.colors.white, borderColor: '#f97316', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    planIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    planIconText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 20 },
    planTitle: { fontWeight: 'bold', fontSize: 16, color: theme.colors.textDark },
    planSubtitle: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
    planPrice: { fontSize: 20, fontWeight: 'bold' },
    planPeriod: { fontSize: 10, color: theme.colors.textMuted },
    recommendedBadge: { position: 'absolute', top: -12, left: '50%', transform: [{ translateX: -40 }], backgroundColor: '#f97316', paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.borderRadius.full },
    recommendedText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

    // Success State
    successCard: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl, padding: 24, marginTop: 40, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
    successHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    successStatus: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', letterSpacing: 1 },
    successTitle: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginTop: 4 },
    successDetails: { marginTop: 10 },
    successFooter: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    successMessage: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '10', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.m, padding: 16, marginTop: 20, gap: 12 },
    successMessageText: { flex: 1, fontSize: 14, color: theme.colors.textDark },

    // Sticky Bottom Button
    footerCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: theme.spacing.m, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: theme.colors.border },
    primaryButton: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.m, padding: 18, alignItems: 'center' },
    buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold' }
});
