import type { Response, Request } from 'express';
import { HttpResponse, type ControllerImpl } from '../../@types/ControllerInterface';
import type { AuthentificationService } from '../../@types/service/AuthentificationService';

export default class AuthentificationController implements ControllerImpl {
  public readonly ROUTE: string[];
  private readonly _clientService: AuthentificationService;

  constructor (clientService: AuthentificationService) {
    this._clientService = clientService;
    this.ROUTE = [
      '@POST(/api/auth,authentification)'
    ];
  }

  /**
   * @Mapping @POST(/,items)
   * Render home page.
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @returns {void}
   */
  public async authentification (request: Request, response: Response) {
    try {
      const { email, password } = request.body;
      const serviceResponse = await this._clientService.signIn(email, password);

       response.status(serviceResponse.status).json({ authorization: serviceResponse.access_cookies});

    } catch (error: any) {
      response.status(error.status || 500).json({ message: error.message });
    }
   
  }
}
