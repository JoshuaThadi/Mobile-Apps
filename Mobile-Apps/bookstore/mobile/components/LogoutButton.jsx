import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import styles from "../assets/styles/profile.styles.js";
import { useAuthStore } from '../store/authStore.js';
import {Ionicons} from "@expo/vector-icons";
import COLORS from '../constants/colors.js';

export default function LogoutButton() {

    const {logout} = useAuthStore();
    const confirmLogout = () => {

        Alert.alert("Logout", "Are you sure you want to logout?", [
            {text:"Cancel", style:"cancel"},
            {text: "Logout", onPress: () => logout(), style: "destructive"},
        ]);

    };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}