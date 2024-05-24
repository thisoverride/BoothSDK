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
interface Downloadable {
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
interface downloadDataInfo {
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
 * Interface for the ProductController.
 */
export interface ProductController {
  /**
   * Lists items with optional pagination.
   * @param pageIndex - The index of the page to retrieve.
   * @returns A promise that resolves to the list of items.
   */
  listItems: (pageIndex?: number) => Promise<any>;

  /**
   * Retrieves a specific item by its product ID.
   * @param productID - The ID of the product to retrieve.
   * @returns A promise that resolves to the product details.
   */
  getItem: (productID: number) => Promise<BoothProductItem>;

  /**
   * Searches for products based on a search term.
   * @param term - The search term used to find products.
   * @returns A promise that resolves to the search results.
   */
  searchProducts: (term: string) => Promise<any>;

  /**
   * Downloads a specified product.
   * @param boothProduct - The product to download.
   * @returns A promise that resolves when the download is complete.
   */
  download: (boothProduct: Downloadable) => Promise<any>;
}
