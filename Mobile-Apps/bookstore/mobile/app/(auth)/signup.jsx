import { View, Image, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useAuthStore } from '../../store/authStore';
import { Alert } from "react-native";


export default function Signup() {

   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   //const [isLoading, setIsLoading] = useState(false);
   const {user, isLoading, register, token} = useAuthStore();

   const router = useRouter();
  
   const handleSignUp = async () => {
    const result = await register(username, email, password);
    if(!result.success) Alert.alert("Error", result.error);
   };
  
   console.log(user);
   console.log(token);

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "android" ? "padding" : "height"}>

    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

    <View style = {styles.container}>

      {/* Illustration */}
      <View style = {styles.topIllustration}>
        <Image
          source = {require("../../assets/images/Book1.png.png")}
          style = {styles.illustrationImage}
          resizeMode = "contain"
        />
      </View>

      <View style>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BookStore</Text>
          <Text style={styles.subtitle}>Share your favorite reads</Text>
        </View>

        <View style={styles.formContainer}>
          {/* UserName Input */}
          <View style={styles.inputGroup}>
            <Text style = {styles.label}>Username</Text>
            <View style = {styles.inputContainer}>
              <Ionicons 
                name = "person-outline"
                size = {25}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor = {COLORS.placeholderText}
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

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
                placeholder="johnDoe@gmail.com"
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
                placeholder="********"
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

          {/* SignUp */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>

            {isLoading ? (
              <ActivityIndicator color = "#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}    

          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>

    </ScrollView>
    </KeyboardAvoidingView>
  )
}