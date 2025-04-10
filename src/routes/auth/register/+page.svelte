<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';
	import Register from './Register.svelte';

	const acceptTerms = true;
	const haveAccount = true;
	
	const onSubmit = (e: Event) => {
		const formData = new FormData(e.target as HTMLFormElement);


	
	};
</script>

<Register {acceptTerms} {haveAccount} on:submit={onSubmit}>
	<div>
		<Label class='space-y-2 dark:text-white'>
			<span>Your email</span>
			<Input
				type="email"
				name="email"
				placeholder="name@company.com"
				required
				class="border outline-none dark:border-gray-600 dark:bg-gray-700"
			/>
		</Label>
	</div>
	<div>
		<Label class='space-y-2 dark:text-white'>
			<span>Your password</span>
			<Input
				type="password"
				name="password"
				placeholder="••••••••"
				required
				class="border outline-none dark:border-gray-600 dark:bg-gray-700"
			/>
		</Label>
	</div>
	<div>
		<Label class='space-y-2 dark:text-white'>
			<span>Confirm password</span>
			<Input
				type="password"
				name="confirm-password"
				placeholder="••••••••"
				required
				class="border outline-none dark:border-gray-600 dark:bg-gray-700"
			/>
		</Label>
	</div>
</Register>
