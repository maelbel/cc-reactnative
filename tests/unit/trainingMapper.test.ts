import { mapTrainingDetail, mapTrainingListItem } from '../../src/domain/mappers/trainingMapper';
import { TrainingDetailDTO, TrainingListItemDTO } from '../../src/api/dto/TrainingDTO';

describe('mapTrainingListItem', () => {
  it('maps a full DTO to the domain model', () => {
    const dto: TrainingListItemDTO = {
      title: '.NET MAUI',
      slug: 'net-maui',
      duration: '5',
      description: '<p>Overview</p>',
      standardPrice: 3275,
      customPrice: 975,
      remotelyPrice: 3275,
    };

    expect(mapTrainingListItem(dto)).toEqual({
      slug: 'net-maui',
      title: '.NET MAUI',
      durationInDays: 5,
      shortDescriptionHtml: '<p>Overview</p>',
      price: { standard: 3275, custom: 975, remote: 3275 },
    });
  });

  it('falls back to null for missing/invalid fields instead of throwing', () => {
    const dto: TrainingListItemDTO = { title: 'Sans détails', slug: 'sans-details' };

    const result = mapTrainingListItem(dto);

    expect(result.durationInDays).toBeNull();
    expect(result.shortDescriptionHtml).toBeNull();
    expect(result.price).toEqual({ standard: null, custom: null, remote: null });
  });

  it('treats a non-numeric duration as null rather than NaN', () => {
    const dto: TrainingListItemDTO = { title: 'x', slug: 'x', duration: 'n/a' };

    expect(mapTrainingListItem(dto).durationInDays).toBeNull();
  });
});

describe('mapTrainingDetail', () => {
  it('extends the list mapping with detail-only fields', () => {
    const dto: TrainingDetailDTO = {
      id: 101704,
      title: '.NET MAUI',
      slug: 'net-maui',
      duration: '5',
      plan: '<h2>Programme</h2>',
      audience: 'Développeurs C#',
      objectives: 'Découvrir MAUI',
      prerequisites: 'C#, XML',
      reference: 'DÉV101704-F',
      page: { title: 'Développement mobile', slug: 'dev-mobile' },
    };

    const result = mapTrainingDetail(dto);

    expect(result.id).toBe(101704);
    expect(result.planHtml).toBe('<h2>Programme</h2>');
    expect(result.audience).toBe('Développeurs C#');
    expect(result.category).toEqual({ title: 'Développement mobile', slug: 'dev-mobile' });
  });

  it('returns a null category when the API sends no parent page', () => {
    const dto: TrainingDetailDTO = { id: 1, title: 'x', slug: 'x' };

    expect(mapTrainingDetail(dto).category).toBeNull();
  });
});
