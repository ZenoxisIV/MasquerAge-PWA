<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';
	import ResetPassword from './ResetPassword.svelte';

	const acceptTerms = true;
	
	const onSubmit = (e: Event) => {
		const formData = new FormData(e.target as HTMLFormElement);

	};
</script>

<ResetPassword {acceptTerms} on:submit={onSubmit}>
	<div>
		<Label for="email" class='mb-2 dark:text-white'>Your email</Label>
		<Input
			type="email"
			name="email"
			id="email"
			placeholder="name@company.com"
			required
			class='border outline-none dark:border-gray-600 dark:bg-gray-700'
		/>
	</div>
	<div>
		<Label for="password" class='mb-2 dark:text-white'>Your password</Label>
		<Input
			type="password"
			name="password"
			id="password"
			placeholder="••••••••"
			required
			class='border outline-none dark:border-gray-600 dark:bg-gray-700'
		/>
	</div>
	<div>
		<Label for="confirm-password" class='mb-2 dark:text-white'>Confirm password</Label>
		<Input
			type="password"
			name="confirm-password"
			id="confirm-password"
			placeholder="••••••••"
			required
			class='border outline-none dark:border-gray-600 dark:bg-gray-700'
		/>
	</div>
</ResetPassword>
