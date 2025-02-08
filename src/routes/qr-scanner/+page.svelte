<script lang="ts">
	import QRScanner from './QRScanner.svelte';

    let result: string | null = null;
</script>

<svelte:head>
	<title>QR Scanner</title>
	<meta name="description" content="QR Scanner" />
</svelte:head>

<section class="flex flex-col justify-center items-center flex-[0.6]">
	<h3 class="text-xl font-medium text-gray-900 dark:text-white">MOSIP Anonymous Age Verification</h3>
    <QRScanner bind:result />
</section>

<style>

</style>
