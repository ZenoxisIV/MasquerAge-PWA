<script lang="ts">
	import { Button, Datepicker, Label, Input, Select, Modal } from 'flowbite-svelte';
	import IDCard from "./IDCard.svelte";

	let firstName: string, middleName: string, lastName: string, 
		suffix: string, sex: string, placeOfBirth: string,
			pcn: string;

	let dateOfBirth: Date;

	let sexAtBirth = [
		{ value: 'Male', name: 'Male' },
		{ value: 'Female', name: 'Female' },
	];

	let qrCodeData: string = "";

	let clickOutsideModal: boolean = false;

	function generateQRCode() {
		clickOutsideModal = true;
		pcn = generatePCN();

		qrCodeData = JSON.stringify(
			{ 
				DateIssued: formatDate(new Date()),
				Issuer: "PSA",
				subject: {
					Suffix: suffix,
					lName: lastName.toUpperCase,
					fName: firstName.toUpperCase(),
					mName: middleName.toUpperCase(),
					sex: sex,
					BF: "[1,1]",
					DOB: new Date(dateOfBirth.getTime() + Math.abs(dateOfBirth.getTimezoneOffset() * 60000)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
					POB: placeOfBirth,
					PCN: pcn,
				},
				alg: "EDDSA",
				signature: ""
			}
		);
	}

	function generatePCN(): string {
		let number = "";
		for (let i = 0; i < 4; i++) {
			number += Math.floor(1000 + Math.random() * 9000).toString();
			if (i < 3) {
				number += "-";
			}
		}
		return number;
	}

	function formatDate(date: Date): string {
		const day = date.getDate().toString().padStart(2, '0');
		const month = date.toLocaleString('default', { month: 'long' });
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}
</script>

<svelte:head>
	<title>Generate QR</title>
	<meta name="description" content="Generate QR" />
</svelte:head>

<section>
	<Modal title="New MOSIP ID" bind:open={clickOutsideModal} autoclose outsideclose>
		<IDCard lastName={lastName} firstName={firstName} middleName={middleName} dateOfBirth={dateOfBirth} 
			pcn={pcn} qrCodeData={qrCodeData} />
		<svelte:fragment slot="footer">
			<Button color="alternative">Close</Button>
		</svelte:fragment>
	</Modal>

	<form class="flex flex-col space-y-6" on:submit|preventDefault={generateQRCode}>
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
		<Button type="submit" class="w-1/6">Generate MOSIP ID</Button>
	</form>
</section>

<style>

</style>