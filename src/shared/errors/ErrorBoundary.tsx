import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface State {
  error: Error | null;
}

/**
 * Catches rendering errors that slip past the per-screen `AppError`
 * handling (e.g. a genuine bug rather than an expected network/validation
 * failure), so the app shows a recovery screen instead of a blank crash.
 * Wraps the whole navigation tree in `App.tsx`.
 */
export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real project this would forward to a crash-reporting service
    // (e.g. Sentry). Logged here so it's visible during development/demo.
    console.error('Unhandled render error', error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>L'application a rencontré un problème</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          <Pressable style={styles.button} onPress={this.reset} accessibilityRole="button">
            <Text style={styles.buttonText}>Revenir en arrière</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  message: { color: '#555', textAlign: 'center' },
  button: { marginTop: 16, backgroundColor: '#1d4ed8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
});
