import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuoteFormScreen } from '../../src/features/quote/QuoteFormScreen';
import { quoteApi } from '../../src/api/quoteApi';
import { NetworkError } from '../../src/shared/errors/AppError';
import { RootStackParamList } from '../../src/navigation/types';

jest.mock('../../src/api/quoteApi');

const mockedQuoteApi = quoteApi as jest.Mocked<typeof quoteApi>;

const Stack = createNativeStackNavigator<RootStackParamList>();

async function renderScreen() {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Quote"
          component={QuoteFormScreen}
          initialParams={{ trainingSlug: 'net-maui', trainingTitle: '.NET MAUI' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// RNTL v14 events are asynchronous too: each one must be awaited, otherwise
// state updates overlap and the form is submitted before it is filled.
async function fillValidForm() {
  await fireEvent.changeText(screen.getByTestId('quote-fullName'), 'Mael Belliard');
  await fireEvent.changeText(screen.getByTestId('quote-email'), 'mael@example.fr');
}

describe('QuoteFormScreen', () => {
  afterEach(() => jest.resetAllMocks());

  it('shows a confirmation with the requester email once the quote is sent', async () => {
    mockedQuoteApi.sendQuoteRequest.mockResolvedValue(undefined);

    await renderScreen();
    await fillValidForm();
    await fireEvent.press(screen.getByTestId('quote-submit'));

    await waitFor(() => expect(screen.getByTestId('quote-sent')).toBeTruthy());
    expect(screen.getByText('Demande envoyée')).toBeTruthy();
    expect(screen.getByText(/mael@example\.fr/)).toBeTruthy();
    expect(screen.queryByTestId('quote-form')).toBeNull();
  });

  it('keeps the form and shows the error when sending fails', async () => {
    mockedQuoteApi.sendQuoteRequest.mockRejectedValue(new NetworkError());

    await renderScreen();
    await fillValidForm();
    await fireEvent.press(screen.getByTestId('quote-submit'));

    await waitFor(() => expect(screen.getByText(/Impossible de contacter le serveur/)).toBeTruthy());
    expect(screen.queryByTestId('quote-sent')).toBeNull();
    expect(screen.getByTestId('quote-form')).toBeTruthy();
  });
});
