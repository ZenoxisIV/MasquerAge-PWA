<script lang="ts">
	import { Button, Datepicker, Label, Input, Select, Modal } from 'flowbite-svelte';

	let firstName: string = $state();
	let middleName: string = $state();
	let lastName: string = $state();
	let suffix: string = $state();
	let sex: string = $state();
	let placeOfBirth: string = $state();
	let dateOfBirth: Date = $state();

	let sexAtBirth = [
		{ value: 'Male', name: 'Male' },
		{ value: 'Female', name: 'Female' },
	];

	let openModal: boolean = $state(false);

	function confirmSubmission() {
		const form = document.getElementById("mosip-form");
		if (form instanceof HTMLFormElement) {
			form.submit();
		} else {
			console.error("Form with ID 'mosip-form' not found or is not a form.");
		}
	}
</script>

<svelte:head>
	<title>Generate QR</title>
	<meta name="description" content="Generate QR" />
</svelte:head>

<section>
	<Modal title="Are you sure the details are correct?" bind:open={openModal} autoclose outsideclose>
		<svelte:fragment slot="footer">
			<Button on:click={confirmSubmission}>Submit</Button>
			<Button color="alternative" on:click={() => (openModal = false)}>Cancel</Button>
		</svelte:fragment>
	</Modal>

	<form id="mosip-form" class="flex flex-col space-y-6" method="POST">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Create a MOSIP ID</h3>
		<div class="flex space-x-4">
			<Label class="space-y-2 flex-1">
				<span>First Name:</span>
				<Input type="text" name="firstName" bind:value={firstName} placeholder="John" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Middle Name:</span>
				<Input type="text" name="MiddleName" bind:value={middleName} placeholder="Michael" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Last Name:</span>
				<Input type="text" name="lastName" bind:value={lastName} placeholder="Doe" required />
			</Label>
		</div>
		<div class="flex space-x-4">
			<Label class="space-y-2 flex-1">
				<span>Suffix (if any):</span>
				<Input type="text" name="suffix" bind:value={suffix} placeholder="Jr." />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Sex:</span>
				<Select items={sexAtBirth} bind:value={sex} placeholder="Choose an option..." required />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Date of Birth:</span>
				<Datepicker dateFormat={{ year: 'numeric', month: 'numeric', day: 'numeric' }} bind:value={dateOfBirth} required />
			</Label>
		</div>
		<Label class="space-y-2">
			<span>Place of Birth:</span>
			<Input class="w-1/2" type="text" name="placeOfBirth" bind:value={placeOfBirth} placeholder="Quezon City, Manila" required />
		</Label>

		<Button type="button" class="w-1/4" on:click={() => {openModal = true}}>Generate MOSIP ID</Button>
	</form>
</section>

<style>

</style>