import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainingListScreen } from '../../src/features/trainings/list/TrainingListScreen';
import { trainingApi } from '../../src/api/trainingApi';
import { NetworkError } from '../../src/shared/errors/AppError';
import { RootStackParamList } from '../../src/navigation/types';

jest.mock('../../src/api/trainingApi');

const mockedTrainingApi = trainingApi as jest.Mocked<typeof trainingApi>;

const Stack = createNativeStackNavigator<RootStackParamList>();

// `render` from @testing-library/react-native v14 is asynchronous — it must
// be awaited before the `screen` singleton (or any query) is usable.
async function renderScreen() {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TrainingList" component={TrainingListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

describe('TrainingListScreen', () => {
  afterEach(() => jest.resetAllMocks());

  it('renders the fetched trainings once loading completes', async () => {
    mockedTrainingApi.listTrainings.mockResolvedValue([
      {
        slug: 'net-maui',
        title: '.NET MAUI',
        durationInDays: 5,
        shortDescriptionHtml: null,
        price: { standard: 3275, custom: null, remote: null },
      },
    ]);

    await renderScreen();

    await waitFor(() => expect(screen.getByText('.NET MAUI')).toBeTruthy());
    expect(mockedTrainingApi.listTrainings).toHaveBeenCalledTimes(1);
  });

  it('shows the error view with a retry action when the fetch fails, and recovers on retry', async () => {
    mockedTrainingApi.listTrainings.mockRejectedValueOnce(new NetworkError());

    await renderScreen();

    await waitFor(() => expect(screen.getByTestId('error-view')).toBeTruthy());

    mockedTrainingApi.listTrainings.mockResolvedValueOnce([]);
    fireEvent.press(screen.getByText('Réessayer'));

    await waitFor(() => expect(mockedTrainingApi.listTrainings).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByTestId('error-view')).toBeNull());
  });
});
