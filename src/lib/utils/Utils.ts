import DirManager from './DirManager';

enum ListFilter {
  New = 'new',
  Popularity = 'popularity',
  Loves = 'wish_lists'
}

enum ProductCategory {
  COMICS = 'Comics',
  ILLUSTRATION = 'Illustration',
  NOVELS_AND_BOOKS = 'Novels & Books',
  GOODS = 'Goods',
  FASHION = 'Fashion',
  ACCESSORIES = 'Accessories',
  FIGURES_PLUSHIES_DOLLS = 'Figures & Plushies & Dolls',
  MODELS_3D = '3D Models',
  MUSIC = 'Music',
  AUDIO_GOODS = 'Audio Goods',
  GAMES = 'Games',
  SOFTWARE_HARDWARE = 'Software & Hardware',
  SOURCE_MATERIALS = 'Source Materials',
  VIDEO = 'Video',
  PHOTOGRAPHS = 'Photographs',
  COSPLAY = 'Cosplay',
  ARTS = 'Arts',
  ALL = 'All'
}

enum AgeRestriction {
  WITH_ADULT_CONTENT = 'include',
  ADULT_ONLY = 'only'
}

export { DirManager, ProductCategory, ListFilter, AgeRestriction };
