<script lang="ts">
	import { getContext, setContext, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { checkWebAppSignature, importJson, postData } from '$lib/utils';
	import { DEBUG, TELEGRAM_BOT_ID, TELEGRAM_BOT_KEY } from '$lib/vars/client';

	const url = new URL($page.url);
	if (DEBUG) console.log('webapp uri:', url.pathname+url.search);

	let initDataUnsafe: object = $state({});
	let initDataUnsafeDerived: object = $derived(initDataUnsafe ? Object.assign({}, initDataUnsafe) : {});
	let initData: string = $state('');
	let initDataDerived: string = $derived(initData ? initData : '');
	let signatureChecked: boolean = $state(null);
	let hashChecked: boolean = $state(null);

	//setContext('initData', () => $state.snapshot(initData));
	//if (DEBUG) console.log('getContext initData:', getContext('initData')());

	$effect(async () => {
		if (!browser) return;

		const mode = url.searchParams.get('mode') || '';
		if (mode !== 'app') return;

		const { Utils, WebApp } = window.Telegram;
		if (DEBUG) console.log('Utils:', Utils);

		//let initDataDecoded: string = $derived(initData ? Utils.urlSafeDecode(initData) : '');

		WebApp.enableClosingConfirmation();
		//WebApp.disableClosingConfirmation()

		WebApp.MainButton.setText('🎉 Close App')
			.show()
			.onClick(() => {
				WebApp.close();
			});

		// Click Event
		const goBack = () => {
			alert('goBack');
		};
		WebApp.BackButton.onClick(goBack);
		WebApp.BackButton.show();

		WebApp.expand();
		WebApp.ready();

		const imported = await importJson();
		if (DEBUG) console.log('imported:', imported);

		//const initData = (WebApp.initDataUnsafe?.user && WebApp.initDataUnsafe);
		if (DEBUG) console.log('WebApp.initData:', WebApp.initData);
		if (DEBUG) console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);

		if (initData) initData = WebApp.initData; else initData = imported.initData;
		if (DEBUG) console.log('initDataDerived:', initDataDerived);

		if (WebApp.initDataUnsafe?.user) initDataUnsafe = WebApp.initDataUnsafe; else initDataUnsafe = imported.initDataUnsafe;
		if (DEBUG) console.log('initDataUnsafeDerived:', initDataUnsafeDerived);

		if (initDataUnsafe?.signature) {
			signatureChecked = await checkWebAppSignature(initData, TELEGRAM_BOT_ID, TELEGRAM_BOT_KEY, initDataUnsafe?.signature, console.log);
			if (DEBUG) console.log('signatureChecked:', signatureChecked);
			const post = await postData('/api/session', { initData });
			if (DEBUG) console.log('hashChecked:', post?.data?.checked?.ok);
			hashChecked = !!post?.data?.checked?.ok;
		}

	});

	let { children } = $props();
</script>

<svelte:head>
	<title>WebApp</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>WebApp</h1>

	<p>
		signatureChecked: {signatureChecked}
	</p>
	<p>
		hashChecked: {hashChecked}
	</p>
	<pre>
		{JSON.stringify(initDataUnsafeDerived,null,2)}
	</pre>

</div>
