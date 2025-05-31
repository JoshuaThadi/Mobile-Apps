import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import styles from "../../assets/styles/login.styles";
import { useState } from 'react';
import COLORS from '../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const {isLoading, login, isCheckingAuth} = useAuthStore();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (!result.success) Alert.alert("Error", result.error);
  };

  if (isCheckingAuth) return null;

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "android" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
    
    <View style = {styles.container}>
      {/* Illustration */}
      <View style = {styles.topIllustration}>
        <Image
          source = {require("../../assets/images/pen.png")}
          style = {styles.illustrationImage}
          resizeMode = "contain"
        />
      </View>

      {/* <View style = {styles.card}> */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style = {styles.label}>Email</Text>
            <View style = {styles.inputContainer}>
              <Ionicons 
                name = "mail-outline"
                size = {25}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor = {COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              {/* Left Icon */}
              <Ionicons 
                name = "lock-closed-outline"
                size = {25}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput 
                style={styles.input}
                placeholder="Enter your Password"
                placeholderTextColor = {COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>

                <Ionicons 
                name = {showPassword ? "eye-outline" : "eye-off-outline"}
                size = {25}
                color={COLORS.primary}
              />

              </TouchableOpacity>

            </View>
          </View>

          {/* Login */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>

            {isLoading ? (
              <ActivityIndicator color = "#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}    

          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      {/* </View> */}

    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}