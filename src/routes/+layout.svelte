<script lang="ts">
	import Header from './Header.svelte';
	import { Footer, FooterIcon, FooterCopyright } from 'flowbite-svelte';
	import { GithubSolid } from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	import '../app.css';

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
		<Footer footerType="sitemap">
			<div class="py-6 px-4 bg-primary-50 dark:bg-[#0f1c24] md:flex md:items-center md:justify-between">
				<div class="flex-1 text-center">
					<FooterCopyright
						spanClass="text-sm dark:text-gray-400 sm:text-center"
						href="/"
						by="Department of Computer Science. UP Diliman."
					/>
					<p class="text-sm dark:text-gray-400 sm:text-center">This project is part of the CS 198/199 Undergraduate Program.</p>
				</div>
				<div class="flex mt-4 space-x-6 rtl:space-x-reverse sm:justify-center md:mt-0">
					<FooterIcon href="/">
						<GithubSolid class="mt-5 w-8 h-8 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white" />
					</FooterIcon>
				</div>
			</div>
		</Footer>
		  
	{/if}
</div>