<script lang="ts">
	import { onMount } from 'svelte';
	import { stream, error, status } from './stores.js';
	import jsQR from 'jsqr';

	import QRBorder from './QRBorder.svelte';
	import QRData from './QRData.svelte';
	import UserMedia from './utils/use-usermedia.svelte';

	export let result: string | null = null;
	export let stopMediaStream: (() => void) | null = null;

	interface UserMediaHandlers {
  		stopMediaStream: () => void;
  		startMediaStream: () => void;
	}

	let startMediaStream: (() => void) | null = null;

	$: active = !result;

	let video: HTMLVideoElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let useUserMedia: () => UserMediaHandlers;

	let rootElement: HTMLDivElement | null = null;

	onMount(() => {
		const handlers = useUserMedia();
		stopMediaStream = handlers.stopMediaStream;
		startMediaStream = handlers.startMediaStream;
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

			if (rootElement) {
				rootElement.dispatchEvent(new CustomEvent('successfulScan', { detail: qrCode.data }));
			}

			stopMediaStream?.();
			if (video) {
				video.srcObject = null;
			}
		}
	};

	const handleCanPlay = (): void => {
		if (!canvas || !video) return;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		if ($error !== null) {
			console.error($error);
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

<div bind:this={rootElement} class={`relative w-full max-w-[500px] ${active ? '' : 'hidden'}`}>
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