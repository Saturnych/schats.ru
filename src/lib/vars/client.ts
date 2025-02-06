import * as static_public from '$env/static/public';

const ENV = Object.assign(Object.assign({}, static_public), import.meta.env);

export const NODE_ENV: string = ENV.NODE_ENV ?? ENV.VITE_USER_NODE_ENV ?? ENV.MODE ?? '';
export const DEV_MODE: boolean = (!!NODE_ENV && NODE_ENV.indexOf('dev') > -1) ?? ENV.DEV;
export const DEBUG = !!DEV_MODE;
export const SSR = !!ENV.SSR;
export const BASE_URL: string = ENV.BASE_URL ?? '';
export const LANG: string = ENV.LANG ?? 'en_US.UTF-8';
export const APP_NAME: string = ENV.PUBLIC_APP_NAME ?? 'App';
export const SESSION_TTL = Number(ENV.PUBLIC_SESSION_TTL ?? 24 * 3600 * 1000); // day in ms
export const TOKEN_EXPIRES = ENV.PUBLIC_TOKEN_EXPIRES ?? '180m';
export const TOKEN_EXPIRES_SEC = Number(ENV.PUBLIC_TOKEN_EXPIRES_SEC ?? 10800);
export const SUPABASE_URL: string = ENV.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY: string = ENV.PUBLIC_SUPABASE_ANON_KEY ?? '';

if (DEBUG) console.log('APP_NAME:', APP_NAME);
