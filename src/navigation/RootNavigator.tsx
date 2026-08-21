import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TrainingListScreen } from '../features/trainings/list/TrainingListScreen';
import { TrainingDetailScreen } from '../features/trainings/detail/TrainingDetailScreen';
import { QuoteFormScreen } from '../features/quote/QuoteFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Liste -> Détail -> Devis, the three screens required by the brief. */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TrainingList">
        <Stack.Screen name="TrainingList" component={TrainingListScreen} options={{ title: 'Catalogue de formations' }} />
        <Stack.Screen
          name="TrainingDetail"
          component={TrainingDetailScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen name="Quote" component={QuoteFormScreen} options={{ title: 'Demande de devis' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
