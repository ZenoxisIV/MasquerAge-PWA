<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/agecloak.png';
	import { DarkMode, Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
</script>
  
<Navbar class="bg-primary-50 dark:bg-[#0f1c24] shadow-md rounded-b-2xl p-2">
	<NavBrand href="/">
		<img src={logo} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-gray-100">AgeCloak</span>
	</NavBrand>
	<NavHamburger />
	<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
		<NavUl {activeUrl}>
			<NavLi href="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</NavLi>
			<NavLi href="/qr-scanner" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Scan</NavLi>
			<NavLi href="/generate-id" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Create</NavLi>
			<NavLi href="/view-id" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">View</NavLi>
		</NavUl>
		<DarkMode />
	</div>
</Navbar>

<style>

</style>