// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// 关于SERVER_URL， 开发环境走代理，解决跨域问题，详情请看proxy.config.json文件，以及angular.json文件的proxyConfig
// 当然package.json文件的start也要加上--proxy-config proxy.config.json

export const environment = {
    production: false,
    SERVER_URL: 'http://8.129.210.251:11003'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
