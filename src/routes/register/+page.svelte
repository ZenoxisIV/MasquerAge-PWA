<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';
	import Register from './Register.svelte';

	const acceptTerms = false;
	const haveAccount = true;
</script>

<Register {acceptTerms} {haveAccount}>
	<div>
		<Label class='space-y-2 dark:text-white'>
			<span>Your username</span>
			<Input
				type="text"
				name="username"
				placeholder="AlanTuring"
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
