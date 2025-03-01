<script lang="ts">
	import { Button, Card, Label, Input, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	
	let verifiedPrompt: boolean = false, rejectedPrompt: boolean = false, invalidPrompt: boolean = false;
	let modalOpen: boolean;
	let pcn: string = "";
	let dateOfBirth: string;
	let errorMessage: string;
	
	async function validateID(): Promise<void> {
		verifiedPrompt = rejectedPrompt = invalidPrompt = false;
		modalOpen = false;

		if (!pcn.trim()) return;
		if (!dateOfBirth) return;

		dateOfBirth = new Date(dateOfBirth as string).toISOString().split('T')[0]; // YYYY-MM-DD

		try {
			const response = await fetch(`/api/encode?pcn=${encodeURIComponent(pcn)}&dob=${encodeURIComponent(dateOfBirth)}`);
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
			errorMessage = "Error fetching data";
		}
	}
</script>

<svelte:head>
	<title>MasquerAge | Home</title>
	<meta name="description" content="MOSIP Anonymous Age Verification" />
</svelte:head>

<section>
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
			<Button color="alternative">Close</Button>
		</div>
	</Modal>

	<Card class="mx-auto mt-6 mb-6" size="sm" border={false}>
		<form class="flex flex-col space-y-6" on:submit|preventDefault={validateID}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white text-center">MOSIP Anonymous Age Verification</h3>
			<Label class="space-y-2">
				<div class="mb-2">
					<span>PCN:</span>
				</div>
				<Input type="text" name="pcn" bind:value={pcn} placeholder="Enter your PCN" required />
			</Label>
			<Label class="space-y-2">
				<div class="mb-2">
					<span>Date of Birth:</span>
				</div>
				<Input type="date" name="dateOfBirth" bind:value={dateOfBirth} placeholder="YYYY-MM-DD" required />
			</Label>
			<Button type="submit" class="w-full">Validate ID</Button>
		</form>
	</Card>
	<Card class="mx-auto mt-6 mb-6" size="sm" border={false}>
		<a href="/qr-scanner" class="text-primary-700 text-center font-medium hover:underline dark:text-primary-500">Verify using a QR Code</a>
		<div class="text-normal text-center font-medium text-gray-500 dark:text-gray-300">
			New to MasquerAge? <a href="/generate-id" class="text-primary-700 hover:underline dark:text-primary-500"> Create a MOSIP ID </a>
		</div>
	</Card>
</section>