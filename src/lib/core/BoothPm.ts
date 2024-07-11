import type { BaseConfig, Config } from '../@types/BoothSDK';
import type { CollectionBoothProduct, DownloadableData, DownloadStats, ListingFilter } from '../@types/services/ProductService';
import ProductServiceImpl from '../domain/services/ProductServiceImpl';
// import * as bootConfig from '../core/conf/sdk.booth.config.json';
import HttpClient from './api/HttpClient';

export default class BoothPm {
  private readonly _client: HttpClient;
  private readonly _productService: ProductServiceImpl;

  constructor (config: BaseConfig) {
    this._client = new HttpClient(this._setBaseConfig(config));
    this._productService = new ProductServiceImpl(this._client);
  }

  public async listProducts (index?: number, filterOn?: ListingFilter): Promise<CollectionBoothProduct> {
    return await this._productService.listProducts(index, filterOn);
  }

  public async getProduct (productId: number): Promise<any> {
    return await this._productService.getProduct(productId);
  }

  public async search (term: string, filterOn?: ListingFilter): Promise<CollectionBoothProduct> {
    return await this._productService.search(term, filterOn);
  }

  public async save (downloadableData: DownloadableData): Promise<DownloadStats> {
    return await this._productService.download(downloadableData);
  }

  private _setBaseConfig (conf: BaseConfig): Config {
    if (conf.lang !== 'ja' && conf.lang !== 'en') {
      throw new Error('This language is not supported.');
    }
    return {
      lang: conf.lang,
      headers: { Cookie: conf.adultContent ? 'adult=t' : '' }
    };
  }
}
