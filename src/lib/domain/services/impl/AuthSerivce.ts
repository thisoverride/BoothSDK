import type HttpClient from '../../../core/api/HttpClient';
import BaseService from '../base/BaseClient';
import puppeteer, { type Cookie, type Page } from 'puppeteer';

interface PixivCrendentials {
  email: string;
  password: string;
}

export default class AuthService extends BaseService {
  private readonly _httpclient: HttpClient;

  constructor (httpclient: HttpClient) {
    super();
    this._httpclient = httpclient;
  }

  public async openSession (credentials: PixivCrendentials): Promise<void> {
    if (!credentials) {
      throw new Error('Invalid_Credentials');
    }
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page: Page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['stylesheet', 'image', 'font', 'media', 'svg'].includes(request.resourceType())) {
        void request.abort();
      } else {
        void request.continue();
      }
    });
    try {
      await page.goto('https://accounts.pixiv.net/login?prompt=select_account&return_to=https%3A%2F%2Foauth.secure.pixiv.net%2Fv2%2Fauth%2Fauthorize%3Fclient_id%3Da1Z7w6JssUQkw5Hid0uIDeuesue9%26redirect_uri%3Dhttps%253A%252F%252Fbooth.pm%252Fusers%252Fauth%252Fpixiv%252Fcallback%26response_type%3Dcode%26scope%3Dread-works%2520read-favorite-users%2520read-friends%2520read-profile%2520read-email%2520write-profile%26state%3Dsecurity_token%253D3e5e7d2da8499393a2bddcb11ad2cfb2ea2c557df67edcef%252Crequest_type%253Ddefault%26code_challenge%3DZClv5WMCzFNUeeNHzoX5ybGIpHyRyYw__XJJ5xTMYAc%26code_challenge_method%3DS256%26source%3Dbooth&source=booth&ref=oauth-login-a1Z7w6JssUQkw5Hid0uIDeuesue9', { waitUntil: 'networkidle2' });
      await page.type("input[type='text']", credentials.email);
      await page.type("input[type='password']", credentials.password);
      await page.keyboard.press('Enter');

      const cookies: Cookie[] = await browser.cookies();
      await browser.close();
      this._httpclient.setCookie('cookies[0]');
      console.log('Cookies récupérés : ', cookies);
    } catch (error: unknown) {
      await browser.close();
      console.log(error);
      throw error;
    }
  }

  public async closeSession (): Promise<void> {
    this._httpclient.unsetCookie();
  }
}
