import { env } from '$env/dynamic/private';
const ENV = Object.assign(env, import.meta.env);

ENV.DEV_MODE = (!!ENV.NODE_ENV && ENV.NODE_ENV.indexOf('dev') > -1) ?? ENV.DEV;
ENV.DEBUG = !!ENV.DEV_MODE;

export default ENV;
