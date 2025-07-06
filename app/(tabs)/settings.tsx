import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Settings, Book, Upload, Info, RefreshCw } from 'lucide-react-native';
import { bookManager, BookMetadata } from '@/services/bookManager';
import ContentImporter from '@/components/ContentImporter';

export default function SettingsScreen() {
  const [metadata, setMetadata] = useState<BookMetadata | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const bookMetadata = await bookManager.getMetadata();
      setMetadata(bookMetadata);
    } catch (error) {
      console.error('Failed to load metadata:', error);
    }
  };

  const checkForUpdates = async () => {
    setIsCheckingUpdates(true);
    try {
      const hasUpdates = await bookManager.checkForUpdates();
      if (hasUpdates) {
        Alert.alert('עדכון זמין', 'קיים עדכון חדש לתוכן הספר');
      } else {
        Alert.alert('אין עדכונים', 'תוכן הספר מעודכן לגרסה האחרונה');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'לא ניתן לבדוק עדכונים כרגע');
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  const handleImportComplete = () => {
    setShowImporter(false);
    loadMetadata();
    Alert.alert('הצלחה', 'תוכן הספר עודכן בהצלחה');
  };

  if (showImporter) {
    return <ContentImporter onImportComplete={handleImportComplete} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={32} color="#2563EB" />
        <Text style={styles.title}>הגדרות</Text>
        <Text style={styles.subtitle}>ניהול האפליקציה והתוכן</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Book Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Book size={24} color="#374151" />
            <Text style={styles.sectionTitle}>מידע על הספר</Text>
          </View>
          
          {metadata && (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>שם הספר:</Text>
                <Text style={styles.infoValue}>{metadata.title}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>תת כותרת:</Text>
                <Text style={styles.infoValue}>{metadata.subtitle}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>מחבר:</Text>
                <Text style={styles.infoValue}>{metadata.author}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>גרסה:</Text>
                <Text style={styles.infoValue}>{metadata.version}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>מספר פרקים:</Text>
                <Text style={styles.infoValue}>{metadata.totalChapters}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>מספר עמודים:</Text>
                <Text style={styles.infoValue}>{metadata.totalPages}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>עודכן לאחרונה:</Text>
                <Text style={styles.infoValue}>
                  {new Date(metadata.lastUpdated).toLocaleDateString('he-IL')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Content Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Upload size={24} color="#374151" />
            <Text style={styles.sectionTitle}>ניהול תוכן</Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowImporter(true)}
          >
            <Upload size={20} color="#2563EB" />
            <Text style={styles.actionButtonText}>ייבוא תוכן חדש</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={checkForUpdates}
            disabled={isCheckingUpdates}
          >
            <RefreshCw size={20} color="#2563EB" />
            <Text style={styles.actionButtonText}>
              {isCheckingUpdates ? 'בודק עדכונים...' : 'בדיקת עדכונים'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={24} color="#374151" />
            <Text style={styles.sectionTitle}>מידע על האפליקציה</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>גרסת אפליקציה:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>פלטפורמה:</Text>
              <Text style={styles.infoValue}>React Native / Expo</Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>הוראות לעדכון תוכן:</Text>
          <Text style={styles.instructionText}>
            1. הכן את תוכן הספר בפורמט JSON המתאים
          </Text>
          <Text style={styles.instructionText}>
            2. לחץ על "ייבוא תוכן חדש" והדבק את התוכן
          </Text>
          <Text style={styles.instructionText}>
            3. התוכן יישמר באופן מקומי במכשיר
          </Text>
          <Text style={styles.instructionText}>
            4. לעדכונים עתידיים, השתמש באותו תהליך
          </Text>
        </View>
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
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  infoContainer: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  instructionsSection: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 10,
    textAlign: 'right',
  },
  instructionText: {
    fontSize: 14,
    color: '#3730A3',
    marginBottom: 6,
    textAlign: 'right',
    lineHeight: 20,
  },
});