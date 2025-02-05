<script lang="ts">
	import { Button, Card, Datepicker, Label, Input, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	
	let verifiedPrompt: boolean = false, rejectedPrompt: boolean = false, invalidPrompt: boolean = false;
	let modalOpen: boolean;
	
	let uin: string = '';
	let dateOfBirth: Date;

	async function validateID() {
		let dob: string = new Date(dateOfBirth.getTime() + Math.abs(dateOfBirth.getTimezoneOffset() * 60000)).toISOString().split('T')[0].replace(/-/g, '/');
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

<svelte:head>
	<title>Home</title>
	<meta name="description" content="MOSIP Age Verification" />
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
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">MOSIP Anonymous Age Verification</h3>
			<Label class="space-y-2">
				<span>UIN:</span>
				<Input type="text" name="uin" bind:value={uin} placeholder="Enter your UIN" required />
			</Label>
			<Label class="space-y-2">
				<span>Date of Birth:</span>
				<Datepicker dateFormat={{ year: 'numeric', month: 'numeric', day: 'numeric' }} bind:value={dateOfBirth} required />
			</Label>
			<Button type="submit" class="w-full">Validate ID</Button>
		</form>
	</Card>
	<Card class="mx-auto mt-6 mb-6" size="sm" border={false}>
		<a href="/qr-scanner" class="text-primary-700 text-center font-medium hover:underline dark:text-primary-500">Verify using a QR Code</a>
		<div class="text-normal text-center font-medium text-gray-500 dark:text-gray-300">
			New to AgeCloak? <a href="/generate-qr" class="text-primary-700 hover:underline dark:text-primary-500"> Create a MOSIP ID </a>
		</div>
	</Card>
</section>

<style>

</style>