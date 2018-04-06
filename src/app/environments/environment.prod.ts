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

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  host: 'http://api-odeon.fenix.codes',
  imagePath: 'http://api-odeon.fenix.codes',
  tokenKey: 'token',
} as any;
