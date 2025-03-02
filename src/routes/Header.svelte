<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/MasquerAge.png';
	import { Dropdown, DropdownItem, DropdownDivider, Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	$: activeUrl = $page.url.pathname;
</script>
  
<Navbar class="bg-primary-50 dark:bg-[#0f1c24] shadow-md">
	<NavBrand href="/">
		<img src={logo} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-gray-100">MasquerAge</span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</NavLi>
		<NavLi href="/qr-scanner" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Scan</NavLi>
		<NavLi class="cursor-pointer">
			Playground<ChevronDownOutline class="w-6 h-6 ms-2 text-gray-900 dark:text-gray-400 inline" />
		</NavLi>
		<Dropdown class="w-44 z-20 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
			<DropdownItem class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="/generate-id">
				Create
			</DropdownItem>
			<DropdownItem class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" href="/view-id">
				View
			</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>

<style>

</style>