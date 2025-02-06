import short from 'short-uuid';
import type {
	PageLoad,
	PageServerLoad,
	LayoutData,
	LayoutServerData,
	LayoutLoad,
	LayoutServerLoad,
	LoadEvent,
	ServerLoadEvent,
	RequestHandler,
	Response
} from '@sveltejs/kit';

export type ID = string;
export type ISODate = Date | string;
export type Email = string;
export type Token = string;
export type UserRole = 'USER' | 'ADMIN' | 'SUPER' | null;
export type UUID = string | short.UUID;

export type Event = LoadEvent | ServerLoadEvent;
export type Layout = LayoutLoad | LayoutServerLoad;
export type Data = LayoutData | LayoutServerData;
export type Page = PageLoad | PageServerLoad;

export type UserToken = {
	id: ID;
	role: UserRole;
	email: Email;
	iat?: number;
	exp?: number;
};
