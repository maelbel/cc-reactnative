import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  /** Email address the requester gave, shown back to them as reassurance. */
  email: string;
  trainingTitle: string;
  onDone: () => void;
}

/**
 * Confirmation shown once a quote request has been sent.
 *
 * It is rendered in the screen itself rather than through `Alert.alert`,
 * because React Native Web turns `Alert.alert` into a no-op: an in-screen
 * view gives the same feedback on iOS, Android and web.
 */
export function QuoteSentView({ email, trainingTitle, onDone }: Props) {
  return (
    <View style={styles.container} testID="quote-sent">
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>✓</Text>
      </View>
      <Text style={styles.title}>Demande envoyée</Text>
      <Text style={styles.message}>
        Votre demande de devis pour « {trainingTitle} » a bien été transmise.
      </Text>
      <Text style={styles.message}>Nous vous répondrons à l’adresse {email}.</Text>
      <Pressable style={styles.button} onPress={onDone} accessibilityRole="button" testID="quote-sent-done">
        <Text style={styles.buttonText}>Retour au catalogue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  badge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeIcon: { color: 'white', fontSize: 40, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700' },
  message: { color: '#555', textAlign: 'center' },
  button: { marginTop: 16, backgroundColor: '#1d4ed8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: '700' },
});
