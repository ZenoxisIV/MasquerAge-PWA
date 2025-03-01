<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	export let decodedData: string;
	export let onNewScan: () => void;

	let verifiedPrompt: boolean = false, rejectedPrompt: boolean = false, invalidPrompt: boolean = false;
	let modalOpen: boolean = false;
	let result: { age?: number; photo?: string } = {};

	async function validateID(data: string): Promise<void> {
		verifiedPrompt = rejectedPrompt = invalidPrompt = false;
		modalOpen = false;
		result = {};

		try {
			const response = await fetch('/api/scan', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data })
			});

			const res = await response.json();

			if (response.ok) {
				result = res;
				if (res.age >= 35) {
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
				<div class="flex flex-col items-center">
					<div class="relative">
						{#if result.photo}
							<img src="{`data:image/png;base64,${result.photo}`}" alt="Profile" class="w-60 h-60 rounded-lg border-4 border-green-600 dark:border-green-400" />
						{:else}
							<div class="w-24 h-24 rounded-lg border-4 border-gray-300 dark:border-gray-500 flex items-center justify-center text-gray-500 text-sm">
								No Image
							</div>
						{/if}
					</div>
					<div class="mt-4 mb-5 flex items-center gap-2 text-lg font-normal text-black dark:text-gray-400">
						<CheckCircleSolid class="w-6 h-6 text-green-600 dark:text-green-400 stroke-white stroke-2" />
						<span class="text-xl">This person is 35 or older.</span>
					</div>
				</div>

			{:else if rejectedPrompt}
				<CloseCircleSolid class="mx-auto mb-4 text-red-600 w-36 h-36 dark:text-red-400" />
				<h3 class="mb-5 text-xl font-normal text-black dark:text-gray-400">
					This person is below 35.
				</h3>
			{:else if invalidPrompt}
				<ExclamationCircleSolid class="mx-auto mb-4 text-yellow-400 w-36 h-36 dark:text-yellow-400" />
				<h3 class="mb-5 text-xl font-normal text-black dark:text-gray-400">
					Invalid ID. Please try again.
				</h3>
			{/if}
			<Button on:click={onNewScan}>New Scan</Button>
		</div>
	</Modal>
</slot>

<style>
	
</style>