# Dawan Formations — client React Native

Application mobile (Expo + TypeScript) affichant le catalogue de formations Dawan et permettant de demander un devis. Réalisée dans le cadre du projet d'expertise *ME Expert IT — Applications Intelligentes et Big Data* (CC-AIBD-09).

## Fonctionnalités (exigences de l'énoncé)

1. **Liste des formations** — récupérée à chaque affichage depuis `GET https://dawan.org/public/training/` (aucun stockage local du catalogue).
2. **Détail d'une formation** — `GET https://dawan.org/public/training/show/{slug}`, atteint depuis la liste.
3. **Formulaire de demande de devis** — envoie un email à une adresse configurable (voir "Dette technique assumée" ci-dessous).
4. **Tests** — unitaires (Jest + React Native Testing Library) et fonctionnels (Maestro).

## Démarrage

```bash
npm install
npm start          # ouvre Expo Dev Tools ; scannez le QR code avec Expo Go, ou :
npm run android    # émulateur/appareil Android
npm run ios        # simulateur iOS (macOS uniquement)
npm run web        # version web (pratique pour un aperçu rapide)
```

Prérequis : Node.js 18+, et l'app [Expo Go](https://expo.dev/go) sur un appareil physique si vous ne voulez pas de simulateur.

## Tests

```bash
npm test           # tests unitaires (Jest)
npm run test:watch # mode watch
```

Tests fonctionnels (Maestro) :

```bash
# installer Maestro : https://maestro.mobile.dev/getting-started/installing-maestro
maestro test e2e/list-detail-quote.yaml
```

Le flow Maestro suppose que l'app tourne déjà (build de dev ou Expo Go) sur le simulateur/appareil ciblé.

## Architecture

```
src/
  config/        constantes (URL API, email cible, config EmailJS)
  api/           httpClient générique, trainingApi, quoteApi, DTOs
  domain/        modèles métier, mappers DTO -> domaine, validation
  features/      écrans par fonctionnalité (trainings/list, trainings/detail, quote)
  navigation/    React Navigation (stack Liste -> Détail -> Devis)
  shared/        composants UI, hooks (useAsync), gestion d'erreurs
tests/unit/      Jest + React Native Testing Library
e2e/             flow Maestro (fonctionnel/E2E)
```

Le détail des choix (couches, SOLID, tell-don't-ask, généricité) est expliqué dans le document de cadrage `plan-projet-reactnative-dawan.md`.

## Points clés pour la grille d'évaluation

- **Organisation des packages** : séparation stricte `api` (I/O) / `domain` (règles métier, indépendant de React Native) / `features` (UI) / `shared` (transverse).
- **Bonnes pratiques** : `httpClient.get<T>/post<T>` et le hook `useAsync<T>` sont génériques et réutilisés par toutes les requêtes/écrans ; les mappers isolent le domaine du contrat d'API (inversion de dépendance) ; les composants délèguent la logique aux services (`quoteValidation`, `trainingApi`) plutôt que de la réimplémenter (tell, don't ask).
- **Gestion des exceptions** : hiérarchie `AppError` (`NetworkError`, `HttpError`, `ValidationError`, `NotFoundError`) + `ErrorView` centralisé pour les écrans + `ErrorBoundary` au niveau racine pour les erreurs de rendu inattendues.
- **Documentation** : commentaires TSDoc sur les modules non triviaux (voir `httpClient.ts`, `useAsync.ts`, `quoteApi.ts`, etc.), qui expliquent le *pourquoi* d'un choix, pas seulement le *quoi*.

## Dette technique assumée

- **Envoi d'email** : `src/api/quoteApi.ts` utilise [EmailJS](https://www.emailjs.com), pensé pour être appelé depuis un client non fiable (clé publique embarquée dans l'app). C'est un compromis assumé pour respecter l'énoncé ("le formulaire envoie un email") sans backend dédié. Avant une mise en production réelle, remplacer par un vrai backend, ou par un simple `Linking.openURL('mailto:...')` si l'objectif est seulement de préparer l'envoi. Les identifiants EmailJS dans `src/config/env.ts` sont des placeholders à remplacer.
- **Pas de pagination** ni de tri/recherche côté client sur la liste des formations (hors périmètre de l'énoncé).
- **Pas de mode hors-ligne** : cohérent avec la contrainte explicite de ne pas stocker le catalogue localement.
- Un avertissement Jest bénin ("The current testing environment is not configured to support act(...)") peut apparaître sur certains tests asynchrones ; il n'affecte pas le résultat des tests (tous passent) et vient d'une interaction connue entre React 19 et l'environnement de test React Native le plus récent.
