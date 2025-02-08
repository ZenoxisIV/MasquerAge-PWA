<script lang="ts">
	import { Button, Datepicker, Label, Input, Select, Modal, P } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
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
	<title>Generate ID</title>
	<meta name="description" content="Generate QR" />
</svelte:head>

<section>
	<Modal bind:open={openModal} size="xs" autoclose>
		<div class="text-center">
		  <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure the details are correct?</h3>
		  <Button color="green" class="me-2" on:click={confirmSubmission}>Yes, I'm sure</Button>
		  <Button color="alternative">No, cancel</Button>
		</div>
	</Modal>

	<form id="mosip-form" class="flex flex-col space-y-6" method="POST">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Create a MOSIP ID</h3>
		<div class="flex space-x-4">
			<Label class="space-y-2 flex-1">
				<span>First Name:</span>
				<Input type="text" name="firstName" placeholder="John" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Middle Name:</span>
				<Input type="text" name="middleName" placeholder="Michael" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Last Name:</span>
				<Input type="text" name="lastName" placeholder="Doe" required />
			</Label>
		</div>
		<div class="flex space-x-4">
			<Label class="space-y-2 flex-1">
				<span>Suffix (if any):</span>
				<Input type="text" name="suffix" placeholder="Jr." />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Sex:</span>
				<Select name="sex" items={sexAtBirth} placeholder="Choose an option..." required />
			</Label>
			<Label class="space-y-2 flex-1">
				<span>Date of Birth:</span>
				<Input type="text" name="dateOfBirth" placeholder="YYYY-MM-DD" required />
			</Label>
		</div>
		<Label class="space-y-2">
			<span>Place of Birth:</span>
			<Input class="w-1/2" type="text" name="placeOfBirth" placeholder="Quezon City, Manila" required />
		</Label>

		<Button type="button" class="w-1/4" on:click={() => {openModal = true}}>Generate MOSIP ID</Button>
	</form>
</section>

<style>

</style>