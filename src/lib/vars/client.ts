const ENV = Object.assign({}, import.meta.env);

export const NODE_ENV: string = ENV.NODE_ENV ?? ENV.VITE_USER_NODE_ENV ?? ENV.MODE ?? '';
export const DEV_MODE: boolean = (!!NODE_ENV && NODE_ENV.indexOf('dev') > -1) ?? ENV.DEV;
export const DEBUG = !!DEV_MODE;
export const SSR = !!ENV.SSR;
export const PWD: string = ENV.PWD ?? '';
export const INIT_CWD: string = ENV.INIT_CWD ?? '';
export const LANG: string = ENV.LANG ?? 'en_US.UTF-8';
export const PORT = Number(ENV.PORT ?? 3030);
export const BASEURI: string = ENV.BASEURI ?? 'http://127.0.0.1:3030';
export const SESSION_TTL = Number(ENV.SESSION_TTL ?? 24 * 3600 * 1000); // day in ms
export const APP_NAME: string = ENV.APP_NAME ?? 'App';
