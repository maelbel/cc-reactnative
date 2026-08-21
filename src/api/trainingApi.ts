import { ENV } from '../config/env';
import { HttpError, NotFoundError, toAppError } from '../shared/errors/AppError';
import { Training, TrainingDetail } from '../domain/models/Training';
import { mapTrainingDetail, mapTrainingListItem } from '../domain/mappers/trainingMapper';
import { TrainingDetailDTO, TrainingListItemDTO } from './dto/TrainingDTO';
import { httpClient } from './httpClient';

/**
 * Repository abstraction for trainings. Screens/hooks depend on this
 * interface, not on `httpClient` or the DTO shapes directly — this is the
 * seam that keeps the "no local caching of the catalog" requirement easy
 * to honour (nothing here ever writes to disk) and that would let a test
 * double replace the network call without touching any UI code.
 */
export interface TrainingRepository {
  listTrainings(): Promise<Training[]>;
  getTrainingDetail(slug: string): Promise<TrainingDetail>;
}

class DawanTrainingApi implements TrainingRepository {
  async listTrainings(): Promise<Training[]> {
    try {
      const dtos = await httpClient.get<TrainingListItemDTO[]>(`${ENV.TRAINING_API_BASE_URL}/`);
      return dtos.map(mapTrainingListItem);
    } catch (error) {
      throw toAppError(error);
    }
  }

  async getTrainingDetail(slug: string): Promise<TrainingDetail> {
    try {
      const dto = await httpClient.get<TrainingDetailDTO>(`${ENV.TRAINING_API_BASE_URL}/show/${encodeURIComponent(slug)}`);
      return mapTrainingDetail(dto);
    } catch (error) {
      const appError = toAppError(error);
      if (appError instanceof HttpError && appError.status === 404) {
        throw new NotFoundError(`La formation "${slug}"`);
      }
      throw appError;
    }
  }
}

export const trainingApi: TrainingRepository = new DawanTrainingApi();
