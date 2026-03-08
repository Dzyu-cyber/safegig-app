import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

// IMPORTANT: Change this to your computer's local IP address if testing on a real phone
const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
    const [user, setUser] = useState(null);
    const [phone, setPhone] = useState('');
    const [zone, setZone] = useState('Hyderabad_Hitech');

    const [quote, setQuote] = useState(null);
    const [activePolicy, setActivePolicy] = useState(null);
    const [claims, setClaims] = useState([]);

    // --- 1. ONBOARDING (Login/Register) ---
    const handleLogin = async () => {
        try {
            const userData = {
                user_id: `USR-${Math.floor(Math.random() * 10000)}`,
                name: "Delivery Partner",
                phone: phone,
                platform: "Zomato",
                zone: zone
            };
            await axios.post(`${API_BASE_URL}/register`, userData);
            setUser(userData);
            Alert.alert("Success", "Logged in securely!");
        } catch (err) {
            Alert.alert("Error", "Could not connect to server.");
        }
    };

    // --- 2. GET AI QUOTE ---
    const fetchQuote = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/get_quote/${user.zone}`);
            setQuote(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- 3. BUY WEEKLY POLICY ---
    const buyPolicy = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/buy_policy?user_id=${user.user_id}&zone=${user.zone}&premium=${quote.weekly_premium}`);
            setActivePolicy(res.data.policy);
            Alert.alert("Protected!", "Your weekly income is now safe.");
        } catch (err) {
            console.error(err);
        }
    };

    // --- 4. VIEW AUTOMATED CLAIMS ---
    const fetchClaims = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/my_claims/${user.user_id}`);
            setClaims(res.data.claims);
        } catch (err) {
            console.error(err);
        }
    };

    // UI Render Loop
    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>SafeGig India</Text>
                <Text style={styles.subText}>AI Income Protection for Gig Workers</Text>

                <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" onChangeText={setPhone} />
                <TextInput style={styles.input} placeholder="Work Zone (e.g. Mumbai_South)" value={zone} onChangeText={setZone} />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login & Secure Income</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.containerApp}>
            <Text style={styles.header}>Welcome, {user.name}</Text>
            <Text style={styles.subText}>Zone: {user.zone}</Text>

            {/* Policy Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>My Protection</Text>
                {activePolicy ? (
                    <View>
                        <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 16 }}>✅ Status: Active</Text>
                        <Text>Valid until: {new Date(activePolicy.end_date).toLocaleDateString()}</Text>
                        <Text>Coverage: ₹{activePolicy.coverage_amount} / day</Text>
                        <Text style={styles.note}>AI is monitoring the weather in real-time. If extreme rain or heat hits, you get paid instantly.</Text>
                    </View>
                ) : (
                    <View>
                        {!quote ? (
                            <TouchableOpacity style={styles.button} onPress={fetchQuote}>
                                <Text style={styles.buttonText}>Get Weekly AI Quote</Text>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                <Text style={styles.price}>₹{quote.weekly_premium} / week</Text>
                                <Text style={styles.note}>Covers up to ₹{quote.coverage} of lost income for Heat, Rain, or Strikes.</Text>
                                <TouchableOpacity style={styles.button} onPress={buyPolicy}>
                                    <Text style={styles.buttonText}>Pay & Activate</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Claims Dashboard */}
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>My Automated Payouts</Text>
                    <TouchableOpacity onPress={fetchClaims}><Text style={{ color: 'blue' }}>Refresh</Text></TouchableOpacity>
                </View>

                {claims.length === 0 ? <Text>No disruptions detected yet.</Text> : null}

                {claims.map((claim, idx) => (
                    <View key={idx} style={styles.claimBox}>
                        <Text style={styles.claimType}>Disruption: {claim.trigger_type}</Text>
                        <Text>Payout: ₹{claim.amount_paid}</Text>
                        <Text style={{ color: claim.status === 'Approved' ? 'green' : 'red' }}>
                            Status: {claim.status.replace('_', ' ')}
                        </Text>
                        {claim.status === 'Fraud_Flagged' && <Text style={{ fontSize: 10, color: 'red' }}>Reason: GPS Anomaly Detected</Text>}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    containerApp: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', paddingTop: 60 },
    header: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    subText: { fontSize: 16, color: '#666', marginBottom: 30 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#FF5A5F', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#2ecc71', marginVertical: 10 },
    note: { fontSize: 12, color: '#888', fontStyle: 'italic', marginVertical: 10 },
    claimBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#eee' },
    claimType: { fontWeight: 'bold', fontSize: 16 }
});