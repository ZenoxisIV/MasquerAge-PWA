<script lang="ts">
	import { Button, Label, Input, Select, Fileupload, Helper } from 'flowbite-svelte';
	import { base64 } from "@sveu/browser";
	import imageCompression from 'browser-image-compression';
	import { loadImage, cropImage, convertToGrayscale, canvasToFile } from './utils/canvasHandlers'

	let sexAtBirth = [
		{ value: 'Male', name: 'Male' },
		{ value: 'Female', name: 'Female' },
	];

	let maritalStatusOptions = [
		{ value: 'Single', name: 'Single' },
		{ value: 'Married', name: 'Married' },
		{ value: 'Divorced', name: 'Divorced' },
		{ value: 'Separated', name: 'Separated' },
		{ value: 'Widowed', name: 'Widowed' },
	];

	let bloodTypeOptions = [
		{ value: 'A+', name: 'A+' },
		{ value: 'A-', name: 'A-' },
		{ value: 'B+', name: 'B-' },
		{ value: 'AB+', name: 'AB-' },
		{ value: 'O+', name: 'O-' },
	];

	let imageFile: File | null = null;
	let fileBase64 = "";

	async function onFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files?.length) {
			imageFile = target.files[0];

			const options = {
				maxSizeMB: 0.001,
				maxWidthOrHeight: 128,
				initialQuality: 0.7,
				useWebWorker: true,
				alwaysKeepResolution: false,
			}

			try {
				const image = await loadImage(imageFile);
				const croppedCanvas = cropImage(image, 0.6);
				const bwCanvas = convertToGrayscale(croppedCanvas);

				const croppedFile = await canvasToFile(bwCanvas, imageFile.type);
					const compressedFile = await imageCompression(croppedFile, options);
					const base64Store = base64(compressedFile);
					base64Store.subscribe(value => {
						fileBase64 = value.replace(/^data:image\/\w+;base64,/, "");
					});
			} catch (error) {
				console.log(error);
			}
		}
	}
</script>

<svelte:head>
	<title>MasquerAge | Create</title>
	<meta name="description" content="Create a MOSIP ID" />
</svelte:head>

<section class="p-4 md:p-8">
	<form class="flex flex-col space-y-6" method="POST">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white text-center">Create a MOSIP ID</h3>

		<div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>First Name:</span>
				</div>
				<Input type="text" name="firstName" placeholder="Juan" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Middle Name:</span>
				</div>
				<Input type="text" name="middleName" placeholder="Martinez" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Last Name:</span>
				</div>
				<Input type="text" name="lastName" placeholder="Dela Cruz" required />
			</Label>
		</div>

		<div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Suffix (if any):</span>
				</div>
				<Input type="text" name="suffix" placeholder="e.g., I, III, IV" />
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
				<Input type="date" name="dateOfBirth" required />
			</Label>
		</div>

		<div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
			<Label class="space-y-2">
				<div class="mb-2">
					<span>Place of Birth:</span>
				</div>
				<Input class="w-full md:w-100" type="text" name="placeOfBirth" placeholder="Manila City, Metro Manila" required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Civil Status:</span>
				</div>
				<Select name="maritalStatus" items={maritalStatusOptions} placeholder="Choose an option..." required />
			</Label>
			<Label class="space-y-2 flex-1">
				<div class="mb-2">
					<span>Blood Type:</span>
				</div>
				<Select name="bloodType" items={bloodTypeOptions} placeholder="Choose an option..." required />
			</Label>
		</div>

		<div class="flex flex-col md:space-x-4 space-y-4 md:space-y-0">
			<Label class="space-y-2">
				<div class="mb-2">
					<span>Add Photo:</span>
				</div>
				<Fileupload on:change={onFileInput} />
				<Helper>PNG or JPG (MAX. 800x400px).</Helper>
				<input type="hidden" name="imageAttachment" bind:value={fileBase64} />
			</Label>
		</div>

		<Button type="submit" class="w-full md:w-1/4 mx-auto">Generate MOSIP ID</Button>
	</form>
</section>
