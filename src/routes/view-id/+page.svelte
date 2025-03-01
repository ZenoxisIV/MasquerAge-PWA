<script lang="ts">
	import { Button, Card, Label, Input, Modal, Toggle } from 'flowbite-svelte';
    import IDCard from "./IDCard.svelte";

	let pcn: string = "";
	let user: any;
    let qrCodeData: string;
	let errorMessage: string;
	let showModal: boolean = false;
	let isDigital: boolean = true;

	function toggleDigitalID(): void {
		isDigital = !isDigital;
	}

	async function fetchUserDetails(): Promise<void> {
		if (!pcn.trim()) return;

		try {
			const response = await fetch(`/api/user?pcn=${encodeURIComponent(pcn.trim())}&&bool=${encodeURIComponent(isDigital)}`);
			const data = await response.json();

			if (response.ok) {
				user = data.user;
                qrCodeData = data.qrCodeData;
				showModal = true;
			} else {
				errorMessage = data.error || "Invalid credentials";
			}
		} catch (error) {
			errorMessage = "Error fetching data";
		}
	}
</script>

<svelte:head>
	<title>MasquerAge | View</title>
	<meta name="description" content="View MOSIP ID" />
</svelte:head>

<section>
	<Card class="mx-auto mt-6 mb-6" size="sm" border={false}>
		<form class="flex flex-col space-y-6" on:submit|preventDefault={fetchUserDetails}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white text-center">MOSIP Anonymous Age Verification</h3>
			<Label class="space-y-2">
				<div class="mb-2">
					<span>PCN:</span>
				</div>
				<Input bind:value={pcn} type="text" name="pcn" placeholder="Enter your PCN" required />
			</Label>
			<Toggle size="default" checked on:click={toggleDigitalID}>Digital ID Version</Toggle>
			<Button type="submit" class="w-full">View MOSIP ID</Button>
		</form>

		{#if errorMessage}
			<p class="text-red-500 mt-2">{errorMessage}</p>
		{/if}
	</Card>
	<Card class="mx-auto mt-6 mb-6" size="sm" border={false}>
		<div class="text-normal text-center font-medium text-gray-500 dark:text-gray-300">
			Note: This page is for convenience purposes only. Never expose personal information without consent.
		</div>
	</Card>
</section>

<Modal title="View MOSIP ID" size="lg" bind:open={showModal} autoclose outsideclose>
	{#if user}
		<IDCard
			pcn={user.pcn}
			lastName={user.lastName} 
			firstName={user.firstName} 
			middleName={user.middleName} 
			dateOfBirth={user.dateOfBirth} 
			qrCodeData={qrCodeData} 
			photo={user.photo}
			sex={user.sex}
			bloodType={user.bloodType}
			maritalStatus={user.maritalStatus}
			isDigital={isDigital}
		/>
  	{/if}
    <svelte:fragment slot="footer">
        <Button color="alternative">Close</Button>
    </svelte:fragment>
</Modal>