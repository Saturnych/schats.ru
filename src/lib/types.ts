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

export type Event = LoadEvent | ServerLoadEvent;
export type Layout = LayoutLoad | LayoutServerLoad;
export type Data = LayoutData | LayoutServerData;
export type Page = PageLoad | PageServerLoad;

export type ID = number | string;
export type ISODate = Date | string;
export type Email = string;
export type Token = string;
export type ISODate = string; // '2021-10-29T21:52:35.830Z'
export type Timestamp = number | string; // 1683628086
export type Date = Date | ISODate | Timestamp | null;
export type UUID = string | short.UUID;

export enum Lang {
  RU = 'ru',
  EN = 'en',
};

export enum LangCode {
  RU = 'ru-RU',
  EN = 'en-US',
};

export enum UserRole {
  USER = 'USER',
	BOT = 'BOT',
  ADMIN = 'ADMIN',
	SUPER = 'SUPER',
};

export type UserToken = {
	id: ID;
	role: UserRole;
	email?: Email;
	iat?: number;
	exp?: number;
};

export interface SessionData {
  id: number;
  uid?: UUID;
  type?: string;
  query_id?: string;
  auth_date?: Date;
  hash?: string;
  country?: Country;
	language_code?: Lang;
  lang?: Lang;
	first_name?: string;
  last_name?: string;
	username?: string;
	page?: number;
	expiry_date?: Date;
	error?: string | number;
};

export type Session = SessionData | null;

export interface BotSessionData {
	id: number;
	session: Session;
	created_at: Date;
};

export type BotSession = BotSessionData | undefined;

export interface AuthCallbacks {
	signIn?: () => boolean | Promise<boolean>;
	session?: (session: Session) => Session | Promise<Session>;
	redirect?: (url: string) => string | Promise<string>;
}

export interface ITelegramUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	language_code: string;
}

export interface IWebApp {
	initData: string;
	initDataUnsafe: {
		query_id: string;
		user: ITelegramUser;
		auth_date: string;
		hash: string;
	};
	version: string;
	platform: string;
	colorScheme: string;
	themeParams: {
		link_color: string;
		button_color: string;
		button_text_color: string;
		secondary_bg_color: string;
		hint_color: string;
		bg_color: string;
		text_color: string;
	};
	isExpanded: boolean;
	viewportHeight: number;
	viewportStableHeight: number;
	isClosingConfirmationEnabled: boolean;
	headerColor: string;
	backgroundColor: string;
	BackButton: {
		isVisible: boolean;
	};
	MainButton: MainButton;
	HapticFeedback: any;
	close(): void;
	ready(): void;
}

interface MainButton {
	/**
	 * Current button text. Set to CONTINUE by default.
	 */
	text: string;
	/**
	 * 	Current button color. Set to themeParams.button_color by default.
	 */
	color: string;
	/**
	 * Current button text color. Set to themeParams.button_text_color by default.
	 */
	textColor: string;
	/**
	 * Shows whether the button is visible. Set to false by default.
	 */
	isVisible: boolean;
	/**
	 * Shows whether the button is active. Set to true by default.
	 */
	isActive: boolean;
	isProgressVisible: boolean;
	/**
	 * A method to set the button text.
	 */
	setText(text: string): MainButton;
	/**
	 * A method that sets the button press event handler.
	 * An alias for Telegram.WebApp.onEvent('mainButtonClicked', callback)
	 */
	onClick(callback: Function): MainButton;
	/**
	 * A method that removes the button press event handler.
	 * An alias for Telegram.WebApp.offEvent('mainButtonClicked', callback)
	 */
	offClick(callback: Function): MainButton;
	/**
	 * A method to make the button visible.
	 */
	show(): MainButton;
	/**
	 * A method to hide the button.
	 */
	hide(): MainButton;
	/**
	 * A method to enable the button.
	 */
	enable(): MainButton;
	/**
	 * A method to disable the button.
	 */
	disable(): MainButton;
	/**
	 * A method to show a loading indicator on the button.
	 */
	showProgress(leaveActive: boolean): MainButton;
	hideProgress(): MainButton;
	/**
	 * A method to set the button parameters.
	 */
	setParams(params: MainButtonParams): MainButton;
}

interface MainButtonParams {
	/**
	 * Button text.
	 */
	text?: string;
	/**
	 * Button color.
	 */
	color?: string;
	/**
	 * Button text color.
	 */
	text_color?: string;
	/**
	 * Enable the button.
	 */
	is_active?: boolean;
	/**
	 * Show the button.
	 */
	is_visible?: boolean;
}
