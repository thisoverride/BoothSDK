import axios, { type AxiosRequestConfig } from 'axios';
import type { Config } from '../../@types/BoothSDK';
import ApiEndpoints from './ApiEndPoint';

export default class HttpClient {
  private readonly BASE_URL: string;
  private readonly cookies: any;

  constructor (config: Config) {
    this.BASE_URL = ApiEndpoints.BASE_URL + config.lang;
    this.cookies = {
      "_plaza_session_nktz7u": "aGma21LKfxBL7b0oKNV55s1UUXspt%2FsDghkEDjtiUWx6ldaDd%2B2it0nsPoCjvQibm8%2FuyoKw%2F%2FZkwLD%2BXhqXgPjcC5s4Ly9YE6mh0Muo74eux18wIWvXKMIIIk5GuBWe4GNAP6mOgiQrULCITAeR1JBoSsDS5OAkj%2F2i07UaAxh86NLQKgZaG0trphQBbdd94k9ijrR2AQIGNT7oGzJ7SuD1KznXFy%2F9bWjxd9OnHXBcZ5QalIPSKgkuYPr%2FeaPnDBt5ectNbcR5e%2B1jBuGVkzzN3EbPlvoh51dfgtzpAHLmp7jO8H5nyAHuZ%2FDyMucqBecGPVQ46KTwqZLYDLTzx8iEu6YRmKwQ9a0eYgtG5J%2F4abyG8VM63bNxbV%2BGrw3yUH2geX6ReLOh3bbd0QyD2zEpgdonwdHEveW%2BSxHg%2FhmeBAXI%2BY2tSeZuyh9NPsgXMR1o6enwDG5EQ92IpKvfzktxtAsnWzFNra%2FORndiu41gSElrdd7l2P4WRd6hhnxVkBwiYl%2BNgvjJp3sRwS0ozq50asVqYPLsC5%2FBjUT3HaTX9hhVR8F5fX%2BlN%2FwsCrTEEXGrIZikbKG1aWwQ6Z8snK0ECST0bawWchTC%2FfBPkQI25U%2F4I3qx%2BQuovnPzQ3wgvLARfnXKg9FQ2311UrAmclWWvY1g7ziN5ydy5tVJwkY0KCfynkxi5%2FDbMJ8rTcAa1ix%2BM8pXo2WXlhad6BqVbvfCPvl%2FkyZan2NlC5DnoWw4gGWVlqiZCGyWJfKCWIJbxUSWAjqqa%2Bmx3%2B6E3A2halvVK9mX6Td2lbggKENp0HnsQFFw23k1KTq%2BOjsyqDneFsoaanuewWRC3sxYPbVBT2gWgJ51n6SSxi8gWaG%2B6A%3D%3D--BaiAwxmJZTbN8Pa4--extE%2FKdZDSRPzsv8Hg3RtA%3D%3D",
      "cf_clearance": "hgOQyRB.CQ2L6ja_7wZ1m0OH95eUpvaMxv_7P7CZfCs-1716588166-1.0.1.1-KSIFwG8LD_roX6WivbE66ULt4vpxUrgDqGnKvr28LezOndSDfigLT9CeHQ_lPwMli7GlnYDOjLof0ZfoQGwbfg",
      "_gat_default": "1",
      "_ga": "GA1.1.504560045.1716588167",
      "_gid": "GA1.2.1232521796.1716588167",
      "_ga_RWT2QKJLDC": "GS1.1.1716588166.1.0.1716588166.60.0.0",
      "__cf_bm": "EEfKGuhe2yMDb4BKkJXFO9npGFcmU.vhBGan7LWU8ag-1716588161-1.0.1.1-XTrKeWQUq5YtjnOcqL_0_fFE1d.xeZWREhQpB7yv9IsgQMLEG4wY5IB.9zvMtoMSlDKoI.B_iM.HY3_tllJgzA"
    };
  }

  private getCookiesString (): string {
    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  private async _request<T>(method: string, endpoint: string, useBaseUrl: boolean, data?: any, params: any = {}, basicHeader?: boolean): Promise<T> {
    const urlPath: string = useBaseUrl ? `${this.BASE_URL}/${endpoint}` : endpoint;
    const headers: any = {
      Accept: basicHeader ? '*/*' : 'application/json',
      Cookie: this.getCookiesString()
    };

    if (!params.responseType || params.responseType !== 'stream') {
      headers['Content-Type'] = basicHeader ? 'text/html' : 'application/json;charset=utf-8';
    }

    const options: AxiosRequestConfig = {
      method: method.toUpperCase(),
      url: urlPath,
      headers,
      params: method.toUpperCase() === 'GET' ? params : undefined,
      data: method.toUpperCase() !== 'GET' ? data : undefined,
      responseType: params.responseType
    };

    try {
      return (await axios(options)).data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  public async get<T>(endpoint: string, params?: any, useBaseUrl = true): Promise<T> {
    return await this._request('GET', endpoint, useBaseUrl, undefined, params, false);
  }

  public async stream<T>(endpoint: string): Promise<T> {
    return await this._request('GET', endpoint, false, undefined, { responseType: 'stream' }, true);
  }

  public setCookie (cookie: string): void {}
  public unsetCookie (): void {}
}
