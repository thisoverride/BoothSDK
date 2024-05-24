// import type { HttpResponse } from '../ControllerInterface';

export interface ProductService {
  getItems: () => Promise<HttpResponse>;
  extractItemDetail: (itemId: string) => Promise<HttpResponse>;
  searchProduct: (qurey: string) => Promise<HttpResponse>;
}
