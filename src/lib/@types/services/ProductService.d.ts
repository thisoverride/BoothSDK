/**
 * Interface for the product service.
 */
export interface ProductService {
  /**
   * Retrieves items with pagination.
   * @param {number} page - The page number to retrieve.
   * @returns {Promise<CollectionBoothProduct>} A promise that resolves to a collection of booth products.
   */
  getListItems: (page: number) => Promise<CollectionBoothProduct>;

  /**
   * Retrieves a specific item by its product ID.
   * @param productID - The ID of the product to retrieve.
   * @returns A promise that resolves to the product details.
   */
  getItem: (productID: number) => Promise<BoothProductItem | null>;

  /**
   * Searches for products based on a search term.
   * @param term - The search term used to find products.
   * @returns A promise that resolves to the search results.
   */
  find: (term: string) => Promise<any>;

  /**
   * Downloads a specified product.
   * @param boothProduct - The product to download.
   * @returns A promise that resolves when the download is complete.
   */
  download: (boothProduct: Downloadable) => Promise<any>;
}

/**
 * Represents an item in the booth product catalog.
 */
export interface BoothProductItem {
  /**
   * The unique identifier for the product.
   */
  id: number;

  /**
   * The title of the product.
   */
  title: string;

  /**
   * A detailed description of the product.
   */
  detail: string;

  /**
   * An array of image URLs representing the product.
   */
  images: string[];

  /**
   * The name of the seller offering the product.
   */
  sellerName: string;

  /**
   * The URL of the seller's profile picture.
   */
  sellerPic: string;

  /**
   * An array of download information for the product.
   */
  downloadLinks: downloadDataInfo[];
}

/**
 * Represents a downloadable item with an optional path.
 */
export interface Downloadable {
  /**
   * The optional path where the downloadable item can be found.
   */
  path?: string;

  /**
   * The booth product item associated with the download.
   */
  boothProductItem: BoothProductItem;
}

/**
   * Represents the information required to download a specific item.
   */
export interface DownloadDataInfo {
  /**
   * The title of the downloadable item.
   */
  itemTitle: string;

  /**
   * The URL link to download the item.
   */
  itemLink: string;
}

/**
 * Represents a collection of booth products.
 *
 */
interface CollectionBoothProduct {
  /**
   * The count of items in the collection.
   * @type {number}
   */
  count: number;

  /**
   * An array of booth products.
   * @type {BoothProductI[]}
   */
  items: BoothProductI[];
}

/**
 * Represents download statistics.
 * @interface
 */
interface DownloadStats {
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
interface ProductEndpoints {
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
