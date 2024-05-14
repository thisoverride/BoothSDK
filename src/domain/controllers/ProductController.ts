import type { Response, Request } from 'express';
import { HttpResponse, type ControllerImpl } from '../../@types/ControllerInterface';
import type { AuthentificationService } from '../../@types/service/AuthentificationService';
import { ProductService } from '../../@types/service/ProductService';
import ProductServiceImpl from '../services/ProductServiceImpl';

export default class ProductController implements ControllerImpl {
  public readonly ROUTE: string[];
  private readonly _productService: ProductServiceImpl;

  constructor (productService: ProductServiceImpl) {
    this._productService = productService;
    this.ROUTE = [
      '@GET(/api/v1/products, listItems)',
      '@GET(/api/v1/products/search, searchProducts)',
      '@GET(/api/v1/products/:id, getItem)',
    ];
  }

  /**
   * @Mapping '@GET(/api/items)'
   * Render home page.
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @returns {void}
   */
  public async listItems (request: Request, response: Response) {
    try {
      const pageNumber: number = request.query.page_number ? parseInt(String(request.query.page_number), 10) : 1;
      const serviceResponse = await this._productService.getItems(pageNumber);
       response.status(serviceResponse.status).json({ items: serviceResponse.message});
    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
  }

  public async getItem (request: Request, response: Response) {
    try {
      const itemId = String(request.params.id);
      const serviceResponse = await this._productService.getItem(Number(itemId))
       response.status(serviceResponse.status).json({ response: serviceResponse.message});
    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
  }

  public async searchProducts (request: Request, response: Response) {
    try {
      const term: string | null = request.query.term ? String(request.query.term) : null;
      const serviceResponse = await this._productService.searchProduct(term);
       response.status(serviceResponse.status).json({ items: serviceResponse.message});
    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
  }
}
