import AuthentificationController from './domain/controllers/AuthentificationController';
import ProductController from './domain/controllers/ProductController';
import AuthentificationServiceImpl from './domain/services/AuthentificationServiceImpl';
import ProductServiceImpl from './domain/services/ProductServiceImpl';
import axios, { type CreateAxiosDefaults, type AxiosInstance } from 'axios';
import * as bootConfig from './core/conf/sdk.booth.config.json';

type Language = 'en' | 'ja';

interface BaseConfig {
  lang: Language;
  adulteContent: boolean;
}
interface BoothPmPath {
  baseUrl: string;
  productEndpoints: {
    search: string;
    listItems: string;
    getById: string;
  };
  authEndpoints: {
    signIn: string;
    meta: SdkConnect;
  };
}
interface SdkConnect {
  SDK_CONNECT: any[];
}
interface AuthEndpoints {
  meta: SdkConnect;
  signIn: string;
}
interface ProductEndpoints {
  search: string;
  listItems: string;
  getById: string;
};

export default class BoothSDK {
  private readonly _axios: AxiosInstance;
  public readonly product: ProductController;
  public readonly authenticator: AuthentificationController;

  constructor (config: BaseConfig) {
    this._axios = axios.create(BoothSDK.setBaseConfig(config));
    const bootConfigPath: BoothPmPath = bootConfig.apiEndpoints;
    const PATH_AUTH: AuthEndpoints = bootConfigPath.authEndpoints;
    const PATH_PRODUCT: ProductEndpoints = bootConfigPath.productEndpoints;

    this.authenticator = new AuthentificationController(
      new AuthentificationServiceImpl(PATH_AUTH, this._axios));
    this.product = new ProductController(new ProductServiceImpl(PATH_PRODUCT, this._axios));
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
