<script lang="ts">
	import QRScanner from './QRScanner.svelte';

    let result: string | null = null;
</script>

<svelte:head>
	<title>QR Scanner</title>
	<meta name="description" content="QR Scanner" />
</svelte:head>

<section>
    <QRScanner bind:result />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
