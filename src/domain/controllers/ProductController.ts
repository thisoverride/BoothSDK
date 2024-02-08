import type { Response, Request } from 'express';
import { HttpResponse, type ControllerImpl } from '../../@types/ControllerInterface';
import type { AuthentificationService } from '../../@types/service/AuthentificationService';
import { ProductService } from '../../@types/service/ProductService';

export default class ProductController implements ControllerImpl {
  public readonly ROUTE: string[];
  private readonly _productService: ProductService;

  constructor (productService: ProductService) {
    this._productService = productService;
    this.ROUTE = [
      '@GET(/api/items,getItem)',
      '@GET(/api/detail-items/:id,getDetailItems)',
    ];
  }

  /**
   * @Mapping '@GET(/api/items)'
   * Render home page.
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @returns {void}
   */
  public async getItem (_request: Request, response: Response) {
    try {
      const serviceResponse = await this._productService.getItems()
       response.status(serviceResponse.status).json({ items: serviceResponse.message});
    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
  }

  public async getDetailItems (request: Request, response: Response) {
    try {
      const itemId = String(request.params.id);
      const serviceResponse = await this._productService.extractItemDetail(itemId)
       response.status(serviceResponse.status).json({ items: serviceResponse.message});
    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
  }

  public async findItems (request: Request, response: Response) {
    const qurey = request.body.qurey
    try {
      const serviceResponse = await this._productService.searchProduct(qurey);
       response.status(serviceResponse.status).json({ items: serviceResponse.message});
    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
  }
}
