import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { bookData } from '@/data/bookData';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  text: string;
  position: number;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    bookData.chapters.forEach(chapter => {
      const searchTerm = query.toLowerCase();
      const content = chapter.content.toLowerCase();
      let position = 0;

      while ((position = content.indexOf(searchTerm, position)) !== -1) {
        const start = Math.max(0, position - 50);
        const end = Math.min(chapter.content.length, position + searchTerm.length + 50);
        const context = chapter.content.substring(start, end);

        results.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          text: context,
          position: position,
        });

        position += searchTerm.length;
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) {
      return <Text>{text}</Text>;
    }
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text>
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

  const handleResultPress = (result: SearchResult) => {
    router.push(`/reader/${result.chapterId}?searchQuery=${encodeURIComponent(searchQuery)}&position=${result.position}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>חיפוש בספר</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SearchIcon size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="הקלד כאן לחיפוש..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                performSearch(text);
              }}
              textAlign="right"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.resultsContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {searchQuery && searchResults.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              נמצאו {searchResults.length} תוצאות עבור: "{searchQuery}"
            </Text>
          </View>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>לא נמצאו תוצאות עבור "{searchQuery}"</Text>
            <Text style={styles.noResultsSubtext}>נסה מילות חיפוש אחרות</Text>
          </View>
        )}

        {searchResults.map((result, index) => (
          <TouchableOpacity
            key={`${result.chapterId}-${index}`}
            style={styles.resultItem}
            onPress={() => handleResultPress(result)}
            activeOpacity={0.7}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultNumber}>{index + 1}</Text>
              <Text style={styles.resultChapter}>{result.chapterTitle}</Text>
            </View>
            <View style={styles.resultText}>
              {highlightText(result.text, searchQuery)}
            </View>
          </TouchableOpacity>
        ))}

        {!searchQuery && (
          <View style={styles.emptyState}>
            <SearchIcon size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>חיפוש בספר</Text>
            <Text style={styles.emptyStateText}>
              הקלד מילה או ביטוי כדי לחפש בתוכן הספר
            </Text>
          </View>
        )}
        
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
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    writingDirection: 'rtl',
  },
  clearButton: {
    padding: 5,
    marginRight: 5,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  resultsHeader: {
    paddingVertical: 15,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  resultChapter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  highlightedText: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    fontWeight: 'bold',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  },
});