import type { ProductService } from './services/ProductService';

export type Language = 'en' | 'ja';

export interface BaseConfig {
  lang: Language;
  adultContent: boolean;
}

export interface BoothPmPath {
  baseUrl: string;
  productEndpoints: {
    search: string;
    listItems: string;
    getById: string;
  };
  authEndpoints: AuthEndpoints;
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
  product: ProductService;
  authenticator: AuthentificationController;
}
