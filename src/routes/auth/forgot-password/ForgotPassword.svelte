<script lang="ts">
	import { Button, Card, P } from 'flowbite-svelte';
</script>

<main class="bg-gray-50 dark:bg-gray-900">
	<div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
		<a href="/" class="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
			<img src="/images/placeholder.svg" class="mr-4 h-11" alt="MasquerAge Logo" />
			<span>MasquerAge</span>
		</a>
		<Card class="w-full max-w-md" border={false}>
			<h1 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Forgot your password?</h1>
			<P class="text-base font-normal text-gray-500 dark:text-gray-400">
				Don"t fret! Just type in your email and we will send you a code to reset your password!
			</P>
			<form class="mt-8 space-y-6" on:submit|preventDefault>
				<slot />
				<Button type="submit" size="lg">Reset password</Button>
			</form>
		</Card>
	</div>
</main>
