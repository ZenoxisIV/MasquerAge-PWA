<script lang="ts">
	import { Button, Card, Datepicker, Label, Input } from 'flowbite-svelte';

	let uin: string = '';
	let dateOfBirth: Date;
	let responseMessage: string = '';

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
				responseMessage = 'ID Validation: ' + data.authStatus

				const birthYear: number = new Date(dateOfBirth).getFullYear();
				const currentYear: number = new Date().getFullYear();
				const age: number = currentYear - birthYear;

				if (age < 18) {
					responseMessage += ' (User is under 18)';
				} else {
					responseMessage += ' (User is 18 or older)';
				}
			} else {
				responseMessage = 'ID Validation: ' + data.authStatus
				responseMessage += ' (Invalid ID)'
			}

		} catch (error) {
			console.error('Error:', error);
			responseMessage = 'An error occurred';
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="MOSIP Age Verification" />
</svelte:head>

<section>
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

	<p class="t-normal text-gray-700 dark:text-gray-400 leading-tight">{responseMessage}</p>
</section>

<style>

</style>