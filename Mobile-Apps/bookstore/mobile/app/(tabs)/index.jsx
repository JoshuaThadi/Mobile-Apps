import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Linking } from 'react-native';  // <-- import Linking
import { Image } from "expo-image";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api.js";
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from '../../lib/utils.js';
import COLORS from '../../constants/colors.js';
import Loader from '../../components/Loader.jsx';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch books");

      // Merge unique books by _id
      const uniqueBooks =
        refresh || pageNum === 1
          ? data.books
          : Array.from(new Set([...books, ...data.books].map(book => book._id)))
              .map(id => [...books, ...data.books].find(book => book._id === id));

      setBooks(uniqueBooks);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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

  // Function to open the book link safely
  const handleOpenLink = async (link) => {
    console.log("Attempting to open link:", link); // Add this line

    if (typeof link === "string" && link.trim() !== "") {
      let url = link.trim();
      if (!url.match(/^https?:\/\//)) {
        url = "https://" + url;
      }
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url).catch(() => {
          alert("Failed to open the link.");
        });
      } else {
        alert("Invalid URL: Cannot open the provided link.");
      }
    } else {
      alert("No link provided for this book.");
    }
  };



  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={{ uri: item.image }} style={styles.bookImage} contentFit="cover" />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>

        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>

        {/* Button to open link */}
        <TouchableOpacity
          style={{
            marginTop: 8,
            paddingVertical: 6,
            backgroundColor: COLORS.primary,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => handleOpenLink(item.link)}
        >
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>Open Book Link</Text>
        </TouchableOpacity>

        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page + 1);
    }
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookStore</Text>
            <Text style={styles.headerSubtitle}>Concentrate on reading the Future.</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendation yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book!</Text>
          </View>
        }
      />
    </View>
  );
}
