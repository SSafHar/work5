import { Injectable } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Request,
  Headers
} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';

import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpService extends Http {

  public host: string;

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
    this.host = environment.host;
  }

  /**
   * Performs any type of http request without auth
   * @param request
   * @param options
   * @returns {Observable<Response>}
   */
  public request(request: string | Request, options: RequestOptionsArgs = {}): Observable<Response> {
    let body = null;
    if (request instanceof Request) {
      request.url = this.getFullUrl(request.url);
      body = request.getBody();
    }
    let headers = options.headers || new Headers();
    if (body) {
      if (body instanceof FormData) {
        headers.delete('Content-Type');
      } else {
        headers.set('Content-Type', 'application/json');
      }
      options.headers = headers;
    }

    return super.request(request, options)
      .catch((error) => this.onCatch(error))
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return super.get(url, this.requestOptions(options))
      .catch((error) => this.onCatch(error))
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  public getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
    return super.get(url, options);
  }

  /**
   * Performs a request with `post` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return super.post(url, body, this.requestOptions(options))
      .catch((error) => this.onCatch(error))
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
    return super.put(url, body, this.requestOptions(options))
      .catch((error) => this.onCatch(error))
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Performs a request with `delete` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return super.delete(url, options)
      .catch((error) => this.onCatch(error))
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Request options add auth header.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    const token = localStorage.getItem(environment.tokenKey);
    let headers = new Headers();
    if (options && options.headers) {
      options.headers.forEach((value, key) => {
        headers.append(key, value.toString());
      });
    }
    headers.append('authToken', token);
    options = options || {};
    options.headers = headers;
    return options;
  }

  /**
   * Build API url.
   * @param url,
   * @returns {string}
   */
  private getFullUrl(url: string): string {
    return `${this.host}/${url}`;
  }

  /**
   * Request interceptor.
   */
  private requestInterceptor(): void {}

  /**
   * Response interceptor.
   */
  private responseInterceptor(): void {}

  /**
   * Error handler.
   * @param error
   * @returns {ErrorObservable}
   */
  private onCatch(error: any): Observable<any> {
    switch (error.status) {
      case 401:
        localStorage.removeItem('currentUser');
        localStorage.removeItem(environment.tokenKey);
        localStorage.removeItem('activation_token');
        // this.router.navigate(['/login']);
        break;
      case 403:
        // this.router.navigate(['/deny']);
        break;
      case 500:
        // this.router.navigate(['/500']);
        break;
      default: break;
    }
    return Observable.throw(error);
  }

  /**
   * onSubscribeSuccess
   * @param res
   */
  private onSubscribeSuccess(res: Response): void {}

  /**
   * onSubscribeError
   * @param error
   */
  private onSubscribeError(error: any): void {}

  /**
   * onFinally
   */
  private onFinally(): void {}

}
