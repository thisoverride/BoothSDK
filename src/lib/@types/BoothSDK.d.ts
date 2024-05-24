import { type ProductController } from '../controller/ProductController';

export type Language = 'en' | 'ja';

export interface BaseConfig {
  lang: Language;
  adulteContent: boolean;
}

export interface BoothPmPath {
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

export interface SdkConnect {
  SDK_CONNECT: any[];
}

export interface AuthEndpoints {
  meta: SdkConnect;
  signIn: string;
}

export interface ProductEndpoints {
  search: string;
  listItems: string;
  getById: string;
};

export interface BoothSDK {
  product: ProductController;
  authenticator: AuthentificationController;
}
