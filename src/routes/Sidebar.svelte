<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { CogOutline, BookOpenSolid, QrCodeOutline, OpenDoorOutline, BugOutline, GithubSolid } from 'flowbite-svelte-icons';

	export let drawerHidden: boolean = false;

	const closeDrawer = () => {
		drawerHidden = true;
	};

	$: mainSidebarUrl = $page.url.pathname;
	let activeMainSidebar: string;

	afterNavigate((navigation) => {
		document.getElementById('svelte')?.scrollTo({ top: 0 });
		closeDrawer();

		activeMainSidebar = navigation.to?.url.pathname ?? '';
	});

	let tabs = [
		{ name: 'MasquerAge Guard', icon: QrCodeOutline, href: '/' },
		{ name: 'Profile Settings', icon: CogOutline, href: '/profile' },
	];

	let misc = [
		{
			label: 'Repository',
			href: 'https://github.com/ZenoxisIV/MasquerAge-PWA',
			icon: GithubSolid
		},
		{
			label: 'Support',
			href: 'https://github.com/ZenoxisIV/MasquerAge-PWA/issues',
			icon: BugOutline
		},
		{
			label: 'Logout',
			href: '/logout',
			icon: OpenDoorOutline
		}
	];
</script>

<Sidebar
	class={drawerHidden ? 'hidden' : ''}
	activeUrl={mainSidebarUrl}
	activeClass="bg-gray-100 dark:bg-gray-700"
	asideClass="fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:pt-16 lg:block"
>
	<h4 class="sr-only">Main menu</h4>
	<SidebarWrapper
		divClass="overflow-y-auto px-3 pt-20 lg:pt-5 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-4rem)] lg:block dark:bg-gray-800 lg:me-0 lg:sticky top-2"
	>
		<nav class="divide-y divide-gray-200 dark:divide-gray-700">
			<SidebarGroup ulClass='pt-2 space-y-2' class="mb-3">
				{#each tabs as { name, icon, href } (name)}
						<SidebarItem
							label={name}
							{href}
							spanClass="ml-3"
							class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700'
						>
							<svelte:component this={icon} slot="icon" class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
						</SidebarItem>
				{/each}
			</SidebarGroup>
			<SidebarGroup ulClass='pt-2 space-y-2'>
				{#each misc as { label, href, icon } (label)}
					<SidebarItem
						{label}
						{href}
						spanClass="ml-3"
						class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700'
					>
						<svelte:component this={icon} slot="icon" class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
					</SidebarItem>
				{/each}
			</SidebarGroup>
		</nav>
	</SidebarWrapper>
</Sidebar>

<div
	hidden={drawerHidden}
	class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/60"
	on:click={closeDrawer}
	on:keydown={closeDrawer}
	role="presentation"
>
</div>
