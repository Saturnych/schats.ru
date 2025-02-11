import type { Response } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { ed25519 } from '@noble/curves/ed25519';
import { browser } from '$app/environment';
import axios from 'axios';
import crypto from 'crypto';
import short from 'short-uuid';
import consts from '$lib/vars/consts';

const { subtle } = browser ? globalThis.crypto : crypto.webcrypto;

// Hex to Base64
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

export const base64decode = (str: string): string => {
  str = str
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const pad: number = str.length % 4;
  if (pad>0) {
    if (pad === 1) return null;
    str += new Array(5-pad).join('=');
  }
  return str;
};

export const base64ToHex = (str: string, upperCase: boolean = true): string => {
  const raw = atob(str);
  let result: string = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return upperCase ? result.toUpperCase() : result;
};

export const createCheckString = (initData: string, removeList: string[] = ['hash'], prepend: string = ''): string => {
  const ret: Record<string,string> = {};
  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded: string = decodeURIComponent(initData);
  // Data-check-string is a chain of all received fields'.
  const arr: string[] = encoded.split('&');
  if (removeList?.length>0) {
    removeList.forEach(el=>{
      const elIndex: number = arr.findIndex((str) => str.startsWith(el));
      ret[el] = arr.splice(elIndex)[0].split('=')[1];
    })
  }
  // Sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // In the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  ret['checkString'] = `${!!prepend ? prepend+"\n" : ''}${arr.join("\n")}`;
  return ret;
};

export const checkWebAppSignature = async (initData: string, botId: string, publicKey: string, signature: string, log: any): Record<string, any> => {
  log('initData:', initData);
  const { hash, checkString } = createCheckString(initData, ['hash','signature'], `${botId}:WebAppData`);
  log('checkString:', checkString);
  const base64Signature: string = base64decode(signature);
  log('base64Signature:', base64Signature);
  log('hexedSignature:', base64ToHex(base64Signature));
  const checked: boolean = ed25519.verify(base64ToHex(base64Signature), Uint8Array.from(checkString), publicKey); // Uint8Array.from(checkString)
  log('checked:', checked);
  return checked;
};

export const checkWebAppHash = (initData: string, token: string, log: any): boolean => {
  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret: Buffer = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  // Data-check-string is a chain of all received fields
  const { hash, checkString } = createCheckString(initData);
  log('checkString:', checkString);
  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const hmac: string = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');
  // If hash is equal, the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  return {
    ok: (hmac === hash),
    hash,
    hmac,
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
