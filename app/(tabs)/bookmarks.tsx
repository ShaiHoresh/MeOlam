import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookData } from '@/data/bookData';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface BookmarkData {
  chapterId: string;
  chapterTitle: string;
  position: number;
  text: string;
  timestamp: number;
}

export default function BookmarksScreen() {
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBookmark();
  }, []);

  const loadBookmark = async () => {
    try {
      const bookmarkData = await AsyncStorage.getItem('activeBookmark');
      if (bookmarkData) {
        setBookmark(JSON.parse(bookmarkData));
      }
    } catch (error) {
      console.error('Error loading bookmark:', error);
    }
  };

  const deleteBookmark = async () => {
    Alert.alert(
      'מחיקת סימנייה',
      'האם אתה בטוח שברצונך למחוק את הסימנייה?',
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('activeBookmark');
              setBookmark(null);
            } catch (error) {
              console.error('Error deleting bookmark:', error);
            }
          },
        },
      ]
    );
  };

  const openBookmark = () => {
    if (bookmark) {
      router.push(`/reader/${bookmark.chapterId}?position=${bookmark.position}`);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChapterInfo = (chapterId: string) => {
    const chapter = bookData.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return null;
    
    return {
      title: chapter.title,
      blockCount: chapter.content.length,
      pageRange: `${chapter.startPage}-${chapter.endPage}`
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>הסימנייה שלי</Text>
        <Text style={styles.subtitle}>מקום הקריאה האחרון</Text>
      </View>

      <View style={styles.content}>
        {bookmark ? (
          <View style={styles.bookmarkCard}>
            <View style={styles.bookmarkHeader}>
              <View style={styles.bookmarkIcon}>
                <Bookmark size={24} color="#2563EB" />
              </View>
              <View style={styles.bookmarkInfo}>
                <Text style={styles.bookmarkChapter}>{bookmark.chapterTitle}</Text>
                <Text style={styles.bookmarkDate}>
                  נשמר ב: {formatDate(bookmark.timestamp)}
                </Text>
              </View>
            </View>

            {/* Chapter Details */}
            {(() => {
              const chapterInfo = getChapterInfo(bookmark.chapterId);
              return chapterInfo ? (
                <View style={styles.chapterDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>קטעים בפרק:</Text>
                    <Text style={styles.detailValue}>{chapterInfo.blockCount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>עמודים:</Text>
                    <Text style={styles.detailValue}>{chapterInfo.pageRange}</Text>
                  </View>
                </View>
              ) : null;
            })()}

            <View style={styles.bookmarkPreview}>
              <Text style={styles.previewLabel}>תצוגה מקדימה:</Text>
              <Text style={styles.bookmarkText} numberOfLines={3}>
                {bookmark.text}
              </Text>
            </View>

            <View style={styles.bookmarkActions}>
              <TouchableOpacity
                style={styles.openButton}
                onPress={openBookmark}
                activeOpacity={0.7}
              >
                <BookOpen size={20} color="#FFFFFF" />
                <Text style={styles.openButtonText}>המשך קריאה</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={deleteBookmark}
                activeOpacity={0.7}
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bookmark size={64} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>אין סימנייה פעילה</Text>
            <Text style={styles.emptyText}>
              כשתתחיל לקרוא, תוכל לשמור סימנייה על ידי לחיצה על כפתור הסימנייה בעמוד הקריאה
            </Text>
            
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>איך להשתמש בסימניות:</Text>
              <Text style={styles.instructionText}>
                1. פתח פרק כלשהו מתוכן העניינים
              </Text>
              <Text style={styles.instructionText}>
                2. לחץ על סמל הסימנייה בחלק העליון של המסך
              </Text>
              <Text style={styles.instructionText}>
                3. הסימנייה תישמר ותופיע כאן
              </Text>
              <Text style={styles.instructionText}>
                4. לחץ "המשך קריאה" כדי לחזור למקום השמור
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bookmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  bookmarkHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookmarkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  bookmarkInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bookmarkChapter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  bookmarkDate: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  chapterDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
  bookmarkPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right',
  },
  bookmarkText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  bookmarkActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 12,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instructionsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 12,
    textAlign: 'right',
  },
  instructionText: {
    fontSize: 14,
    color: '#0369A1',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
  },
});