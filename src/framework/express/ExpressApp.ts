import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import PathValidator from '../validator/PathValidator';
import AuthentificationController from '../../domain/controllers/AuthentificationController';
import AuthentificationServiceImpl from '../../domain/services/AuthentificationServiceImpl';
import morgan from 'morgan';
import helmet from 'helmet';
import ProductController from '../../domain/controllers/ProductController';
import ProductServiceImpl from '../../domain/services/ProductServiceImpl';
import axios, { type AxiosInstance } from 'axios';

export default class ExpressApp {
  private readonly _app: Application;
  private readonly _controller: any[];
  private readonly _pathValidator: PathValidator;
  private readonly _axios: AxiosInstance;

  /**
   * Creates an instance of ExpressApp.
   * Initializes middleware and sets up error handling.
   * @memberof ExpressApp
   */
  constructor () {
    this._app = express();
    this._initExpressApp();
    this._pathValidator = new PathValidator();
    this._axios = axios.create({
      baseURL: 'https://booth.pm/en',
      headers: {
        // Cookie: 'adult=t'
      }
    });
    this._controller = [
      new AuthentificationController(new AuthentificationServiceImpl()),
      new ProductController(new ProductServiceImpl(this._axios))
    ];
    this._injectControllers();
    this._setupErrorHandling();
  }

  /**
   *
   * Injects controller routes into the Express.
   * @private
   * @memberof ExpressApp
   */
  private _injectControllers (): void {
    this._controller.forEach((controllerObject) => {
      controllerObject.ROUTE.forEach((controllerProperties: string) => {
        const [method, path, controller] = this._pathValidator.checkPath(controllerProperties);
        if (!(controller in controllerObject) || typeof controllerObject[controller] !== 'function') {
          throw new Error(`The function ${controller} is not a valid controller in the provided object.`);
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        (this._app as unknown as Record<string, Function>)[method](path, (req: Request, res: Response) =>
          controllerObject[controller](req, res));
      });
    });
  }

  /**
   *
   * Sets up error handling middleware.
   * @private
   * @memberof ExpressApp
   */
  private _setupErrorHandling (): void {
    this._app.use((req: Request, res: Response) => {
      res.status(404).send('');
    });

    this._app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
      if (err instanceof SyntaxError) {
        response.status(400).json({ message: 'Bad request: the format body is incorrect.' });
      } else {
        next(err);
      }
    });
  }

  private _initExpressApp (): void {
    this._app.use(helmet());
    this._app.use(express.json());
    this._app.use(morgan('dev'));
  };

  /**
   *
   * Starts the Express application on the specified port.
   * @param {number} port
   * @memberof ExpressApp
   */
  public async startEngine (port: number): Promise<void> {
    try {
      this._app.listen(port, () => {
        console.info('\x1b[1m\x1b[36m%s\x1b[0m', `Service running on http://localhost:${port}`);
      });
    } catch (error) {
      if (error) {
        throw new Error(`Connection to database failed: ${String(error)}`);
      }
    }
  }
}
