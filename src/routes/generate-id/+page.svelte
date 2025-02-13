<script lang="ts">
	import { Button, Label, Input, Select } from 'flowbite-svelte';
	import { base64 } from "@sveu/browser";

	let sexAtBirth = [
		{ value: 'Male', name: 'Male' },
		{ value: 'Female', name: 'Female' },
	];

	let file: File | null = null;
	let fileBase64 = "";

	function onFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files?.length) {
			file = target.files[0];

			const base64Store = base64(file);
			base64Store.subscribe(value => {
				fileBase64 = value.replace(/^data:image\/\w+;base64,/, "");
			});
		}
	}
</script>

<svelte:head>
	<title>AgeCloak | Create</title>
	<meta name="description" content="Create a MOSIP ID" />
</svelte:head>

<section>
	<form class="flex flex-col space-y-6" method="POST">
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

		<input class="mt-2" name="imageFile" type="file" accept="image/*" on:change={onFileInput} />
		<input type="hidden" name="imageAttachment" bind:value={fileBase64} />

		<Button type="submit" class="w-1/4">Generate MOSIP ID</Button>
	</form>
</section>

<style>

</style>