import type { RequestHandler, Response } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import short from 'short-uuid';
import consts from '$lib/vars/consts';

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

const createHeaders = (token: Token): Record<string, string> => {
	return !!token ? { Authorization: `Bearer ${token}` } : null;
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

export const returnJson = (
	data: Record<string, any>,
	status: number = 200,
	message: string = 'ok',
	success: boolean = true,
	version: consts.version
): Response => json({ status, message, success, version, data: status > 399 ? null : data });

/**
 * JSON.parse() catching errors
 *
 * @param {String} data
 * @param {Object} json
 *
 */
export const parseJson = (data: string, obj?: object | undefined) => {
	try {
		obj = JSON.parse(data);
	} catch (e) {
		//console.error(e);
	}
	return obj;
};
