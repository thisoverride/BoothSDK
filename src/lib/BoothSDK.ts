import AuthentificationServiceImpl from './domain/services/AuthentificationServiceImpl';
import ProductServiceImpl from './domain/services/ProductServiceImpl';
import axios, { type CreateAxiosDefaults, type AxiosInstance } from 'axios';
import * as bootConfig from './core/conf/sdk.booth.config.json';

import type { BoothSDK, AuthEndpoints, BaseConfig, BoothPmPath, ProductEndpoints } from './@types/BoothSDK';
import type { AuthenticationController } from './controller/AuthentificationController';
import type { ProductController } from './controller/ProductController';
import ProductControllerImpl from './domain/controllers/ProductController';
import AuthenticationControllerImpl from './domain/controllers/AuthenticationControllerImpl';

export default class BoothSDKImpl implements BoothSDK {
  private readonly _axios: AxiosInstance;
  public readonly product: ProductController;
  public readonly authenticator: AuthenticationController;

  constructor (config: BaseConfig) {
    this._axios = axios.create(BoothSDKImpl.setBaseConfig(config));
    const confPath: BoothPmPath = bootConfig.apiEndpoints;
    const PATH_AUTH: AuthEndpoints = confPath.authEndpoints;
    const PATH_PRODUCT: ProductEndpoints = confPath.productEndpoints;

    this.authenticator = new AuthenticationControllerImpl(
      new AuthentificationServiceImpl(PATH_AUTH, this._axios));
    this.product = new ProductControllerImpl(new ProductServiceImpl(PATH_PRODUCT, this._axios));
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
      headers: { Cookie: conf.adulteContent ? 'adult=t' : '' }
    };
  }
}
