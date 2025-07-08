import { View, Text, StyleSheet, ScrollView, TouchableOpacity, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { bookData } from '@/data/bookData';
import { ChevronLeft, FileText } from 'lucide-react-native';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function HomeScreen() {
  const router = useRouter();

  const handleChapterPress = (chapterId: string) => {
    router.push(`/reader/${chapterId}`);
  };

  const getChapterSummary = (chapterId: string) => {
    const chapter = bookData.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return '';
    
    // Get first subtitle or first paragraph as summary
    const firstBlock = chapter.content[0];
    if (firstBlock?.subtitle) {
      return firstBlock.subtitle;
    }
    
    // If no subtitle, use first few words of first paragraph
    const firstParagraph = firstBlock?.paragraphs[0];
    if (firstParagraph) {
      return firstParagraph.substring(0, 80) + '...';
    }
    
    return '';
  };

  const getBlockCount = (chapterId: string) => {
    const chapter = bookData.chapters.find(ch => ch.id === chapterId);
    return chapter?.content.length || 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{bookData.title}</Text>
        <Text style={styles.subtitle}>{bookData.subtitle}</Text>
        <Text style={styles.author}>מאת: {bookData.author}</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.tocContainer}>
          <Text style={styles.tocTitle}>תוכן העניינים</Text>
          
          {bookData.chapters.map((chapter, index) => (
            <TouchableOpacity
              key={chapter.id}
              style={styles.chapterItem}
              onPress={() => handleChapterPress(chapter.id)}
              activeOpacity={0.7}
            >
              <View style={styles.chapterContent}>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterSummary}>
                    {getChapterSummary(chapter.id)}
                  </Text>
                  <View style={styles.chapterMeta}>
                    <View style={styles.metaItem}>
                      <FileText size={14} color="#9CA3AF" />
                      <Text style={styles.metaText}>
                        {getBlockCount(chapter.id)} קטעים
                      </Text>
                    </View>
                    <Text style={styles.pageInfo}>
                      עמ׳ {chapter.startPage}-{chapter.endPage}
                    </Text>
                  </View>
                </View>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{index + 1}</Text>
                </View>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Book Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>סטטיסטיקות הספר</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{bookData.chapters.length}</Text>
              <Text style={styles.statLabel}>פרקים</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {bookData.chapters.reduce((total, chapter) => total + chapter.content.length, 0)}
              </Text>
              <Text style={styles.statLabel}>קטעים</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {bookData.chapters[bookData.chapters.length - 1]?.endPage || 0}
              </Text>
              <Text style={styles.statLabel}>עמודים</Text>
            </View>
          </View>
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
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
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
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tocContainer: {
    padding: 20,
  },
  tocTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  chapterItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chapterContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  chapterInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  chapterSummary: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
  },
  chapterMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pageInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  chapterNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  chevron: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -10,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 15,
    writingDirection: 'rtl',
  },
  statsGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});