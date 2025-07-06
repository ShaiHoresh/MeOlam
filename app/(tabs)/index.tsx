import { View, Text, StyleSheet, ScrollView, TouchableOpacity, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { bookData } from '@/data/bookData';
import { ChevronLeft } from 'lucide-react-native';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function HomeScreen() {
  const router = useRouter();

  const handleChapterPress = (chapterId: string) => {
    router.push(`/reader/${chapterId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ספר החכמה והמוסר</Text>
        <Text style={styles.subtitle}>תוכן העניינים</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.tocContainer}>
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
                  <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>
                  <Text style={styles.pageInfo}>עמוד {chapter.startPage}</Text>
                </View>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{index + 1}</Text>
                </View>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={styles.chevron} />
            </TouchableOpacity>
          ))}
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
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  chapterSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
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
  bottomPadding: {
    height: 40,
  },
});