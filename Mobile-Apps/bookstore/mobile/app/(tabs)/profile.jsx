import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api.js";
import { useAuthStore } from "../../store/authStore.js";
import styles from "../../assets/styles/profile.styles.js";
import LogoutButton from "../../components/LogoutButton.jsx";
import ProfileHeader from "../../components/ProfileHeader.jsx";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors.js";
import { sleep } from ".";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const router = useRouter();
  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Books fetched from API:", data); // ✅ Debugging: log books from backend
      if (!response.ok) throw new Error(data.message || "Failed to fetch user books");

      setBooks(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete book");

      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete recommendation");
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDeleteBook(bookId) },
    ]);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  // ✅ Improved and debugged link handler
  const handleOpenLink = async (link) => {
    console.log("Trying to open link:", link); // ✅ Debug log

    if (typeof link === "string" && link.trim() !== "") {
      let url = link.trim();
      if (!url.match(/^https?:\/\//)) {
        url = "https://" + url;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url).catch(() => {
          Alert.alert("Error", "Failed to open the link.");
        });
      } else {
        Alert.alert("Invalid URL", "Cannot open the provided link.");
      }
    } else {
      Alert.alert("No Link", "This book does not have a link available.");
    }
  };

  const renderBookItem = ({ item }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>

          <TouchableOpacity style={styles.openLinkButton} onPress={() => handleOpenLink(item.link)}>
            <Text style={styles.openLinkButtonText}>Open Book Link</Text>
          </TouchableOpacity>

          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
          {deleteBookId === item._id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleRefresh = async () => {
    await sleep(500);
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing)
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Add your first Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
