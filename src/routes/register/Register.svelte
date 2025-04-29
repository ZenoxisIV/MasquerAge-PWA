<script lang="ts">
	import { enhance } from '$app/forms';
	import logo from '$lib/images/MasquerAge-512x512.png';
	import { A, Checkbox, Button, Card } from 'flowbite-svelte';
	
	export let acceptTerms: boolean = true;
	export let haveAccount: boolean = true;
</script>

<main class="bg-gray-50 dark:bg-gray-900 w-full">
	<div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
		<a href="/" class="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
			<img src={logo} class="mr-4 h-11" alt="MasquerAge Logo" />
			<span>MasquerAge</span>
		</a>
		<Card class="w-full" size="md" border={false}>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
				Create a Free Account
			</h1>
			<form ></form>
			<form class="mt-8 space-y-6" method="POST" use:enhance>
				<slot />
				{#if acceptTerms}
					<Checkbox class="pt-1" name="accept">
						<span>
							I accept the <A href="/terms">Terms and Conditions</A>
						</span>
					</Checkbox>
				{/if}
				<Button type="submit" size="lg">Create account</Button>
				{#if haveAccount}
					<div class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Already have an account? <A href="/login">Login here</A>
					</div>
				{/if}
			</form>
		</Card>
	</div>
</main>