/**
 * Domain models used by the UI. Deliberately decoupled from the DTO
 * shapes: if the API renames/removes a field tomorrow, only the mapper
 * changes — screens and components never depend on the wire format
 * directly (dependency inversion between `features/*` and `api/*`).
 */
export interface Training {
  slug: string;
  title: string;
  durationInDays: number | null;
  shortDescriptionHtml: string | null;
  price: TrainingPrice;
}

export interface TrainingPrice {
  standard: number | null;
  custom: number | null;
  remote: number | null;
}

export interface TrainingDetail extends Training {
  id: number;
  planHtml: string | null;
  audience: string | null;
  objectives: string | null;
  prerequisites: string | null;
  reference: string | null;
  category: { title: string; slug: string } | null;
}
