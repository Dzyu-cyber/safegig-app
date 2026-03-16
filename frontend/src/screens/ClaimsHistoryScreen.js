import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { ArrowLeft, Bell, Info, CircleCheck, Clock, CircleX, MapPin, UploadCloud, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { theme } from '../theme/theme';

export default function ClaimsHistoryScreen({ navigation }) {
    const [tab, setTab] = useState('All');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft color={theme.colors.primary} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Claims & History</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Bell color={theme.colors.primary} size={24} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, tab === 'All' && styles.tabActive]} onPress={() => setTab('All')}>
                    <Text style={[styles.tabText, tab === 'All' && styles.tabTextActive]}>All Claims</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, tab === 'Manual' && styles.tabActive]} onPress={() => setTab('Manual')}>
                    <Text style={[styles.tabText, tab === 'Manual' && styles.tabTextActive]}>Manual Request</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {tab === 'All' && (
                    <>
                        <View style={styles.infoBanner}>
                            <Info color={theme.colors.primary} size={20} style={{ alignSelf: 'flex-start' }} />
                            <Text style={styles.infoText}>Most claims are processed automatically based on real-time climate/traffic data. File manual claims below.</Text>
                        </View>

                        <Text style={styles.sectionHeader}>RECENT ACTIVITY</Text>

                        {/* Claim Item 1 */}
                        <View style={styles.claimItem}>
                            <View style={[styles.claimIcon, { backgroundColor: '#dcfce7' }]}>
                                <CircleCheck color="#15803d" size={24} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <View style={styles.claimHeader}>
                                    <Text style={styles.claimId}>#GS-8821</Text>
                                    <Text style={[styles.claimAmount, { color: theme.colors.primary }]}>+₹450</Text>
                                </View>
                                <Text style={styles.claimSub}>Oct 24 • Heavy Rain • Auto</Text>
                            </View>
                        </View>

                        {/* Claim Item 2 */}
                        <View style={styles.claimItem}>
                            <View style={[styles.claimIcon, { backgroundColor: '#fef3c7' }]}>
                                <Clock color="#b45309" size={24} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <View style={styles.claimHeader}>
                                    <Text style={styles.claimId}>#GS-9042</Text>
                                    <Text style={[styles.claimAmount, { color: theme.colors.textMuted }]}>₹120</Text>
                                </View>
                                <Text style={styles.claimSub}>Oct 26 • Traffic • Reviewing</Text>
                            </View>
                        </View>

                        {/* Claim Item 3 */}
                        <View style={[styles.claimItem, { opacity: 0.6 }]}>
                            <View style={[styles.claimIcon, { backgroundColor: '#f1f5f9' }]}>
                                <CircleX color="#64748b" size={24} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <View style={styles.claimHeader}>
                                    <Text style={styles.claimId}>#GS-7731</Text>
                                    <Text style={[styles.claimAmount, { color: theme.colors.textMuted }]}>₹0</Text>
                                </View>
                                <Text style={styles.claimSub}>Oct 20 • Manual • Denied</Text>
                            </View>
                        </View>

                        {/* Pagination placeholder */}
                        <View style={styles.pagination}>
                            <TouchableOpacity style={styles.pageBtn}>
                                <ChevronLeft color={theme.colors.primary} size={16} />
                                <Text style={styles.pageText}>Prev</Text>
                            </TouchableOpacity>
                            <Text style={styles.pageNumber}>Page 1 of 4</Text>
                            <TouchableOpacity style={styles.pageBtn}>
                                <Text style={styles.pageText}>Next</Text>
                                <ChevronRight color={theme.colors.primary} size={16} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {tab === 'Manual' && (
                    <View style={styles.manualForm}>
                        <Text style={styles.formTitle}>Manual Claim Request</Text>
                        <Text style={styles.formSub}>File a claim for a disruption not caught by our automated paramertric triggers.</Text>

                        <Text style={styles.label}>Disruption Date</Text>
                        <TextInput style={styles.input} placeholder="YYYY-MM-DD" />

                        <Text style={styles.label}>Disruption Type</Text>
                        <TextInput style={styles.input} placeholder="e.g. Strike / Platform Outage" />

                        <Text style={styles.label}>Location</Text>
                        <View style={styles.locContainer}>
                            <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Select location..." />
                            <TouchableOpacity style={styles.locBtn}>
                                <MapPin color="#fff" size={20} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="Describe how your income was affected..."
                            multiline
                        />

                        <Text style={styles.label}>Supporting Evidence (Optional)</Text>
                        <TouchableOpacity style={styles.uploadBox}>
                            <UploadCloud color={theme.colors.primary + '60'} size={40} />
                            <Text style={styles.uploadText}>Upload photos or screenshots</Text>
                            <Text style={styles.uploadSub}>PNG, JPG up to 10MB</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.submitBtn}>
                            <Text style={styles.submitBtnText}>Submit Claim Request</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.m, backgroundColor: theme.colors.white, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    iconBtn: { padding: 8, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    badge: { position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.danger, borderWidth: 1, borderColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },

    // Tabs
    tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.primary + '20', backgroundColor: theme.colors.white },
    tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: theme.colors.primary },
    tabText: { fontSize: 14, fontWeight: '600', color: theme.colors.textMuted },
    tabTextActive: { color: theme.colors.primary, fontWeight: 'bold' },

    scrollContent: { padding: theme.spacing.m, paddingBottom: 100 },

    // List View
    infoBanner: { flexDirection: 'row', backgroundColor: theme.colors.primary + '10', borderWidth: 1, borderColor: theme.colors.primary + '20', padding: 16, borderRadius: theme.borderRadius.l },
    infoText: { flex: 1, fontSize: 12, color: theme.colors.primary, marginLeft: 12, lineHeight: 18 },
    sectionHeader: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textDark, marginTop: 24, marginBottom: 16 },

    claimItem: { flexDirection: 'row', backgroundColor: theme.colors.white, padding: 16, borderRadius: theme.borderRadius.l, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12, alignItems: 'center' },
    claimIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    claimHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    claimId: { fontWeight: 'bold', fontSize: 16, color: theme.colors.textDark },
    claimAmount: { fontWeight: 'bold', fontSize: 16 },
    claimSub: { fontSize: 12, color: theme.colors.textMuted },

    pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border },
    pageBtn: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    pageText: { fontSize: 14, fontWeight: 'bold', color: theme.colors.primary, marginHorizontal: 4 },
    pageNumber: { fontSize: 12, color: theme.colors.textMuted },

    // Form View
    manualForm: { backgroundColor: theme.colors.primary + '05', borderRadius: theme.borderRadius.xl, padding: 20, borderWidth: 1, borderColor: theme.colors.primary + '20' },
    formTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textDark, marginBottom: 4 },
    formSub: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 24 },
    label: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textDark, marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.m, padding: 16, fontSize: 14 },
    locContainer: { flexDirection: 'row', gap: 8 },
    locBtn: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.m, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
    uploadBox: { borderRadius: theme.borderRadius.l, borderWidth: 2, borderColor: theme.colors.primary + '40', borderStyle: 'dashed', backgroundColor: theme.colors.white, padding: 32, alignItems: 'center' },
    uploadText: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textDark, marginTop: 12 },
    uploadSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
    submitBtn: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.m, padding: 18, alignItems: 'center', marginTop: 32 },
    submitBtnText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold' }
});
