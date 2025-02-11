<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DEBUG } from '$lib/vars/client';
	import imported from '$lib/vars/imported';

	const url = new URL($page.url);
	if (DEBUG) console.log('webapp uri:', url.pathname+url.search);

	let initData: object = $state(imported?.initData);
	let initDataUnsafe: object = $derived(initData ? Object.assign({}, initData) : {});

	if (DEBUG) console.log('initData:', $inspect(initData));
	if (DEBUG) console.log('initDataUnsafe:', $inspect(initDataUnsafe));

	$effect(() => {
		if (!browser) return;

		const mode = url.searchParams.get('mode') || '';
		if (mode !== 'app') return;

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
