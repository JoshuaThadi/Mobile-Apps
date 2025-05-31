import { View, Text } from "react-native";
import { useAuthStore } from "../store/authStore.js";
import { Image } from "expo-image";
import styles from "../assets/styles/profile.styles.js";
import { formatMemberSince } from "../lib/utils.js";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  if (!user) return null;

  // Defensive conversion
  const createdAtDate = user.createdAt ? new Date(user.createdAt) : null;

  console.log("User createdAt raw:", user.createdAt);
  console.log("User createdAt date:", createdAtDate);

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
      </View>
    </View>
  );
}
