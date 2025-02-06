<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="page-error tile">
	<h1 class="text-danger"><i class="bi bi-exclamation-circle"></i> Error {$page.status}: {$page.error?.message}</h1>
	<p>The page you have requested has error: {$page.error?.message}.</p>
	<p><button class="btn btn-primary" on:click={() => window.history.back()}>Go Back</button></p>
</div>
