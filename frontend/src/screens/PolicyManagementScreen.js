import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { ArrowLeft, CircleHelp, ShieldAlert, BadgeCheck, FileText, Calendar, Shield, Download, PauseCircle, ChevronUp, TriangleAlert } from 'lucide-react-native';
import { theme } from '../theme/theme';

export default function PolicyManagementScreen({ navigation }) {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft color={theme.colors.primary} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Policy Management</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <CircleHelp color={theme.colors.primary} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Current Policy Card */}
                <View style={styles.policyCard}>
                    <ShieldAlert color="rgba(255,255,255,0.1)" size={120} style={{ position: 'absolute', right: -20, top: -20 }} />
                    <View style={styles.policyCardHeader}>
                        <View>
                            <Text style={styles.policyStatus}>STATUS: ACTIVE</Text>
                            <Text style={styles.policyTitle}>Comprehensive Cover</Text>
                        </View>
                        <View style={styles.planBadge}>
                            <Text style={styles.planBadgeText}>GOLD PLAN</Text>
                        </View>
                    </View>

                    <View style={styles.policyDetails}>
                        <View style={styles.detailRow}>
                            <FileText color="#fff" size={16} />
                            <Text style={styles.detailText}>Policy #GS-882910-BGL</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Calendar color="#fff" size={16} />
                            <Text style={styles.detailText}>Valid until 31 Dec 2026</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Shield color="#fff" size={16} />
                            <Text style={styles.detailText}>Coverage: Rain, Heat, Strike, Theft</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.downloadBtn}>
                        <Download color={theme.colors.primary} size={16} />
                        <Text style={styles.downloadBtnText}>Download PDF</Text>
                    </TouchableOpacity>
                </View>

                {/* Controls */}
                <Text style={styles.sectionHeader}>POLICY CONTROLS</Text>

                <View style={styles.controlRow}>
                    <View style={styles.controlInfo}>
                        <View style={styles.controlIconBox}>
                            <PauseCircle color={theme.colors.primary} size={24} />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.controlTitle}>Pause Coverage</Text>
                            <Text style={styles.controlSub}>Useful during vacations</Text>
                        </View>
                    </View>
                    <Switch
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        thumbColor="#ffffff"
                        onValueChange={() => setIsPaused(!isPaused)}
                        value={isPaused}
                    />
                </View>

                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.upgradeBtn}>
                        <ChevronUp color={theme.colors.primary} size={28} />
                        <Text style={styles.upgradeBtnText}>UPGRADE PLAN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn}>
                        <TriangleAlert color={theme.colors.danger} size={24} />
                        <Text style={styles.cancelBtnText}>CANCEL POLICY</Text>
                    </TouchableOpacity>
                </View>

                {/* Weekly Premium History Table */}
                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>WEEKLY HISTORY</Text>
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 2 }]}>Week</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Cover</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Claims</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Net P.</Text>
                    </View>

                    {[
                        { date: 'Oct 15 - 21', premium: '₹85', claims: '0', net: '+₹15', isPositive: true },
                        { date: 'Oct 08 - 14', premium: '₹92', claims: '1', net: '-₹408', isPositive: false },
                        { date: 'Oct 01 - 07', premium: '₹78', claims: '0', net: '+₹22', isPositive: true },
                    ].map((row, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>{row.date}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{row.premium}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>{row.claims}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: row.isPositive ? theme.colors.success : theme.colors.danger, fontWeight: 'bold' }]}>
                                {row.net}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.m, backgroundColor: theme.colors.white, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    iconBtn: { padding: 8, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },
    scrollContent: { padding: theme.spacing.m, paddingBottom: 100 },

    // Top Card
    policyCard: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl, padding: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
    policyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    policyStatus: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    policyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
    planBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    planBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    policyDetails: { marginBottom: 24, gap: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    detailText: { color: '#fff', fontSize: 14, fontWeight: '300' },
    downloadBtn: { backgroundColor: '#fff', borderRadius: theme.borderRadius.m, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    downloadBtnText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 14 },

    // Controls
    sectionHeader: { fontSize: 12, fontWeight: 'bold', color: theme.colors.primary, letterSpacing: 1, marginBottom: 12, marginLeft: 4, marginTop: 16 },
    controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.primary + '10', borderWidth: 1, borderColor: theme.colors.primary + '20', borderRadius: theme.borderRadius.l, padding: 16, marginBottom: 16 },
    controlInfo: { flexDirection: 'row', alignItems: 'center' },
    controlIconBox: { width: 40, height: 40, borderRadius: theme.borderRadius.s, backgroundColor: theme.colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
    controlTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textDark },
    controlSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },

    actionGrid: { flexDirection: 'row', gap: 12 },
    upgradeBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: theme.borderRadius.l, borderWidth: 1, borderColor: theme.colors.primary + '30', backgroundColor: theme.colors.white },
    upgradeBtnText: { fontSize: 10, fontWeight: 'bold', color: theme.colors.primary, marginTop: 8 },
    cancelBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: theme.borderRadius.l, borderWidth: 1, borderColor: theme.colors.danger + '30', backgroundColor: '#fef2f2' },
    cancelBtnText: { fontSize: 10, fontWeight: 'bold', color: theme.colors.danger, marginTop: 8 },

    // Table
    tableContainer: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.l, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' },
    tableHeader: { flexDirection: 'row', backgroundColor: theme.colors.primary + '10', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    th: { fontSize: 12, fontWeight: 'bold', color: theme.colors.primary },
    tableRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border + '50' },
    td: { fontSize: 13, color: theme.colors.textDark }
});
