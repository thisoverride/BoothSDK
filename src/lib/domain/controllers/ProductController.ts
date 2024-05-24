import type ProductServiceImpl from '../services/ProductServiceImpl';
import type { Downloadable, ProductController } from '../../controller/ProductController';

export default class ProductControllerImpl implements ProductController {
  private readonly _productService: ProductServiceImpl;

  constructor (productService: ProductServiceImpl) {
    this._productService = productService;
  }

  public async listItems (pageIndex?: number): Promise<any> {
    try {
      const pageNumber: number = pageIndex ?? 0;
      const listProducts = await this._productService.getItems(pageNumber);
      return listProducts;
    } catch (error: any) {
      console.log(error);
    }
  }

  public async getItem (productID: number): Promise<any> {
    try {
      const product = await this._productService.getItem(productID);
      return product;
    } catch (error: any) {
      console.log(error);
    }
  }

  public async searchProducts (term: string): Promise<any> {
    try {
      const itemSearch = await this._productService.searchProduct(term);
      return itemSearch;
    } catch (error: any) {
      console.log(error);
    }
  }

  public async download (boothProduct: Downloadable): Promise<any> {
    try {
      const result = await this._productService.downloadProduct(boothProduct);
      return result;
    } catch (error: any) {
      console.log(error);
    }
  }
}
