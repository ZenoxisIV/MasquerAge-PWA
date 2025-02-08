<script lang="ts">
	import { Button, Card, Label, Input, Modal } from 'flowbite-svelte';
    import IDCard from "./IDCard.svelte";

	let pcn: string = "";
	let user: any;
    let qrCodeData: string;
	let errorMessage: string;
	let showModal: boolean = false;

	async function fetchUserDetails(): Promise<void> {
		if (!pcn.trim()) return;

		try {
			const response = await fetch(`/view-id/user?pcn=${encodeURIComponent(pcn)}`);
			const data = await response.json();

			if (response.ok) {
				user = data.user;
                qrCodeData = data.qrCodeData;
				showModal = true;
			} else {
				errorMessage = data.error || "User not found";
			}
		} catch (error) {
			errorMessage = "Error fetching data";
		}
	}
</script>

<svelte:head>
	<title>View MOSIP ID</title>
	<meta name="description" content="View MOSIP ID" />
</svelte:head>

<section>
	<Card class="mx-auto mt-6 mb-6" size="sm" border={false}>
		<form class="flex flex-col space-y-6" on:submit|preventDefault={fetchUserDetails}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">MOSIP Anonymous Age Verification</h3>
			<Label class="space-y-2">
				<span>PCN:</span>
				<Input bind:value={pcn} type="text" name="pcn" placeholder="Enter your PCN" required />
			</Label>
			<Button type="submit" class="w-full">View MOSIP ID</Button>
		</form>

		{#if errorMessage}
			<p class="text-red-500 mt-2">{errorMessage}</p>
		{/if}
	</Card>
</section>

<Modal title="View MOSIP ID" bind:open={showModal} autoclose outsideclose>
    {#if user}
        <IDCard lastName={user.lastName} firstName={user.firstName} middleName={user.middleName} dateOfBirth={user.dateOfBirth} 
        pcn={user.pcn} qrCodeData={qrCodeData} />
    {/if}
    <svelte:fragment slot="footer">
        <Button color="alternative">Close</Button>
    </svelte:fragment>
</Modal>

<style>

</style>