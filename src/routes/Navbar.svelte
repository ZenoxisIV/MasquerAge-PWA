<script>
	import logo from '$lib/images/MasquerAge-512x512.png';
	import { DarkMode, Dropdown, DropdownItem, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import '../app.css';

	export let fluid = true;
	export let drawerHidden = false;
	export let list = false;
</script>

<Navbar {fluid} class="text-black" color="default" let:NavContainer>
	<NavHamburger
		onClick={() => (drawerHidden = !drawerHidden)}
		class="m-0 me-3 md:block lg:hidden"
	/>
	<NavBrand href="/" class={list ? 'w-40' : 'lg:w-60'}>
		<img
			src={logo}
			class="me-2.5 h-6 sm:h-8"
			alt="MasquerAge Logo"
		/>
		<span
			class="ml-px self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl"
		>
			MasquerAge
		</span>
	</NavBrand>
	<div class="hidden lg:block lg:ps-3">
		{#if list}
			<NavUl class="ml-2" activeUrl="/" activeClass="text-primary-600 dark:text-primary-500">
				<NavLi href="/">Home</NavLi>
				<NavLi href="#top">Messages</NavLi>
				<NavLi href="#top">Profile</NavLi>
				<NavLi href="#top">Settings</NavLi>
				<NavLi class="cursor-pointer">
					Dropdown
					<ChevronDownOutline  class="ms-0 inline" />
				</NavLi>
				<Dropdown class="z-20 w-44">
					<DropdownItem href="#top">Item 1</DropdownItem>
					<DropdownItem href="#top">Item 2</DropdownItem>
					<DropdownItem href="#top">Item 3</DropdownItem>
				</Dropdown>
			</NavUl>
		{/if}
	</div>
	<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
		<DarkMode />
	</div>
</Navbar>
