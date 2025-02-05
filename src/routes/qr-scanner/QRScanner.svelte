<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { stream, error, status } from './stores.js';

	import jsQR from 'jsqr';

	import QRBorder from './QRBorder.svelte';
	import QRData from './QRData.svelte';

	import UserMedia from './utils/use-usermedia.svelte';

	export let result: any = null;
	export let stopMediaStream: any = null;
	let startMediaStream: any = null;

	const dispatch = createEventDispatcher();

	$: active = !result;

	let video: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let useUserMedia: any;

	onMount(() => {
		({ stopMediaStream, startMediaStream } = useUserMedia());

		return () => {
			stopMediaStream();
			video.srcObject = null;
		};
	});

	const startCapturing = (): void => {
		if (!canvas || !video) return;

		const context = canvas.getContext('2d');

		if (!context) return;

		const { width, height } = canvas;

		context.drawImage(video, 0, 0, width, height);

		const imageData = context.getImageData(0, 0, width, height);
		const qrCode = jsQR(imageData.data, width, height);

		if (qrCode === null) {
			setTimeout(startCapturing, 750);
		} else {
			result = qrCode.data;
			dispatch('successfulScan', qrCode.data);

			stopMediaStream();
			video.srcObject = null;
		}
	};

	const handleCanPlay = (): void => {
		if (canvas === null || canvas === null || video === null || video === null) {
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		if ($error !== null) {
			// TODO: show dialog to user with an error
		} else {
			startCapturing();
		}
	};

	$: if ($status === 'resolved' && video !== null && $stream) {
		video.srcObject = $stream;
		video.play().catch(console.error);
	}

	$: if (active && $status === 'stopped' && startMediaStream) {
		startMediaStream();
	}
</script>

<UserMedia bind:useUserMedia />

<div class={`relative w-full max-w-[500px] ${active ? '' : 'hidden'}`}>
	<div class="relative overflow-hidden pb-[100%] rounded-[10%]">
		<canvas bind:this={canvas} class="hidden"></canvas>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video 
			bind:this={video} 
			on:canplay={handleCanPlay} 
			class="absolute top-0 left-0 w-full h-full rounded-[10%] object-cover outline-none transform scale-x-[-1]"
		></video>
		<QRBorder />
	</div>
</div>

<slot {result}>
	<QRData active={result !== null} decodedData={result as string} onNewScan={() => (result = null)} />
</slot>

<style>

</style>