import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut, ChevronRight, User, Phone, MapPin, CreditCard } from 'lucide-react-native';
import { theme } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account Profile</Text>
                <TouchableOpacity style={styles.settingsBtn}>
                    <Settings color={theme.colors.primary} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Info */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <User color={theme.colors.primary} size={40} />
                    </View>
                    <Text style={styles.userName}>Rahul Sharma</Text>
                    <Text style={styles.userSub}>Zomato Partner since 2024</Text>
                </View>

                {/* Details Section */}
                <Text style={styles.sectionHeader}>PERSONAL DETAILS</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Phone color={theme.colors.textMuted} size={20} />
                        <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>Phone Number</Text>
                            <Text style={styles.detailValue}>+91 91234 56789</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <MapPin color={theme.colors.textMuted} size={20} />
                        <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>Verification Zone</Text>
                            <Text style={styles.detailValue}>Hitech City, Hyderabad</Text>
                        </View>
                    </View>
                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <CreditCard color={theme.colors.textMuted} size={20} />
                        <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>Payout UPI</Text>
                            <Text style={styles.detailValue}>rahulsharma@oksbi</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Grid */}
                <Text style={styles.sectionHeader}>PREFERENCES</Text>
                <View style={styles.settingsGrid}>
                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.settingsItemText}>Support & Help</Text>
                        <ChevronRight color={theme.colors.primary} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.settingsItemText}>Terms & Conditions</Text>
                        <ChevronRight color={theme.colors.primary} size={20} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Onboarding')}>
                    <LogOut color={theme.colors.danger} size={20} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>GigShield v1.0.4 - Premium Protection</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.m, backgroundColor: theme.colors.white },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
    settingsBtn: { padding: 8 },
    scrollContent: { padding: theme.spacing.m },

    profileCard: { alignItems: 'center', backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.xl, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border },
    avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    userName: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textDark },
    userSub: { fontSize: 14, color: theme.colors.textMuted },

    sectionHeader: { fontSize: 12, fontWeight: 'bold', color: theme.colors.textMuted, marginBottom: 12, marginLeft: 4 },
    detailsContainer: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.l, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border + '50' },
    detailText: { marginLeft: 16 },
    detailLabel: { fontSize: 12, color: theme.colors.textMuted },
    detailValue: { fontSize: 16, fontWeight: '600', color: theme.colors.textDark },

    settingsGrid: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.l, borderWidth: 1, borderColor: theme.colors.border },
    settingsItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border + '50' },
    settingsItemText: { fontSize: 16, color: theme.colors.textDark },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, padding: 16, borderRadius: theme.borderRadius.l, backgroundColor: '#fef2f2', borderWidth: 1, borderColor: theme.colors.danger + '20' },
    logoutText: { marginLeft: 8, fontSize: 16, fontWeight: 'bold', color: theme.colors.danger },
    versionText: { textAlign: 'center', marginTop: 40, color: theme.colors.textMuted, fontSize: 12 }
});
