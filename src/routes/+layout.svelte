<script lang="ts">
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { page as staticPage } from '$app/state';
	import { getStores } from '$app/stores';
	const { page: reactivePage } = getStores();
	import '../app.css';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});

	const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let drawerHidden = $derived(false);
	let { children } = $props();
	const excludedPaths = ['/login', '/register', '/reset', '/forgot-password'];
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

{#if !excludedPaths.includes($reactivePage.url.pathname) && !staticPage.error}
	<header class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
		<Navbar bind:drawerHidden />
	</header>

	<div class="overflow-hidden lg:flex">
		<Sidebar bind:drawerHidden />

		<div class="relative h-full w-full overflow-y-auto lg:ml-64 pt-[70px]">
			<main class="p-4">
				{@render children()}
			</main>
			
			<Footer />
		</div>
	</div>
{:else}
	<main class="p-4">
		{@render children()}
	</main>
{/if}
