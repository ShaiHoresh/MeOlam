import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, I18nManager } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookData, Chapter, BlockContent } from '@/data/bookData';

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

export default function ReaderScreen() {
  const { chapter: chapterId, searchQuery, position } = useLocalSearchParams();
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const chapter = bookData.chapters.find(ch => ch.id === chapterId);
    setCurrentChapter(chapter || null);
    checkBookmarkStatus();
  }, [chapterId]);

  const checkBookmarkStatus = async () => {
    try {
      const bookmarkData = await AsyncStorage.getItem('activeBookmark');
      if (bookmarkData) {
        const bookmark: BookmarkData = JSON.parse(bookmarkData);
        setIsBookmarked(bookmark.chapterId === chapterId);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const saveBookmark = async () => {
    if (!currentChapter) return;

    // Get first paragraph from first block for bookmark preview
    const firstBlock = currentChapter.content[0];
    const previewText = firstBlock?.paragraphs[0]?.substring(0, 100) || '';

    const bookmarkData: BookmarkData = {
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      position: scrollPosition,
      text: previewText,
      timestamp: Date.now(),
    };

    try {
      await AsyncStorage.setItem('activeBookmark', JSON.stringify(bookmarkData));
      setIsBookmarked(true);
      Alert.alert('סימנייה נשמרה', 'המקום נשמר בהצלחה');
    } catch (error) {
      console.error('Error saving bookmark:', error);
      Alert.alert('שגיאה', 'לא ניתן לשמור את הסימנייה');
    }
  };

  const removeBookmark = async () => {
    try {
      await AsyncStorage.removeItem('activeBookmark');
      setIsBookmarked(false);
      Alert.alert('סימנייה הוסרה', 'הסימנייה נמחקה בהצלחה');
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleBookmarkPress = () => {
    if (isBookmarked) {
      Alert.alert(
        'הסרת סימנייה',
        'האם אתה בטוח שברצונך להסיר את הסימנייה?',
        [
          { text: 'ביטול', style: 'cancel' },
          { text: 'הסר', style: 'destructive', onPress: removeBookmark },
        ]
      );
    } else {
      saveBookmark();
    }
  };

  const highlightSearchResults = (text: string, query: string) => {
    if (!query) {
      return <Text style={styles.paragraphText}>{text}</Text>;
    }
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text style={styles.paragraphText}>
        {parts.map((part, index) => {
          if (part.toLowerCase() === query.toLowerCase()) {
            return (
              <Text key={index} style={styles.highlightedText}>
                {part}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  };

  const renderBlock = (block: BlockContent, blockIndex: number) => {
    const query = searchQuery ? decodeURIComponent(searchQuery as string) : '';
    
    return (
      <View key={blockIndex} style={styles.blockContainer}>
        {/* Render subtitle if it exists */}
        {block.subtitle && (
          <Text style={styles.blockSubtitle}>
            {query ? highlightSearchResults(block.subtitle, query) : block.subtitle}
          </Text>
        )}
        
        {/* Render paragraphs */}
        {block.paragraphs.map((paragraph, paragraphIndex) => (
          <View key={paragraphIndex} style={styles.paragraphContainer}>
            {query ? highlightSearchResults(paragraph, query) : (
              <Text style={styles.paragraphText}>{paragraph}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (!currentChapter) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>פרק לא נמצא</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowRight size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.chapterTitle}>{currentChapter.title}</Text>
        </View>

        <TouchableOpacity
          style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]}
          onPress={handleBookmarkPress}
          activeOpacity={0.7}
        >
          {isBookmarked ? (
            <BookmarkCheck size={24} color="#2563EB" />
          ) : (
            <Bookmark size={24} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        onScroll={(event) => {
          setScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={100}
      >
        <View style={styles.textContainer}>
          {currentChapter.content.map((block, index) => renderBlock(block, index))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            עמוד {currentChapter.startPage} - {currentChapter.endPage}
          </Text>
        </View>
        
        {/* Add some bottom padding for better scrolling experience */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButtonActive: {
    backgroundColor: '#EBF4FF',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  textContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  blockContainer: {
    marginBottom: 25,
  },
  blockSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 15,
    lineHeight: 28,
  },
  paragraphContainer: {
    marginBottom: 15,
  },
  paragraphText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#1F2937',
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '400',
  },
  highlightedText: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
  },
});