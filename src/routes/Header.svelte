<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/agecloak.png';
	import { DarkMode, Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
</script>
  
<Navbar>
	<NavBrand href="/">
		<img src={logo} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">AgeCloak</span>
	</NavBrand>
	<NavHamburger />
	<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
		<NavUl {activeUrl}>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/qr-scanner">Scan</NavLi>
			<NavLi href="/generate-id">Create</NavLi>
			<NavLi href="/view-id">View</NavLi>
			
		</NavUl>
		<DarkMode />
	</div>
</Navbar>

<style>

</style>