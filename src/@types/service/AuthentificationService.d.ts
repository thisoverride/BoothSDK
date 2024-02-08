// import type HttpStatusCodes from '../../domain/external/HttpStatusCodes';
// import type { Request } from 'express';
import type { HttpResponse } from '../ControllerInterface';

export interface AuthentificationService {
  signIn: (email: string, password: string) => Promise<HttpResponse>;
}
