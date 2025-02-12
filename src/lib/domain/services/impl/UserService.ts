import type HttpClient from '../../../core/api/HttpClient';
import BaseService from '../base/BaseClient';

export default class UserService extends BaseService {
  private readonly _httpclient: HttpClient;

  constructor (httpclient: HttpClient) {
    super();
    this._httpclient = httpclient;
  }

  public async updateNickname (nickname: string): Promise<void> {
    // if the response contain "Nickname was not updated." the update not working
    console.log('f');
  }
}
