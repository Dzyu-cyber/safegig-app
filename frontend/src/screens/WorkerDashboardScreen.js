import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, User, ShieldCheck, Thermometer, Droplets, Wind, CircleAlert } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { API_BASE_URL } from '../utils/Constants';

export default function WorkerDashboardScreen() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_premium/560001`);
                const data = await response.json();
                setWeather(data.weather_data);
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
        // Poll every minute
        const interval = setInterval(fetchWeather, 60000);
        return () => clearInterval(interval);
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.menuIcon}>
                    <Menu color={theme.colors.primary} size={24} />
                </View>
                <Text style={styles.headerTitle}>Worker Dashboard</Text>
                <View style={styles.profileIcon}>
                    <User color="#fff" size={20} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Coverage Status Card */}
                <View style={styles.coverageCard}>
                    <ShieldCheck color="rgba(255,255,255,0.2)" size={120} style={{ position: 'absolute', right: -20, top: -20 }} />
                    <View style={{ zIndex: 10 }}>
                        <Text style={styles.coverageLabel}>Active Coverage</Text>
                        <Text style={styles.coverageId}>Policy GS-BLR-2026</Text>
                        <View style={styles.statusRow}>
                            <View style={styles.statusBadgeWarning}>
                                <View style={styles.pulseDot} />
                                <Text style={styles.statusBadgeWarningText}>AMBER STATUS</Text>
                            </View>
                            <View style={styles.statusBadgeActive}>
                                <Text style={styles.statusBadgeActiveText}>ACTIVE</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Red Alert Banner */}
                <View style={styles.alertBanner}>
                    <CircleAlert color={theme.colors.danger} size={24} />
                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                        <Text style={styles.alertTitle}>Heavy Rain Alert</Text>
                        <Text style={styles.alertText}>Automatic claim being processed.</Text>
                    </View>
                    <TouchableOpacity style={styles.alertButton}>
                        <Text style={styles.alertButtonText}>Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Risk Metrics */}
                <Text style={styles.sectionTitle}>Today's Risk Metrics</Text>
                <View style={styles.metricGrid}>
                    <View style={styles.metricCard}>
                        <Thermometer color="#f97316" size={24} style={{ marginBottom: 4 }} />
                        <Text style={styles.metricValue}>{weather ? `${weather.temperature_celsius}°C` : '--'}</Text>
                        <Text style={styles.metricLabel}>TEMP</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Droplets color="#3b82f6" size={24} style={{ marginBottom: 4 }} />
                        <Text style={styles.metricValue}>{weather ? `${weather.rain_probability_percent}%` : '--'}</Text>
                        <Text style={styles.metricLabel}>{weather?.rain_probability_percent > 50 ? 'HIGH RAIN' : 'RAIN PROB'}</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Wind color="#a855f7" size={24} style={{ marginBottom: 4 }} />
                        <Text style={styles.metricValue}>142</Text>
                        <Text style={styles.metricLabel}>AQI</Text>
                    </View>
                </View>

                {/* Live Trigger Monitor */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>Live Trigger Monitor</Text>
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>LIVE UPDATES</Text>
                    </View>
                </View>

                <View style={styles.triggerContainer}>
                    <View style={styles.triggerRow}>
                        <View style={styles.triggerHeader}>
                            <Text style={styles.triggerLabel}>Heavy Rain</Text>
                            <Text style={[styles.triggerText, { color: (weather?.rain_probability_percent > 70) ? theme.colors.danger : theme.colors.textMuted }]}>
                                {weather ? `${weather.rain_probability_percent}%` : '0%'} Triggered
                            </Text>
                        </View>
                        <View style={styles.triggerTrack}>
                            <View style={[styles.triggerFill, { width: weather ? `${weather.rain_probability_percent}%` : '0%', backgroundColor: (weather?.rain_probability_percent > 70) ? theme.colors.danger : theme.colors.primary }]} />
                        </View>
                    </View>

                    <View style={styles.triggerRow}>
                        <View style={styles.triggerHeader}>
                            <Text style={styles.triggerLabel}>Extreme Heat</Text>
                            <Text style={[styles.triggerText, { color: (weather?.temperature_celsius > 40) ? '#f97316' : theme.colors.textMuted }]}>
                                {weather ? `${Math.min(100, (weather.temperature_celsius / 45) * 100).toFixed(0)}%` : '0%'} Triggered
                            </Text>
                        </View>
                        <View style={styles.triggerTrack}>
                            <View style={[styles.triggerFill, { width: weather ? `${Math.min(100, (weather.temperature_celsius / 45) * 100)}%` : '0%', backgroundColor: '#f97316' }]} />
                        </View>
                    </View>
                </View>

                {/* Earnings Widget */}
                <View style={styles.earningsWidget}>
                    <View>
                        <Text style={styles.earningsLabel}>EARNINGS PROTECTED</Text>
                        <Text style={styles.earningsValue}>₹6,840.00</Text>
                        <Text style={styles.earningsSub}>Total payouts this quarter</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.m, backgroundColor: 'rgba(255,255,255,0.8)', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    menuIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary + '10', borderRadius: theme.borderRadius.s },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark, marginLeft: 16 },
    profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
    scrollContent: { padding: theme.spacing.m, paddingBottom: 100 },

    // Coverage Card
    coverageCard: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.m, padding: 24, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, marginBottom: 16 },
    coverageLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    coverageId: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
    statusRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    statusBadgeWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbbf24', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, gap: 6 },
    pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
    statusBadgeWarningText: { color: theme.colors.primary, fontSize: 10, fontWeight: 'bold' },
    statusBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    statusBadgeActiveText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    // Alert Banner
    alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderLeftWidth: 4, borderLeftColor: theme.colors.danger, padding: 16, borderRadius: theme.borderRadius.s, marginBottom: 24 },
    alertTitle: { color: '#7f1d1d', fontWeight: 'bold', fontSize: 14 },
    alertText: { color: '#b91c1c', fontSize: 12 },
    alertButton: { backgroundColor: theme.colors.danger, paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.borderRadius.s },
    alertButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

    // Metrics
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark, marginTop: 16, marginBottom: 12 },
    metricGrid: { flexDirection: 'row', gap: 12 },
    metricCard: { flex: 1, backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.primary + '10', borderRadius: theme.borderRadius.m, padding: 16, alignItems: 'center', elevation: 1 },
    metricValue: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textDark, marginVertical: 4 },
    metricLabel: { fontSize: 10, fontWeight: 'bold', color: theme.colors.textMuted },

    // Triggers
    liveBadge: { backgroundColor: theme.colors.primary + '10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    liveBadgeText: { color: theme.colors.primary, fontSize: 10, fontWeight: 'bold' },
    triggerContainer: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.primary + '10', borderRadius: theme.borderRadius.m, padding: 16, gap: 16 },
    triggerRow: { marginBottom: 4 },
    triggerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    triggerLabel: { fontSize: 12, fontWeight: 'bold', color: theme.colors.textMuted },
    triggerText: { fontSize: 12, fontWeight: 'bold' },
    triggerTrack: { height: 8, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' },
    triggerFill: { height: '100%', borderRadius: 4 },

    // Earnings
    earningsWidget: { backgroundColor: theme.colors.primary + '10', borderWidth: 1, borderColor: theme.colors.primary + '20', borderRadius: theme.borderRadius.m, padding: 20, marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    earningsLabel: { color: theme.colors.primary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    earningsValue: { color: theme.colors.primary, fontSize: 32, fontWeight: 'bold', marginVertical: 4 },
    earningsSub: { color: theme.colors.textMuted, fontSize: 12 }
});
