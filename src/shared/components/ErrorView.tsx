import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppError } from '../errors/AppError';

interface Props {
  error: AppError;
  onRetry?: () => void;
}

/**
 * Single place that turns an `AppError` into a user-facing message. Every
 * screen renders the same component for its error state instead of each
 * screen inventing its own copy/markup — this is what makes "Gestion des
 * exceptions" centralised rather than duplicated per screen.
 */
export function ErrorView({ error, onRetry }: Props) {
  return (
    <View style={styles.container} testID="error-view">
      <Text style={styles.title}>{titleFor(error)}</Text>
      <Text style={styles.message}>{error.message}</Text>
      {onRetry && (
        <Pressable style={styles.button} onPress={onRetry} accessibilityRole="button">
          <Text style={styles.buttonText}>Réessayer</Text>
        </Pressable>
      )}
    </View>
  );
}

function titleFor(error: AppError): string {
  switch (error.kind) {
    case 'network':
      return 'Problème de connexion';
    case 'http':
      return 'Erreur serveur';
    case 'validation':
      return 'Formulaire incomplet';
    default:
      return 'Oups';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 18, fontWeight: '600' },
  message: { color: '#555', textAlign: 'center' },
  button: { marginTop: 16, backgroundColor: '#1d4ed8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
});
