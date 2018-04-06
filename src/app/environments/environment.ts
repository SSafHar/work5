/**
 * Angular 2
 */
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode } from '@angular/core';
/**
 * Environment Providers
 */
let PROVIDERS: any[] = [
  /**
   * Common env directives
   */
];

let _environment: any;


/**
 * Angular debug tools in the dev console
 * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
let _decorateModuleRef = <T>(value: T): T => { return value; };
if ('production' === ENV) {
  enableProdMode();
  /**
   * Production
   */
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  _environment = {
    production: true,
    host: 'http://api-odeon.fenix.codes',
    imagePath: 'http://media-odeon.fenix.codes/',
    tokenKey: 'token',
  };
  PROVIDERS = [
    ...PROVIDERS,
    /**
     * Custom providers in production.
     */
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    enableDebugTools(cmpRef);
    return modRef;
  };

  _environment = {
    production: false,
    host: 'http://api.192.168.33.208.xip.io',
    imagePath: 'http://api.192.168.33.208.xip.io/',
    tokenKey: 'token',
  };
  /**
   * Development
   */
  PROVIDERS = [
    ...PROVIDERS,
    /**
     * Custom providers in development.
     */
  ];

}

export const decorateModuleRef = _decorateModuleRef;
export const ENV_PROVIDERS = [
  ...PROVIDERS
];
export const environment = _environment;
