import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { quoteApi } from '../../api/quoteApi';
import { validateQuoteForm, QuoteFormValues } from '../../domain/services/quoteValidation';
import { toAppError, ValidationError } from '../../shared/errors/AppError';

type Props = NativeStackScreenProps<RootStackParamList, 'Quote'>;

const EMPTY_VALUES: QuoteFormValues = { fullName: '', email: '', phone: '', message: '' };

/**
 * Requirement 3: a form that requests a quote and sends an email.
 * Validation is delegated to `quoteValidation`, sending is delegated to
 * `quoteApi` — this screen only orchestrates state and rendering.
 */
export function QuoteFormScreen({ route, navigation }: Props) {
  const { trainingSlug, trainingTitle } = route.params;
  const [values, setValues] = useState<QuoteFormValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = useCallback(
    (field: keyof QuoteFormValues) => (text: string) => setValues((prev) => ({ ...prev, [field]: text })),
    []
  );

  const submit = useCallback(async () => {
    setSubmitError(null);
    try {
      validateQuoteForm(values);
    } catch (error) {
      if (error instanceof ValidationError) {
        setFieldErrors(error.fieldErrors);
        return;
      }
      throw error;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await quoteApi.sendQuoteRequest({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        message: values.message.trim() || undefined,
        trainingTitle,
        trainingSlug,
      });
      Alert.alert('Demande envoyée', 'Votre demande de devis a bien été transmise.', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (error) {
      setSubmitError(toAppError(error).message);
    } finally {
      setSubmitting(false);
    }
  }, [values, trainingTitle, trainingSlug, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.content} testID="quote-form">
      <Text style={styles.intro}>Demande de devis pour « {trainingTitle} »</Text>

      <Field label="Nom complet *" value={values.fullName} onChangeText={setField('fullName')} error={fieldErrors.fullName} testID="quote-fullName" />
      <Field label="Email *" value={values.email} onChangeText={setField('email')} error={fieldErrors.email} keyboardType="email-address" testID="quote-email" />
      <Field label="Téléphone" value={values.phone} onChangeText={setField('phone')} error={fieldErrors.phone} keyboardType="phone-pad" testID="quote-phone" />
      <Field label="Message" value={values.message} onChangeText={setField('message')} multiline testID="quote-message" />

      {submitError && <Text style={styles.submitError}>{submitError}</Text>}

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={submit}
        disabled={submitting}
        accessibilityRole="button"
        testID="quote-submit"
      >
        <Text style={styles.buttonText}>{submitting ? 'Envoi…' : 'Envoyer la demande'}</Text>
      </Pressable>
    </ScrollView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  testID?: string;
}

function Field({ label, value, onChangeText, error, multiline, keyboardType, testID }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        testID={testID}
      />
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 48 },
  intro: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  field: { marginBottom: 14 },
  label: { marginBottom: 4, color: '#333', fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: 'white' },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },
  fieldError: { color: '#c0392b', marginTop: 4, fontSize: 13 },
  submitError: { color: '#c0392b', marginBottom: 12 },
  button: { backgroundColor: '#1d4ed8', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
