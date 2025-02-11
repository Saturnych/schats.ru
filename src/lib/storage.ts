import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { getCookie, setCookie, deleteCookie } from '$lib/cookie';
import { uuid } from '$lib/utils';

const storage: Record<string, any> = { getValue: get };

const defaults: Record<string, any> = {
	expires: null,
	botSession: null,
	user: null,
	uid: uuid(),
};

Object.keys(defaults)
	.filter(k=>!!k)
	.forEach((key) => {
		try {
			let def = defaults[key];
			if (browser && localStorage) {
				const str = localStorage.getItem(key);
				if (str !== null) def = JSON.parse(str);
			}
			storage[key] = writable<any>(def);
			storage[key].subscribe((val) => {
				if (browser && localStorage) {
					if (['', null, undefined].includes(val)) {
						localStorage.removeItem(key);
					} else {
						localStorage.setItem(key, JSON.stringify(val));
					}
				}
			});
			if (browser && localStorage) {
				window.addEventListener(`${key}Storage`, () => {
					const str = localStorage.getItem(key);
					if (str === null) return;
					const val = JSON.parse(str);
					if (val !== get(storage[key])) storage[key].set(val);
				});
			}
		} catch (e) {
			//console.error(e);
		}
	});

storage.clearStorage = () => {
	Object.keys(storage)
		.filter(k => (!!k && !['getValue', 'clearStorage'].includes(k)))
		.forEach(k => storage[k].set(null));
};

export default storage;
