import type { AgeRestriction, ListFilter, ProductCategory } from '../../utils/Utils';
import type { BoothProductOverview } from './dto/Dto';

/**
 * Represents a downloadable item with an optional path.
 */
export interface DownloadableData {
  /**
   * The optional path where the downloadable item can be found.
   */
  path?: string;

  /**
   * The booth product item associated with the download.
   */
  boothProduct: Boothproduct;
}

/**
 * Represents a collection of booth products.
 *
 */
export interface CollectionBoothProduct {
  /**
   * The count of items in the collection.
   * @type {number}
   */
  totalPage: number;

  /**
   * An array of booth products.
   * @type {BoothProductOverview[]}
   */
  items: BoothProductOverview[];
}

/**
 * Represents download statistics.
 * @interface
 */
export interface DownloadStats {
  /**
   * The number of successful downloads.
   * @type {number}
   */
  successfulDownloads: number;

  /**
   * The number of failed downloads.
   * @type {number}
   */
  failedDownloads: number;
}

/**
 * Represents endpoints for product operations.
 * @interface
 */
export interface ProductEndpoints {
  /**
   * Endpoint for searching products.
   * @type {string}
   */
  search: string;

  /**
   * Endpoint for listing items.
   * @type {string}
   */
  listItems: string;

  /**
   * Endpoint for getting a product by ID.
   * @type {string}
   */
  getById: string;
}

// type ListFilter = 'New' | 'Popularity' | 'Loves';

export interface ProductSearchFilter {
  sortBy?: ListFilter;
  category?: ProductCategory;
  ageRestriction?: AgeRestriction;
}
