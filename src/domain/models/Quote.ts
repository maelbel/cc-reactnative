export interface QuoteRequest {
  fullName: string;
  email: string;
  phone?: string;
  trainingTitle: string;
  trainingSlug: string;
  message?: string;
}
