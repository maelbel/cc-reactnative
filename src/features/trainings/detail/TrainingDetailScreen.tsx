import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { trainingApi } from '../../../api/trainingApi';
import { useAsync } from '../../../shared/hooks/useAsync';
import { Loader } from '../../../shared/components/Loader';
import { ErrorView } from '../../../shared/components/ErrorView';
import { PriceTag } from '../../../shared/components/PriceTag';

type Props = NativeStackScreenProps<RootStackParamList, 'TrainingDetail'>;

/** Detail screen for a single training, fetched by slug. */
export function TrainingDetailScreen({ route, navigation }: Props) {
  const { slug, title } = route.params;
  const { width } = useWindowDimensions();

  const { status, data: training, error, retry } = useAsync(() => trainingApi.getTrainingDetail(slug), [slug]);

  const askForQuote = useCallback(() => {
    navigation.navigate('Quote', { trainingSlug: slug, trainingTitle: title });
  }, [navigation, slug, title]);

  if (status === 'loading') return <Loader label="Chargement de la formation…" />;
  if (status === 'error') return <ErrorView error={error} onRetry={retry} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="training-detail">
      <Text style={styles.title}>{training.title}</Text>
      <View style={styles.metaRow}>
        <PriceTag price={training.price} />
        {training.durationInDays != null && <Text style={styles.duration}>{training.durationInDays} jour(s)</Text>}
      </View>

      {training.audience && <InfoBlock label="Public" text={training.audience} />}
      {training.prerequisites && <InfoBlock label="Prérequis" text={training.prerequisites} />}
      {training.objectives && <InfoBlock label="Objectifs" text={training.objectives} />}

      {training.shortDescriptionHtml && (
        <RenderHtml contentWidth={width - 32} source={{ html: training.shortDescriptionHtml }} />
      )}

      {training.planHtml && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programme</Text>
          <RenderHtml contentWidth={width - 32} source={{ html: training.planHtml }} />
        </View>
      )}

      <Pressable style={styles.cta} onPress={askForQuote} accessibilityRole="button" testID="ask-for-quote">
        <Text style={styles.ctaText}>Demander un devis</Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  duration: { color: '#666' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionText: { color: '#333' },
  cta: { marginTop: 24, backgroundColor: '#1d4ed8', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
