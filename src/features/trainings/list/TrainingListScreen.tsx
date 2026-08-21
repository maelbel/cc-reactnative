import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { trainingApi } from '../../../api/trainingApi';
import { useAsync } from '../../../shared/hooks/useAsync';
import { Loader } from '../../../shared/components/Loader';
import { ErrorView } from '../../../shared/components/ErrorView';
import { Training } from '../../../domain/models/Training';
import { TrainingListItem } from './TrainingListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'TrainingList'>;

/**
 * Home screen: fetches the catalog on every mount (no local persistence,
 * per the brief) and lets the user open a training's detail screen.
 */
export function TrainingListScreen({ navigation }: Props) {
  const { status, data: trainings, error, retry } = useAsync(() => trainingApi.listTrainings(), []);

  const openDetail = useCallback(
    (training: Training) => {
      navigation.navigate('TrainingDetail', { slug: training.slug, title: training.title });
    },
    [navigation]
  );

  if (status === 'loading') return <Loader label="Chargement du catalogue…" />;
  if (status === 'error') return <ErrorView error={error} onRetry={retry} />;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={trainings}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <TrainingListItem training={item} onPress={openDetail} />}
      testID="training-list"
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: 'white' },
  content: { paddingVertical: 12 },
});
