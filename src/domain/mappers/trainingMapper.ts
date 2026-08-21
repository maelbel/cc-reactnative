import { TrainingDetailDTO, TrainingListItemDTO } from '../../api/dto/TrainingDTO';
import { Training, TrainingDetail, TrainingPrice } from '../models/Training';

function toPrice(dto: TrainingListItemDTO): TrainingPrice {
  return {
    standard: dto.standardPrice ?? null,
    custom: dto.customPrice ?? null,
    remote: dto.remotelyPrice ?? null,
  };
}

function toDurationInDays(duration?: string): number | null {
  if (!duration) return null;
  const parsed = Number.parseInt(duration, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function mapTrainingListItem(dto: TrainingListItemDTO): Training {
  return {
    slug: dto.slug,
    title: dto.title,
    durationInDays: toDurationInDays(dto.duration),
    shortDescriptionHtml: dto.description ?? null,
    price: toPrice(dto),
  };
}

export function mapTrainingDetail(dto: TrainingDetailDTO): TrainingDetail {
  return {
    ...mapTrainingListItem(dto),
    id: dto.id,
    planHtml: dto.plan ?? null,
    audience: dto.audience ?? null,
    objectives: dto.objectives ?? null,
    prerequisites: dto.prerequisites ?? null,
    reference: dto.reference ?? null,
    category: dto.page ? { title: dto.page.title, slug: dto.page.slug } : null,
  };
}
