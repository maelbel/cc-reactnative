import { validateQuoteForm, QuoteFormValues } from '../../src/domain/services/quoteValidation';
import { ValidationError } from '../../src/shared/errors/AppError';

const validValues: QuoteFormValues = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+33 6 12 34 56 78',
  message: 'Je souhaite un devis pour un groupe de 5 personnes.',
};

function captureValidationError(values: QuoteFormValues): ValidationError {
  try {
    validateQuoteForm(values);
  } catch (error) {
    if (error instanceof ValidationError) return error;
    throw error;
  }
  throw new Error('expected validateQuoteForm to throw a ValidationError');
}

describe('validateQuoteForm', () => {
  it('accepts a fully valid form without throwing', () => {
    expect(() => validateQuoteForm(validValues)).not.toThrow();
  });

  it('accepts an optional phone left empty', () => {
    expect(() => validateQuoteForm({ ...validValues, phone: '' })).not.toThrow();
  });

  it('rejects a missing name', () => {
    const error = captureValidationError({ ...validValues, fullName: '   ' });
    expect(error.fieldErrors.fullName).toBeDefined();
  });

  it('rejects a malformed email', () => {
    const error = captureValidationError({ ...validValues, email: 'not-an-email' });
    expect(error.fieldErrors.email).toBeDefined();
  });

  it('rejects an implausible phone number when one is provided', () => {
    const error = captureValidationError({ ...validValues, phone: 'abc' });
    expect(error.fieldErrors.phone).toBeDefined();
  });

  it('reports every invalid field at once', () => {
    const error = captureValidationError({ fullName: '', email: 'bad', phone: '', message: '' });
    expect(Object.keys(error.fieldErrors).sort()).toEqual(['email', 'fullName']);
  });
});
