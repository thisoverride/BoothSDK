import type AuthentificationServiceImpl from '../services/AuthentificationServiceImpl';

interface credentials {
  email: string;
  password: string;
}
export default class AuthentificationController {
  private readonly _clientService: AuthentificationServiceImpl;
  private static islogged: boolean = false;

  constructor (clientService: AuthentificationServiceImpl) {
    this._clientService = clientService;
  }

  public async auth (credentials: credentials): Promise<any> {
    try {
      AuthentificationController.islogged = await this._clientService.signIn(credentials);
    } catch (error) {
      console.log('');
    }
  }

  public connect (): void {
    try {
      this._clientService.sdkConnect();
      AuthentificationController.islogged = true;
    } catch (error) {
      console.log('');
    }
  }

  public static isAuthenticate (): boolean {
    return AuthentificationController.islogged;
  }
}
