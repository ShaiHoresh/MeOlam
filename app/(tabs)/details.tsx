import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, I18nManager } from 'react-native';
import { Book, User, Calendar, Mail, Globe, Star, Heart, Share2 } from 'lucide-react-native';
import { bookData } from '@/data/bookData';
import { Platform } from 'react-native';

// Enable RTL layout
if (Platform.OS !== 'web') {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function BookDetailsScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:author@example.com?subject=שאלה בנוגע לספר החכמה והמוסר');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://example.com');
  };

  const handleSharePress = () => {
    // In a real app, you would use the Share API
    console.log('Share book');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.bookIconContainer}>
            <Book size={48} color="#2563EB" />
          </View>
          <Text style={styles.bookTitle}>{bookData.title}</Text>
          <Text style={styles.bookSubtitle}>{bookData.subtitle}</Text>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} color="#F59E0B" fill="#F59E0B" />
            ))}
            <Text style={styles.ratingText}>5.0</Text>
          </View>
        </View>

        {/* Book Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>פרטי הספר</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <User size={20} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>מחבר</Text>
                <Text style={styles.infoValue}>{bookData.author}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Calendar size={20} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>שנת הוצאה</Text>
                <Text style={styles.infoValue}>תשפ״ה (2024)</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Book size={20} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>מספר פרקים</Text>
                <Text style={styles.infoValue}>{bookData.chapters.length}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Globe size={20} color="#6B7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>שפה</Text>
                <Text style={styles.infoValue}>עברית</Text>
              </View>
            </View>
          </View>
        </View>

        {/* About the Author */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>אודות המחבר</Text>
          <Text style={styles.aboutText}>
            המחבר הוא תלמיד חכם ומחנך מוערך, שעוסק בהוראה ובכתיבה זה שנים רבות. 
            ספריו מתמקדים בנושאי אמונה, מוסר ותיקון המידות, ומיועדים לכל המעוניינים 
            בצמיחה רוחנית ובהעמקת הקשר עם הבורא.
          </Text>
          <Text style={styles.aboutText}>
            בספר זה הוא מביא לקורא מבחר מאמרים ודרשות שנאמרו במהלך השנים, 
            המתמקדים בנושאים יסודיים בעבודת ה׳ ובחיים יהודיים.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>יצירת קשר</Text>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
            <Mail size={24} color="#2563EB" />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>שליחת מייל למחבר</Text>
              <Text style={styles.contactSubtitle}>author@example.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleWebsitePress}>
            <Globe size={24} color="#2563EB" />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>אתר המחבר</Text>
              <Text style={styles.contactSubtitle}>www.example.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>אודות האפליקציה</Text>
          
          <View style={styles.appInfoContainer}>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>גרסת אפליקציה:</Text>
              <Text style={styles.appInfoValue}>1.0.0</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>עדכון אחרון:</Text>
              <Text style={styles.appInfoValue}>ינואר 2024</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>פלטפורמה:</Text>
              <Text style={styles.appInfoValue}>React Native</Text>
            </View>
          </View>

          <Text style={styles.appDescription}>
            אפליקציה זו פותחה במיוחד לקריאה נוחה של טקסטים בעברית, עם תמיכה מלאה 
            בכיוון כתיבה מימין לשמאל, חיפוש מתקדם וסימניות לשמירת מקום הקריאה.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
            <Share2 size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>שתף את הספר</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.favoriteButton]}>
            <Heart size={20} color="#EF4444" />
            <Text style={[styles.actionButtonText, styles.favoriteButtonText]}>הוסף למועדפים</Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © כל הזכויות שמורות למחבר • תשפ״ה
          </Text>
          <Text style={styles.copyrightSubtext}>
            אין להעתיק או להפיץ ללא רשות בכתב מהמחבר
          </Text>
        </View>

        {/* Bottom padding for better scrolling */}
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  bookIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  bookSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
    writingDirection: 'rtl',
  },
  ratingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  infoContainer: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'right',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  appInfoContainer: {
    marginBottom: 15,
  },
  appInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  appInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  actionSection: {
    paddingHorizontal: 15,
    marginTop: 15,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    gap: 8,
  },
  favoriteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  favoriteButtonText: {
    color: '#EF4444',
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  copyrightText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 5,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bottomPadding: {
    height: 40,
  },
});