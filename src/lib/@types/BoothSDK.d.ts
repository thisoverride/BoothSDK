export type Language = 'en' | 'ja';

export interface BaseConfig {
  lang: Language;
}

export interface Headers {
  Cookie: string;
}
export interface Config {
  lang: string;
}

export interface IBoothSDK {
  /**
   * Lists products with optional pagination and filtering.
   * @param {number} [index] - The page index for pagination.
   * @param {ListingFilter} [filterOn] - Filter to apply to the product listing.
   * @returns {Promise<CollectionBoothProduct>} - A promise that resolves to a collection of booth products.
   */
  listProducts: (index: number, filterOn?: ListingFilter) => Promise<CollectionBoothProduct>;

  /**
   * Retrieves details of a specific product by its ID.
   * @param {number} productId - The ID of the product to retrieve.
   * @returns {Promise<BoothProduct>} - A promise that resolves to the product details.
   */
  getProduct: (productId: number) => Promise<BoothProduct>;

  /**
   * Searches for products based on a search term and optional filtering.
   * @param {string} term - The search term to use.
   * @param {ListingFilter} [filterOn] - Filter to apply to the search results.
   * @returns {Promise<CollectionBoothProduct>} - A promise that resolves to a collection of search results.
   */
  find: (term: string, filterOn?: ListingFilter) => Promise<CollectionBoothProduct>;

  /**
   * Saves downloadable data for a specified product.
   * @param {DownloadableData} downloadableData - The data to be downloaded.
   * @returns {Promise<DownloadStats>} - A promise that resolves to download statistics.
   */
  save: (downloadableData: DownloadableData) => Promise<DownloadStats>;
}
