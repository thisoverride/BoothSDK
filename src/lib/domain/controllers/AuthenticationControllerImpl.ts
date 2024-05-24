import type { AuthenticationController, Credentials } from '../../controller/AuthentificationController';
import type AuthentificationServiceImpl from '../services/AuthentificationServiceImpl';

export default class AuthenticationControllerImpl implements AuthenticationController {
  private readonly _clientService: AuthentificationServiceImpl;
  private static islogged: boolean = false;

  constructor (clientService: AuthentificationServiceImpl) {
    this._clientService = clientService;
  }

  public async auth (credentials: Credentials): Promise<void> {
    try {
      AuthenticationControllerImpl.islogged = await this._clientService.signIn(credentials);
    } catch (error) {
      console.log('');
    }
  }

  public connect (): void {
    try {
      this._clientService.sdkConnect();
      AuthenticationControllerImpl.islogged = true;
    } catch (error) {
      console.log('');
    }
  }

  public isAuthenticated (): boolean {
    return AuthenticationControllerImpl.islogged;
  }
}
