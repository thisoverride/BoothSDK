import type { Cookie } from 'puppeteer';

/**
 * Represents the Controller Implementation interface.
 */
export interface ControllerImpl {
  /**
   * Represents the route strings.
   */
  ROUTE: string[];
}

/**
 * Represents the HTTP Response structure.
 */
export interface HttpResponse {
  /**
   * The message content of the HTTP response.
   */
  message?: any;
  access_cookies?: Cookie[];

  /**
   * The status code of the HTTP response.
   */
  status: number;
}
