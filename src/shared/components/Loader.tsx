import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface Props {
  label?: string;
}

/** Full-space loading indicator, reused by every screen with async data. */
export function Loader({ label = 'Chargement…' }: Props) {
  return (
    <View style={styles.container} testID="loader">
      <ActivityIndicator size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  label: { color: '#555', marginTop: 8 },
});
