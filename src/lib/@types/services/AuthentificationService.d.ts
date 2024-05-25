/**
 * Represents user credentials for authentication.
 */
export interface Credentials {
  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's password.
   */
  password: string;
}

/**
 * Interface for the Authentification Service.
 */
export interface AuthentificationService {
  /**
   * Authenticates the user with provided credentials.
   *  this function is deprecated for the moment is not finish to implemented use the function connect()
   * @param credentials - User credentials including email and password.
   * @returns A promise that resolves when authentication is successful.
   */
  signIn: (credentials: Credentials) => Promise<void>;

  /**
   * Auto Connect without provided credentials.
   */
  sdkConnect: () => void;
}
