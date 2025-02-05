<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	let verifiedPrompt: boolean = false, rejectedPrompt: boolean = false, invalidPrompt: boolean = false;
	let modalOpen: boolean;

	export let decodedData: string;
	export let onNewScan: () => void;

	async function validateID(data: string) {
		let parsedData;

		try {
			parsedData = JSON.parse(data);
		} catch (error) {
			console.error(error);
			return;
		}

		// TODO: query database for uin (map pcn to uin)
		let pcn: string = parsedData.PCN;
		let dateOfBirth: Date = new Date(parsedData.subject.DOB)
		let dob: string = new Date(dateOfBirth.getTime() + Math.abs(dateOfBirth.getTimezoneOffset() * 60000)).toISOString().split('T')[0].replace(/-/g, '/');

		// Note: for now, we hardcode custom values for testing
		let uin: string = "";
		dob = "";

		try {
			const response = await fetch('http://127.0.0.1:3000/dob', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uin, dob })
			});
			const data = await response.json();

			if (data.authStatus) {
				const birthYear: number = new Date(dateOfBirth).getFullYear();
				const currentYear: number = new Date().getFullYear();
				const age: number = currentYear - birthYear;

				if (age >= 35) {
					verifiedPrompt = true;	
				} else {
					rejectedPrompt = true;
				}
			} else {
				invalidPrompt = true;
			}

			modalOpen = verifiedPrompt || rejectedPrompt || invalidPrompt;

		} catch (error) {
			console.error(error);
		}
	}
</script>

<slot {decodedData}>
	{#if decodedData}
		{validateID(decodedData)}
	{/if}
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