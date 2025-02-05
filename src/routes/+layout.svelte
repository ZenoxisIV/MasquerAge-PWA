<script lang="ts">
	import Header from './Header.svelte';
	import { page } from '$app/state';
	import '../app.pcss';

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	{#if !page.error}
		<Header />
	{/if}

	<main class="flex-1 flex flex-col p-4 w-full max-w-4xl mx-auto box-border">
		{@render children()}
	</main>
	
	{#if !page.error}
		<footer class="flex flex-col justify-center items-center p-3 self-center whitespace-normal dark:text-gray-400 md:p-3">
			<p>
				&copy; 2025 Department of Computer Science. UP Diliman. All rights reserved.
			</p>
			<p>
				This project is part of the CS 198/199 Undergraduate Program.
			</p>
		</footer>
	{/if}
</div>

<style>

</style>