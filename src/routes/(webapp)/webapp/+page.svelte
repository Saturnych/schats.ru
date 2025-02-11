<script lang="ts">
	import { getContext, setContext, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { importJson } from '$lib/utils';
	import { DEBUG } from '$lib/vars/client';

	const url = new URL($page.url);
	if (DEBUG) console.log('webapp uri:', url.pathname+url.search);

	let initData: object = $state({});
	let initDataUnsafe: object = $derived(initData ? Object.assign({}, initData) : {});
	setContext('initDataUnsafe', () => initDataUnsafe);
	if (DEBUG) console.log('getContext initDataUnsafe:', getContext('initDataUnsafe')());

	$effect(async () => {
		if (!browser) return;

		const mode = url.searchParams.get('mode') || '';
		if (mode !== 'app') return;

		const imported = await importJson();
		if (imported?.initData) initData = imported.initData
		if (DEBUG) console.log('initData:', $state.snapshot(initData));

		const WebApp = window.Telegram.WebApp;

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

		//const initData = (WebApp.initDataUnsafe?.user && WebApp.initDataUnsafe);
		if (DEBUG) console.log('WebApp.initData:', WebApp.initData);
		if (DEBUG) console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);
		if (WebApp.initDataUnsafe?.user) initData = WebApp.initDataUnsafe;
	});

	let { children } = $props();
</script>

<svelte:head>
	<title>WebApp</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>WebApp</h1>

	<pre>
		{JSON.stringify(initDataUnsafe,null,2)}
	</pre>

</div>
