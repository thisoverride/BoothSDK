import HttpStatusCodes from "../external/HttpStatusCodes";
import { HttpResponse } from "../../@types/ControllerInterface";
import puppeteer from "puppeteer";
import { AuthentificationService } from "../../@types/service/AuthentificationService";


export default class AuthentificationServiceImpl extends HttpStatusCodes implements AuthentificationService {
    public async signIn(email: string, password: string): Promise<HttpResponse> {
      try {
        if (!email || !password) {
          throw new Error('Les paramètres email et password ne sont pas fournis.');
        }

        const browser = await puppeteer.launch({
          headless: false,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
  
        const page = await browser.newPage();
        await page.goto('https://accounts.pixiv.net/login?prompt=select_account&return_to=https%3A%2F%2Fbooth.pm%2Fusers%2Fauth%2Fpixiv&source=booth&view_type=page&_gl=1*tye5an*_ga*NzMxMDk4NDI1LjE3MDcxODI0OTU.*_ga_RWT2QKJLDC*MTcwNzE4MjQ5NC4xLjEuMTcwNzE4MjUyNC4zMC4wLjA.', { waitUntil: 'networkidle0' });
  
        await page.waitForSelector('input[type="text"]');
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="text"]', email);
        await page.type('input[type="password"]', password);
        await page.keyboard.press('Enter');
        
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
        const cookies = await page.cookies();
        await browser.close();
  
        return { access_cookies: cookies, status: this.OK };
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return this.handleError(error);
      }
    }
  

  private handleError(error: any) {
    return { message: error.message, status: error.status || this.INTERNAL_SERVER_ERROR };
  }
}
