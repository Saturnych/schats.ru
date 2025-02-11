import type { Response } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { browser } from '$app/environment';
import axios from 'axios';
import crypto from 'crypto';
import short from 'short-uuid';
import consts from '$lib/vars/consts';

const { subtle } = browser ? globalThis.crypto : crypto.webcrypto;

export const generateSubtleKey = async (name = 'HMAC', hash = 'SHA-256') => subtle.generateKey({ name, hash }, true, ['sign', 'verify']);

export const createSubtleHash = async (text, key, name = 'HMAC') => {
  const enc = new TextEncoder();
  const message = enc.encode(text);
  return await subtle.sign({ name }, key, message); // digest
};

export const cryptoHash = (data, type = 'sha256', enc = 'hex') => crypto.createHash(type).update(data).digest(enc);

export const cryptoHmac = (data, secret, enc = 'hex', type = 'sha256') => {
  const hmac = crypto.createHmac(type, secret)
  hmac.write(data);
  hmac.end();
  return !!enc ? hmac.read().toString(enc) : hmac.read();
};

export const cryptoHmacDigest = (data, secret, enc = 'hex', type = 'sha256') => {
  const hmac = crypto.createHmac(type, String(secret)).update(String(data));
  return !!enc ? hmac.digest(enc) : hmac.digest();
};

export const checkWebAppData = async (initDataUnsafe: Record<string, any>, token: string, isAlert: boolean = false): Record<string, any> => {
  const { hash, ...initData } = initDataUnsafe;
  const log = isAlert ? alert : console.log;
  const keys = Object.keys(initData).sort();
  const check_string = keys.map(key => {
    let ret = `${key}=`;
    if (typeof initData[key] === 'object' && !Array.isArray(initData[key]) && initData[key] !== null) {
      ret += JSON.stringify(initData[key]);
    } else
      ret += initData[key];
    return ret;
  }).join("\n");
  let secret_key = cryptoHmacDigest(token, 'WebAppData', '');
  //if (typeof secret_key === 'object' && 'data' in secret_key) secret_key = secret_key.data;
  const hmac = cryptoHmac(check_string, secret_key);
  const hmac_digest = cryptoHmacDigest(check_string, secret_key);
  return {
    ok: (hmac === hash),
    hmac,
    hmac_digest,
  };
};

export const uuid = () => short.uuid();

export const normalize = (string: string): string => {
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const isEnglish = (word: string): boolean => {
	return /^[a-z0-9]+$/i.test(word);
};

export const isNumeric = (n: string): boolean => !isNaN(parseFloat(n)) && isFinite(Number(n));

export const isDate = (d: any): boolean => d instanceof Date && !Number.isNaN(d.getTime());

export const getRandomString = (len: number = 12): string =>
	Math.random()
		.toString(36)
		.slice(-1 * len);

export const getRandomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const errorHandler = ({ error, event }) => {
	const errorResult = {
		status: event.route.id ? event.locals.status || 400 : 404,
		message: error.toString(),
		errorId: uuid() // crypto.randomUUID(),
	};
	event.locals.status = errorResult.status;
	return errorResult;
};

export const parseCookieHeader = (header: string): Record<string, string> => {
	const cookies = {};
	if (!!!header) return cookies;
	const arr = header.split(',').map((ck) => {
		const cookie = ck.trim().split(';')[0].split('=');
		cookies[cookie[0]] = cookie[1];
		return {
			[cookie[0]]: cookie[1]
		};
	});
	return cookies;
};

const createHeaders = (token?: Token): Record<string, string> => {
	return !!token ? { Authorization: `Bearer ${token}` } : {};
};

export const getData = async (uri: string, token?: string): Record<string, any> => {
	try {
		const headers: Record<string, string> = createHeaders(token);
		const get = await axios.get(uri, { headers });
		return get?.data;
	} catch (e) {
		console.error(e);
	}
};

export const postData = async (uri: string, data: Record<string, string>, token?: string, contentType?: string): Record<string, any> => {
	try {
		const headers: Record<string, string> = createHeaders(token);
		headers['Content-Type'] = contentType ? contentType : 'application/json';
		const post = await axios.post(uri, data, { headers });
		return post?.data;
	} catch (e) {
		console.error(e);
	}
};

export const returnJson = (
	data: Record<string, any>,
	status: number = 200,
	message: string = 'ok',
	success: boolean = true,
	version: string = consts?.version,
): Response => json({ status, message, success, version, data: status > 399 ? null : data });

/**
 * JSON.parse() catching errors
 *
 * @param {String} data
 * @param {Object} json
 *
 */
export const parseJson = (data: string, obj?: object): object => {
	try {
		obj = JSON.parse(data);
	} catch (e) {
		//console.error(e);
	}
	return obj;
};

export const importJson = async (env: object = {}) => {
  const files = import.meta.glob('./*.json');
  for (const file in files) {
    try {
      const res = await files[file]();
      if ('default' in res) env = Object.assign(env, res.default);
    } catch (e) {}
  }
  return env;
}
