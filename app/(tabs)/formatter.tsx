import { View, StyleSheet } from 'react-native';
import BookContentFormatter from '@/components/BookContentFormatter';

export default function FormatterScreen() {
  return (
    <View style={styles.container}>
      <BookContentFormatter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});