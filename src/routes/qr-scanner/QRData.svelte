<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	export let decodedData: string;
	export let onNewScan: () => void;

	let verifiedPrompt: boolean = false, rejectedPrompt: boolean = false, invalidPrompt: boolean = false;
	let modalOpen: boolean = false;

	async function validateID(data: string): Promise<void> {
		verifiedPrompt = rejectedPrompt = invalidPrompt = false;
		modalOpen = false;

		try {
			const response = await fetch('/qr-scanner/mosip-verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data })
			});

			const result = await response.json();

			if (response.ok) {
				if (result.age >= 35) {
					verifiedPrompt = true;
				} else {
					rejectedPrompt = true;
				}
			} else {
				invalidPrompt = true;
			}

			modalOpen = true;
		} catch (error) {
			console.error(error);
			invalidPrompt = true;
			modalOpen = true;
		}
	}

	$: if (decodedData) validateID(decodedData);
</script>

<slot {decodedData}>
	<Modal bind:open={modalOpen} size="xs" autoclose outsideclose>
		<div class="text-center">
			{#if verifiedPrompt}
				<CheckCircleSolid class="mx-auto mb-4 text-green-600 w-24 h-24 dark:text-green-400" />
				<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">This person is 35 or older.</h3>
			{:else if rejectedPrompt}
				<CloseCircleSolid class="mx-auto mb-4 text-red-600 w-24 h-24 dark:text-red-400" />
				<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">This person is below 35.</h3>
			{:else if invalidPrompt}
				<ExclamationCircleSolid class="mx-auto mb-4 text-yellow-400 w-24 h-24 dark:text-yellow-400" />
				<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">Invalid ID. Please try again.</h3>
			{/if}
			<Button on:click={onNewScan}>New Scan</Button>
		</div>
	</Modal>
</slot>

<style>
	
</style>