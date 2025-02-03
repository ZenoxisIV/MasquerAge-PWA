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
	<Card class="mx-auto max-w-md mt-6 mb-6">
		<h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">MOSIP Anonymous Age Verification</h5>
		<div class="mb-6">
			<Label for="uin" class="block mb-2">UIN:</Label>
			<Input type="text" id="uin" bind:value={uin} placeholder="Enter your UIN" />
		</div>

		<div class="mb-6">
			<Label for="dateOfBirth" class="block mb-2">Date of Birth:</Label>
			<Datepicker dateFormat={{ year: 'numeric', month: 'numeric', day: 'numeric' }} bind:value={dateOfBirth} />
		</div>

		<Button on:click={validateID}>Validate ID</Button>
	</Card>

	<Card class="mx-auto max-w-md">
		<p class="t-normal text-gray-700 dark:text-gray-400 leading-tight text-center">Have a MOSIP ID?</p>
		<a href="/qr-scanner" class="t-semi-bold text-blue-500 text-center hover:underline">Scan using a QR Code</a>
	</Card>

	<p class="t-normal text-gray-700 dark:text-gray-400 leading-tight">{responseMessage}</p>
</section>

<style>

</style>