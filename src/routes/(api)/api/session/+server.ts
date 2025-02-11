import type { RequestHandler, Response } from '@sveltejs/kit';
import type { Session } from '$lib/types';
import { returnJson, parseJson, checkWebAppData } from '$lib/utils';
import ENV from '$lib/vars/server';
import storage from '$lib/storage';

const postHandler: RequestHandler = async (event: Record<string, any>): Response => {
	try {
		const { url, route, cookies, request } = event;
		const botSession: Session = storage.getValue('botSession');
		const id = botSession.id || '';
		const uid = botSession.uid || '';
		const json = await request.json(); // .text() .formData()
		console.log('POST api/session request:', json);
		const data = {
			id,
			uid,
			...json
		};
		if (data.initData?.query_id) data.checked = await checkWebAppData(data.initData, ENV.TELEGRAM_BOT_TOKEN);
		console.log('POST api/session uid:', uid, 'return data:', data);
		return returnJson(data);
	} catch (e) {
		console.error(e);
		return returnJson(e, 400, e.message || 'Error', false);
	}
};

export const GET: RequestHandler = async (event: Record<string, any>): Response => {
	try {
		const { url, route, cookies } = event;
		const botSession: Session = storage.getValue('botSession');
		const id = botSession.id || '';
		const uid = botSession.uid || '';
		const initData = decodeURIComponent(url.searchParams.get('initData') || '{}');
		const data = {
			id,
			uid,
			initData: parseJson(initData),
		};
		if (data.initData?.query_id) data.checked = await checkWebAppData(data.initData, ENV.TELEGRAM_BOT_TOKEN);
		console.log('GET api/session uid:', uid, 'return data:', data);
		return returnJson(data);
	} catch (e) {
		console.error(e);
		return returnJson(e, 400, e.message || 'Error', false);
	}
};

export const POST: RequestHandler = (event: Record<string, any>): Response => postHandler(event);

export const PUT: RequestHandler = (event: Record<string, any>): Response => postHandler(event);
