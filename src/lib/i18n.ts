export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Header
    title: 'Galerie de Téléphones',
    subtitle: 'Un voyage à travers l\'histoire mobile',
    admin: 'Administration',

    // Tabs
    gallery: 'Galerie',
    stats: 'Statistiques',

    // Loading & Errors
    loading: 'Chargement de la galerie...',
    error: 'Erreur',

    // Phone Card
    owned: 'Possédé',
    current: 'Actuel',
    kept: 'Conservé',
    present: 'Actuellement',

    // Admin
    adminPanel: 'Panneau d\'Administration',
    manageCollection: 'Gérez votre collection de téléphones',
    backToGallery: 'Retour à la Galerie',
    addNewPhone: 'Ajouter un Téléphone',
    editPhone: 'Modifier le Téléphone',
    brand: 'Marque',
    brandPlaceholder: 'Apple, Samsung, etc.',
    modelName: 'Nom du Modèle',
    modelPlaceholder: 'iPhone 16 Pro',
    yearStart: 'Année de Début',
    yearEnd: 'Année de Fin (vide si actuel)',
    yearEndPlaceholder: 'Laissez vide si toujours utilisé',
    phoneImage: 'Image du Téléphone',
    liked: 'Aimé',
    stillOwn: 'Toujours Possédé',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce téléphone ?',

    // Statistics
    statistics: 'Statistiques',
    totalPhones: 'Total de Téléphones',
    currentPhone: 'Téléphone Actuel',
    phonesKept: 'Téléphones Conservés',
    averageOwnership: 'Durée Moyenne de Possession',
    years: 'ans',
    brandDistribution: 'Répartition par Marque',
    brandLoyalty: 'Fidélité aux Marques',
    mostLikedBrand: 'Marque Préférée',
    mostDislikedBrand: 'Marque Moins Appréciée',
    phones: 'téléphones',
    timelineEvolution: 'Évolution Temporelle',
    preferences: 'Préférences',
    likedPhones: 'Téléphones Aimés',
    dislikedPhones: 'Téléphones Non Aimés',
  },
  en: {
    // Header
    title: 'Phone Gallery',
    subtitle: 'A journey through mobile history',
    admin: 'Admin',

    // Tabs
    gallery: 'Gallery',
    stats: 'Statistics',

    // Loading & Errors
    loading: 'Loading phone gallery...',
    error: 'Error',

    // Phone Card
    owned: 'Owned',
    current: 'Current',
    kept: 'Kept',
    present: 'Present',

    // Admin
    adminPanel: 'Admin Panel',
    manageCollection: 'Manage your phone collection',
    backToGallery: 'Back to Gallery',
    addNewPhone: 'Add New Phone',
    editPhone: 'Edit Phone',
    brand: 'Brand',
    brandPlaceholder: 'Apple, Samsung, etc.',
    modelName: 'Model Name',
    modelPlaceholder: 'iPhone 16 Pro',
    yearStart: 'Year Start',
    yearEnd: 'Year End (leave empty if current)',
    yearEndPlaceholder: 'Leave empty if still using',
    phoneImage: 'Phone Image',
    liked: 'Liked',
    stillOwn: 'Still Own It',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this phone?',

    // Statistics
    statistics: 'Statistics',
    totalPhones: 'Total Phones',
    currentPhone: 'Current Phone',
    phonesKept: 'Phones Kept',
    averageOwnership: 'Average Ownership Duration',
    years: 'years',
    brandDistribution: 'Brand Distribution',
    brandLoyalty: 'Brand Loyalty',
    mostLikedBrand: 'Most Liked Brand',
    mostDislikedBrand: 'Most Disliked Brand',
    phones: 'phones',
    timelineEvolution: 'Timeline Evolution',
    preferences: 'Preferences',
    likedPhones: 'Liked Phones',
    dislikedPhones: 'Disliked Phones',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;
