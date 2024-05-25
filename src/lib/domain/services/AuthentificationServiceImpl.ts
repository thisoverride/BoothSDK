import { type AxiosInstance } from 'axios';
import puppeteer from 'puppeteer';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

interface credentials {
  email: string;
  password: string;
}

interface SdkConnect {
  SDK_CONNECT: any[];
}

interface AuthEndpoints {
  meta: SdkConnect;
  signIn: string;
}

export default class AuthentificationServiceImpl {
  private _client: AxiosInstance;
  private static PATH_AUTH: AuthEndpoints;

  constructor (bootConfigPaths: AuthEndpoints, axios: AxiosInstance) {
    AuthentificationServiceImpl.PATH_AUTH = bootConfigPaths;
    this._client = axios;
  }

  public sdkConnect (): void {
    const jar = new CookieJar();
    AuthentificationServiceImpl.PATH_AUTH.meta.SDK_CONNECT.forEach((cookie) => {
      const cookieString = `${cookie.name}=${cookie.value}; Domain=${
        cookie.domain
      }; Path=${cookie.path}; Expires=${new Date(
        cookie.expires * 1000
      ).toUTCString()}; ${cookie.secure ? 'Secure;' : ''} ${
        cookie.httpOnly ? 'HttpOnly;' : ''
      } ${cookie.sameSite ? `SameSite=${cookie.sameSite};` : ''}`;
      jar.setCookieSync(cookieString, this._client.defaults.baseURL ?? '');
    });
    this._client.defaults.jar = jar;
    this._client.defaults.withCredentials = true;
    this._client = wrapper(this._client);
  }

  public async signIn (credentials: credentials): Promise<any> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Both email and password must be provided to sign in.');
    }

    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-cache']
    });
    const page = await browser.newPage();
    await page.goto(AuthentificationServiceImpl.PATH_AUTH.signIn);

    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', email);
    await page.type('input[type="password"]', password);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const cookies = await page.cookies();
    console.log(cookies);

    // await browser.close();
    return true;
  }
}
