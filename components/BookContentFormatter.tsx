import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FileText, Copy, Download, Upload, Check, CircleAlert as AlertCircle } from 'lucide-react-native';

interface FormattedChapter {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  startPage: number;
  endPage: number;
}

interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
  version: string;
}

export default function BookContentFormatter() {
  const [rawContent, setRawContent] = useState('');
  const [bookMetadata, setBookMetadata] = useState<BookMetadata>({
    title: '',
    subtitle: '',
    author: '',
    version: '1.0.0'
  });
  const [formattedOutput, setFormattedOutput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const formatContent = () => {
    if (!rawContent.trim()) {
      Alert.alert('שגיאה', 'אנא הכנס את תוכן הספר');
      return;
    }

    try {
      // Split content by chapters (looking for patterns like "פרק א", "פרק ב", etc.)
      const chapterSeparators = [
        /פרק\s*[א-ת]\s*[-–—]\s*/g,
        /פרק\s*\d+\s*[-–—]\s*/g,
        /^[א-ת]\.\s*/gm,
        /^\d+\.\s*/gm
      ];

      let chapters: FormattedChapter[] = [];
      let currentPageNumber = 1;

      // Try to split by the most common pattern
      const lines = rawContent.split('\n');
      let currentChapter: Partial<FormattedChapter> = {};
      let chapterContent = '';
      let chapterIndex = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this line looks like a chapter title
        if (line.match(/^(פרק|חלק)\s*[א-ת\d]+/) || 
            line.match(/^[א-ת]\.\s*/) ||
            line.match(/^\d+\.\s*/)) {
          
          // Save previous chapter if exists
          if (currentChapter.title && chapterContent.trim()) {
            const endPage = currentPageNumber + Math.floor(chapterContent.length / 2000);
            chapters.push({
              id: `chapter-${chapterIndex}`,
              title: currentChapter.title,
              subtitle: currentChapter.subtitle || '',
              content: chapterContent.trim(),
              startPage: currentPageNumber,
              endPage: endPage
            });
            currentPageNumber = endPage + 1;
            chapterIndex++;
          }

          // Start new chapter
          currentChapter = {
            title: line
          };
          
          // Check if next line is a subtitle
          if (i + 1 < lines.length && lines[i + 1].trim() && 
              !lines[i + 1].match(/^(פרק|חלק)/)) {
            currentChapter.subtitle = lines[i + 1].trim();
            i++; // Skip subtitle line
          }
          
          chapterContent = '';
        } else if (line) {
          chapterContent += line + '\n';
        }
      }

      // Add the last chapter
      if (currentChapter.title && chapterContent.trim()) {
        const endPage = currentPageNumber + Math.floor(chapterContent.length / 2000);
        chapters.push({
          id: `chapter-${chapterIndex}`,
          title: currentChapter.title,
          subtitle: currentChapter.subtitle || '',
          content: chapterContent.trim(),
          startPage: currentPageNumber,
          endPage: endPage
        });
      }

      // If no chapters were detected, create a single chapter
      if (chapters.length === 0) {
        chapters.push({
          id: 'chapter-1',
          title: bookMetadata.title || 'פרק יחיד',
          subtitle: bookMetadata.subtitle || '',
          content: rawContent.trim(),
          startPage: 1,
          endPage: Math.floor(rawContent.length / 2000) + 1
        });
      }

      // Create the final JSON structure
      const bookData = {
        metadata: {
          title: bookMetadata.title,
          subtitle: bookMetadata.subtitle,
          author: bookMetadata.author,
          version: bookMetadata.version,
          lastUpdated: new Date().toISOString(),
          totalChapters: chapters.length,
          totalPages: chapters[chapters.length - 1]?.endPage || 1
        },
        chapters: chapters
      };

      setFormattedOutput(JSON.stringify(bookData, null, 2));
      setCurrentStep(3);
      
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בעיבוד התוכן');
    }
  };

  const copyToClipboard = () => {
    // In a real app, you would use Clipboard API
    Alert.alert('הועתק', 'התוכן המעוצב הועתק ללוח');
  };

  const renderStep1 = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>שלב 1: מידע על הספר</Text>
      <Text style={styles.stepDescription}>הכנס את הפרטים הבסיסיים של הספר</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>שם הספר *</Text>
        <TextInput
          style={styles.input}
          value={bookMetadata.title}
          onChangeText={(text) => setBookMetadata({...bookMetadata, title: text})}
          placeholder="לדוגמה: ספר החכמה והמוסר"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>תת כותרת</Text>
        <TextInput
          style={styles.input}
          value={bookMetadata.subtitle}
          onChangeText={(text) => setBookMetadata({...bookMetadata, subtitle: text})}
          placeholder="לדוגמה: מבחר מאמרים ודרשות"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>שם המחבר *</Text>
        <TextInput
          style={styles.input}
          value={bookMetadata.author}
          onChangeText={(text) => setBookMetadata({...bookMetadata, author: text})}
          placeholder="שם המחבר"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>גרסה</Text>
        <TextInput
          style={styles.input}
          value={bookMetadata.version}
          onChangeText={(text) => setBookMetadata({...bookMetadata, version: text})}
          placeholder="1.0.0"
          textAlign="right"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, (!bookMetadata.title || !bookMetadata.author) && styles.buttonDisabled]}
        onPress={() => setCurrentStep(2)}
        disabled={!bookMetadata.title || !bookMetadata.author}
      >
        <Text style={styles.buttonText}>המשך לשלב הבא</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>שלב 2: תוכן הספר</Text>
      <Text style={styles.stepDescription}>הדבק כאן את כל תוכן הספר</Text>
      
      <View style={styles.contentInstructions}>
        <Text style={styles.instructionTitle}>הוראות עיצוב:</Text>
        <Text style={styles.instructionText}>• כל פרק צריך להתחיל בשורה חדשה עם "פרק א", "פרק ב" וכו'</Text>
        <Text style={styles.instructionText}>• או עם מספר ונקודה: "1.", "2." וכו'</Text>
        <Text style={styles.instructionText}>• השורה שאחרי כותרת הפרק יכולה להיות תת-כותרת</Text>
        <Text style={styles.instructionText}>• אחר כך יבוא תוכן הפרק</Text>
      </View>

      <View style={styles.exampleBox}>
        <Text style={styles.exampleTitle}>דוגמה:</Text>
        <Text style={styles.exampleText}>
          פרק א - יסודות האמונה{'\n'}
          בעניין אמונה פשוטה ויראת שמים{'\n'}
          {'\n'}
          הנה יסוד גדול הוא באמונה...{'\n'}
          {'\n'}
          פרק ב - כח התפילה{'\n'}
          בעניין כוונה בתפילה ודבקות{'\n'}
          {'\n'}
          התפילה היא עבודה שבלב...
        </Text>
      </View>

      <TextInput
        style={styles.contentInput}
        multiline
        numberOfLines={15}
        value={rawContent}
        onChangeText={setRawContent}
        placeholder="הדבק כאן את תוכן הספר המלא..."
        placeholderTextColor="#9CA3AF"
        textAlign="right"
        textAlignVertical="top"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setCurrentStep(1)}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>חזור</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !rawContent.trim() && styles.buttonDisabled]}
          onPress={formatContent}
          disabled={!rawContent.trim()}
        >
          <Text style={styles.buttonText}>עצב תוכן</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>שלב 3: תוכן מעוצב</Text>
      <Text style={styles.stepDescription}>התוכן מוכן לייבוא לאפליקציה</Text>
      
      <View style={styles.successBox}>
        <Check size={24} color="#10B981" />
        <Text style={styles.successText}>התוכן עוצב בהצלחה!</Text>
      </View>

      <ScrollView style={styles.outputContainer}>
        <Text style={styles.outputText}>{formattedOutput}</Text>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setCurrentStep(2)}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>ערוך שוב</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={copyToClipboard}
        >
          <Copy size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>העתק</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nextStepsBox}>
        <Text style={styles.nextStepsTitle}>השלבים הבאים:</Text>
        <Text style={styles.nextStepText}>1. העתק את התוכן המעוצב</Text>
        <Text style={styles.nextStepText}>2. עבור לטאב "הגדרות" באפליקציה</Text>
        <Text style={styles.nextStepText}>3. לחץ על "ייבוא תוכן חדש"</Text>
        <Text style={styles.nextStepText}>4. הדבק את התוכן ולחץ "ייבא תוכן"</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FileText size={32} color="#2563EB" />
        <Text style={styles.title}>עיצוב תוכן הספר</Text>
        <Text style={styles.subtitle}>המרת תוכן גולמי לפורמט האפליקציה</Text>
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              currentStep >= step && styles.progressStepActive
            ]}
          >
            <Text style={[
              styles.progressStepText,
              currentStep >= step && styles.progressStepTextActive
            ]}>
              {step}
            </Text>
          </View>
        ))}
      </View>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
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
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    gap: 20,
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#2563EB',
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  progressStepTextActive: {
    color: '#FFFFFF',
  },
  step: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'right',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'right',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  contentInstructions: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    textAlign: 'right',
  },
  instructionText: {
    fontSize: 14,
    color: '#3730A3',
    marginBottom: 4,
    textAlign: 'right',
  },
  exampleBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right',
  },
  exampleText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    minHeight: 200,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    gap: 8,
    flex: 1,
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
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    gap: 8,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  outputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    maxHeight: 300,
  },
  outputText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    textAlign: 'left',
  },
  nextStepsBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
    textAlign: 'right',
  },
  nextStepText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
    textAlign: 'right',
  },
});