import AuthentificationServiceImpl from '../domain/services/AuthentificationServiceImpl';
import ProductServiceImpl from '../domain/services/ProductServiceImpl';
import axios, { type CreateAxiosDefaults, type AxiosInstance } from 'axios';
import * as bootConfig from '../core/conf/sdk.booth.config.json';
import type { BoothSDK, AuthEndpoints, BaseConfig, BoothPmPath, ProductEndpoints } from '../@types/BoothSDK';
import type { ProductService } from '../@types/services/ProductService';
import type { AuthentificationService } from '../@types/services/AuthentificationService';

export default class BoothSDKImpl implements BoothSDK {
  private readonly _client: AxiosInstance;
  public readonly product: ProductService;
  public readonly authenticator: AuthentificationService;

  constructor (config: BaseConfig) {
    this._client = axios.create(BoothSDKImpl.setBaseConfig(config));
    const confPath: BoothPmPath = bootConfig.apiEndpoints;
    const PATH_AUTH: AuthEndpoints = confPath.authEndpoints;
    const PATH_PRODUCT: ProductEndpoints = confPath.productEndpoints;

    this.authenticator = new AuthentificationServiceImpl(PATH_AUTH, this._client);
    this.product = new ProductServiceImpl(PATH_PRODUCT, this._client);
  }

  private static setBaseConfig (conf: BaseConfig): CreateAxiosDefaults<BaseConfig> {
    let url: string;
    switch (conf.lang) {
      case 'en':
      case 'ja':
        url = conf.lang;
        break;
      default:
        throw new Error('This language is not supported.');
    }
    return {
      baseURL: bootConfig.apiEndpoints.baseUrl + url,
      headers: { Cookie: conf.adultContent ? 'adult=t' : '' }
    };
  }
}
