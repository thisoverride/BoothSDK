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
  public axios: AxiosInstance;
  private static PATH_AUTH: AuthEndpoints;

  constructor (bootConfigPaths: AuthEndpoints, axios: AxiosInstance) {
    AuthentificationServiceImpl.PATH_AUTH = bootConfigPaths;
    this.axios = axios;
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
      jar.setCookieSync(cookieString, this.axios.defaults.baseURL ?? '');
    });
    this.axios.defaults.jar = jar;
    this.axios.defaults.withCredentials = true;
    this.axios = wrapper(this.axios);
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
    // await page.setRequestInterception(true);

    // page.on('request', (req) => {
    //   if (!['document', 'xhr', 'fetch', 'script'].includes(req.resourceType())) {
    //     return req.abort();
    //       }
    //       req.continue();
    //     });
    // page.on('request', async (req) => {
    //   if (!['document', 'xhr'].includes(req.resourceType())) {
    //     await req.abort();
    //   }
    // });
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
