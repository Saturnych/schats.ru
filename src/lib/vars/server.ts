import { env as dynamic_private } from '$env/dynamic/private';

const ENV = Object.assign(dynamic_private, import.meta.env);

// SMTP
export const SMTP_PORT = Number(ENV.SMTP_PORT || 465);
export const SMTP_HOST: string = ENV.SMTP_HOST || 'smtp.yandex.com';
export const SMTP_USER: string = ENV.SMTP_USER || ENV.IMAP_USER || '';
export const SMTP_PASS: string = ENV.SMTP_PASS || ENV.IMAP_PASS || '';
// IMAP
export const IMAP_PORT = Number(ENV.IMAP_HOST || 993);
export const IMAP_HOST: string = ENV.IMAP_HOST || 'imap.yandex.com';
export const IMAP_USER: string = ENV.IMAP_USER || ENV.SMTP_USER || '';
export const IMAP_PASS: string = ENV.IMAP_PASS || ENV.SMTP_PASS || '';
