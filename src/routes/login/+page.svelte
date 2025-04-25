<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';
	import Login from './Login.svelte';

	const rememberMe = false;
	const lostPassword = false;
	const createAccount = true;
</script>

<Login {rememberMe} {lostPassword} {createAccount}>
	<div>
		<Label for="email" class="mb-2 dark:text-white">Your username</Label>
		<Input
			type="text"
			name="username"
			id="username"
			placeholder="AlanTuring"
			required
			class="border outline-none dark:border-gray-600 dark:bg-gray-700"
		/>
	</div>
	<div>
		<Label for="password" class="mb-2 dark:text-white">Your password</Label>
		<Input
			type="password"
			name="password"
			id="password"
			placeholder="••••••••"
			required
			class="border outline-none dark:border-gray-600 dark:bg-gray-700"
		/>
	</div>
</Login>
