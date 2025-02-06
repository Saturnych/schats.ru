import type { LayoutLoad, LayoutServerLoad, LoadEvent, ServerLoadEvent, RequestHandler, Response } from '@sveltejs/kit';

export type Event = LoadEvent | ServerLoadEvent;

export type Layout = LayoutLoad | LayoutServerLoad;
