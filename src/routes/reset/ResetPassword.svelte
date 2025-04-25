<script lang="ts">
	import { Button, Card, Checkbox } from 'flowbite-svelte';
	
	export let acceptTerms: boolean = true;
</script>

<main class="bg-gray-50 dark:bg-gray-900 w-full">
	<div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
		<a href="/" class="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
			<img src="/images/placeholder.svg" class="mr-4 h-11" alt="MasquerAge Logo" />
			<span>MasquerAge</span>
		</a>
		<Card class="w-full" size="md" border={false}>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
				Reset your password
			</h1>
			<form class="mt-8 space-y-6" on:submit|preventDefault>
				<slot />
				{#if acceptTerms}
					<Checkbox class="accent-primary-600">
						<span>
							I accept the <a href="/terms" class="text-primary-700 hover:underline dark:text-primary-500">Terms and Conditions</a>
						</span>
					</Checkbox>
				{/if}
				<Button type="submit">Create account</Button>
			</form>
		</Card>
	</div>
</main>
