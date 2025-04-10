<script lang="ts">
	import { Checkbox, A, Button, Card } from 'flowbite-svelte';
	
	export let rememberMe = true;
	export let lostPassword = true;
	export let createAccount = true;
</script>

<main class="bg-gray-50 dark:bg-gray-900 w-full">
	<div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
		<a href="/" class="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
			<img src="/images/placeholder.svg" class="mr-4 h-11" alt="MasquerAge Logo" />
			<span>MasquerAge</span>
		</a>
		<Card class="w-full" size="md" border={false}>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
				Sign in to platform
			</h1>
			<form class="mt-8 space-y-6" on:submit|preventDefault>
				<slot />
				{#if rememberMe || lostPassword}
					<div class="flex items-start">
						{#if rememberMe}
							<Checkbox class="accent-primary-600" name="remember">Remember me</Checkbox>
						{/if}
						{#if lostPassword}
							<A href="/auth/forgot-password" aClass="ml-auto text-sm">Lost Password?</A>
						{/if}
					</div>
				{/if}
				<Button type="submit" size="lg">Login to your account</Button>
				{#if createAccount}
					<div class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Not registered? <A href="/auth/register">Create account</A>
					</div>
				{/if}
			</form>
		</Card>
	</div>
</main>
