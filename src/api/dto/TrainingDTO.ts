/**
 * Shapes as actually returned by https://dawan.org/public/training/ and
 * https://dawan.org/public/training/show/{slug} (verified by inspecting
 * live responses while planning this project). Kept deliberately close to
 * the wire format — nothing here is "nice" for the UI, that's the job of
 * `domain/mappers/trainingMapper.ts`. Most fields are optional/nullable
 * because the API does not guarantee their presence on every training.
 */
export interface TrainingListItemDTO {
  title: string;
  slug: string;
  alias?: string;
  fullAlias?: string;
  path?: string;
  type?: 'shared' | 'poe' | 'other_cursus' | string;
  duration?: string;
  description?: string | null;
  standardPrice?: number | null;
  customPrice?: number | null;
  customPriceExtra?: number | null;
  remotelyPrice?: number | null;
  objectives?: string | null;
  prerequisites?: string | null;
  trainingOrder?: number;
  certification?: unknown;
}

export interface TrainingPageRefDTO {
  title: string;
  slug: string;
  alias?: string;
}

export interface TrainingDetailDTO extends TrainingListItemDTO {
  id: number;
  plan?: string | null;
  audience?: string | null;
  documentation?: string | null;
  reference?: string | null;
  commentForJobseeker?: string | null;
  page?: TrainingPageRefDTO | null;
  sessions?: unknown[];
  feedbacks?: unknown[];
  parents?: unknown[];
  satisfactionRate?: number | null;
  graduation_rate?: number | null;
  dropout_rate?: number | null;
  iscursus?: boolean;
  isccp?: boolean;
  isprodegree?: boolean;
  hideSecondaryMenu?: boolean;
}
