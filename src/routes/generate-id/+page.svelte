<script lang="ts">
	import { Button, Label, Input, Select, Fileupload, Helper } from 'flowbite-svelte';
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
				<div class="mb-2">
					<span>First Name:</span>
				</div>
				<Input type="text" name="firstName" placeholder="John" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Middle Name:</span>
				</div>
				<Input type="text" name="middleName" placeholder="Michael" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Last Name:</span>
				</div>
				<Input type="text" name="lastName" placeholder="Doe" required />
			</Label>
		</div>

		<div class="flex space-x-4">
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Suffix (if any):</span>
				</div>
				<Input type="text" name="suffix" placeholder="Jr." />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Sex:</span>
				</div>
				<Select name="sex" items={sexAtBirth} placeholder="Choose an option..." required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Date of Birth:</span>
				</div>
				<Input type="text" name="dateOfBirth" placeholder="YYYY-MM-DD" required />
			</Label>
		</div>

		<Label class="space-y-2">
			<div class="mb-2">
				<span>Place of Birth:</span>
			</div>
			<Input class="w-1/2" type="text" name="placeOfBirth" placeholder="Quezon City, Manila" required />
		</Label>

		<Label class="space-y-2">
			<div class="mb-2">
				<span>Add Photo:</span>
			</div>
			<Fileupload on:change={onFileInput} />
			<Helper>PNG or JPG (MAX. 800x400px).</Helper>
			<input type="hidden" name="imageAttachment" bind:value={fileBase64} />
		</Label>

		<Button type="submit" class="w-1/4">Generate MOSIP ID</Button>
	</form>
</section>