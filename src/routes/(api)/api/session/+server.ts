import type { RequestHandler, Response } from '@sveltejs/kit';
import type { Session } from '$lib/types';
import { returnJson, parseJson, checkWebAppHash } from '$lib/utils';
import ENV from '$lib/vars/server';

const postHandler: RequestHandler = async (event: Record<string, any>): Response => {
	try {
		const { url, route, cookies, request } = event;
		const data = await request.json(); // .text() .formData()
		console.log('POST api/session request:', data);
		if (data.initData) data.checked = await checkWebAppHash(data.initData, ENV.TELEGRAM_BOT_TOKEN, console.log);
		console.log('POST api/session uid:', data?.uid, 'return data:', data);
		return returnJson(data);
	} catch (e) {
		console.error(e);
		return returnJson(e, 400, e.message || 'Error', false);
	}
};

export const GET: RequestHandler = async (event: Record<string, any>): Response => {
	try {
		const { url, route, cookies } = event;
		const uid = decodeURIComponent(url.searchParams.get('uid') || '');
		const initData = decodeURIComponent(url.searchParams.get('initData') || '{}');
		const data = {
			uid,
			initData: parseJson(initData),
		};
		if (data.initData) data.checked = await checkWebAppHash(data.initData, ENV.TELEGRAM_BOT_TOKEN, console.log);
		console.log('GET api/session uid:', data?.uid, 'return data:', data);
		return returnJson(data);
	} catch (e) {
		console.error(e);
		return returnJson(e, 400, e.message || 'Error', false);
	}
};

export const POST: RequestHandler = (event: Record<string, any>): Response => postHandler(event);

export const PUT: RequestHandler = (event: Record<string, any>): Response => postHandler(event);
