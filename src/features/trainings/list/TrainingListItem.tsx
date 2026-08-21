import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Training } from '../../../domain/models/Training';
import { PriceTag } from '../../../shared/components/PriceTag';

interface Props {
  training: Training;
  onPress: (training: Training) => void;
}

export function TrainingListItem({ training, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(training)}
      accessibilityRole="button"
      testID={`training-item-${training.slug}`}
    >
      <View style={styles.row}>
        <Text style={styles.title}>{training.title}</Text>
        <PriceTag price={training.price} />
      </View>
      {training.durationInDays != null && (
        <Text style={styles.duration}>{training.durationInDays} jour(s)</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f4f6fb',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  cardPressed: { opacity: 0.7 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', flexShrink: 1, marginRight: 8 },
  duration: { color: '#666', marginTop: 4 },
});
