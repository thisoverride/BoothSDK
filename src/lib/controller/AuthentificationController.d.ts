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
 * Interface for the Authentication Controller.
 */
export interface AuthenticationController {
  /**
   * Authenticates the user with provided credentials.
   * @deprecated this function is deprecated for the moment is not finish to implemented use the function connect()
   * @param credentials - User credentials including email and password.
   * @returns A promise that resolves when authentication is successful.
   */
  auth: (credentials: Credentials) => Promise<void>;

  /**
   * Connects the authentication controller.
   */
  connect: () => void;

  /**
   * Checks if the user is authenticated.
   * @returns A boolean indicating whether the user is authenticated.
   */
  isAuthenticated: () => boolean;
}
