import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Upload, Download, FileText, Check } from 'lucide-react-native';
import { bookManager } from '@/services/bookManager';

interface ContentImporterProps {
  onImportComplete?: () => void;
}

export default function ContentImporter({ onImportComplete }: ContentImporterProps) {
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = async () => {
    if (!importText.trim()) {
      Alert.alert('שגיאה', 'אנא הכנס תוכן לייבוא');
      return;
    }

    setIsImporting(true);
    try {
      const contentData = JSON.parse(importText);
      await bookManager.importBookContent(contentData);
      
      Alert.alert(
        'ייבוא הושלם',
        'תוכן הספר עודכן בהצלחה',
        [
          {
            text: 'אישור',
            onPress: () => {
              setImportText('');
              onImportComplete?.();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'פורמט התוכן אינו תקין');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportedContent = await bookManager.exportBookContent();
      
      // In a real app, you might want to share this or save to file
      Alert.alert(
        'ייצוא הושלם',
        'תוכן הספר מוכן להעתקה',
        [
          {
            text: 'העתק',
            onPress: () => {
              // Copy to clipboard functionality would go here
              console.log('Exported content:', exportedContent);
            }
          },
          { text: 'סגור', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('שגיאה', 'לא ניתן לייצא את התוכן');
    } finally {
      setIsExporting(false);
    }
  };

  const validateJSON = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  const isValidJSON = importText.trim() ? validateJSON(importText) : true;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FileText size={32} color="#2563EB" />
        <Text style={styles.title}>ניהול תוכן הספר</Text>
        <Text style={styles.subtitle}>ייבוא וייצוא תוכן</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ייבוא תוכן חדש</Text>
        <Text style={styles.sectionDescription}>
          הדבק כאן את תוכן הספר בפורמט JSON
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              !isValidJSON && styles.textInputError
            ]}
            multiline
            numberOfLines={10}
            value={importText}
            onChangeText={setImportText}
            placeholder="הדבק כאן את תוכן הספר בפורמט JSON..."
            placeholderTextColor="#9CA3AF"
            textAlign="right"
          />
          
          {!isValidJSON && (
            <Text style={styles.errorText}>פורמט JSON לא תקין</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.importButton,
            (!importText.trim() || !isValidJSON || isImporting) && styles.buttonDisabled
          ]}
          onPress={handleImport}
          disabled={!importText.trim() || !isValidJSON || isImporting}
        >
          {isImporting ? (
            <Text style={styles.buttonText}>מייבא...</Text>
          ) : (
            <>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>ייבא תוכן</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ייצוא תוכן נוכחי</Text>
        <Text style={styles.sectionDescription}>
          ייצא את תוכן הספר הנוכחי לקובץ JSON
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.exportButton]}
          onPress={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Text style={[styles.buttonText, styles.exportButtonText]}>מייצא...</Text>
          ) : (
            <>
              <Download size={20} color="#2563EB" />
              <Text style={[styles.buttonText, styles.exportButtonText]}>ייצא תוכן</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>הוראות שימוש:</Text>
        <Text style={styles.instructionText}>
          1. לייבוא תוכן חדש - הדבק את קובץ ה-JSON בתיבת הטקסט ולחץ "ייבא תוכן"
        </Text>
        <Text style={styles.instructionText}>
          2. לייצוא התוכן הנוכחי - לחץ "ייצא תוכן" והעתק את התוצאה
        </Text>
        <Text style={styles.instructionText}>
          3. התוכן נשמר באופן מקומי במכשיר ולא נשלח לשרת חיצוני
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
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
    marginBottom: 8,
    textAlign: 'right',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
    textAlign: 'right',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  textInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  importButton: {
    backgroundColor: '#2563EB',
  },
  exportButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exportButtonText: {
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 15,
  },
  instructions: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    textAlign: 'right',
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 20,
  },
});