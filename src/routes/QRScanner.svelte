<script lang="ts">
	import { onMount } from 'svelte';
    import QRBorder from '$lib/qr-components/QRBorder.svelte';
	import jsQR from 'jsqr';

    interface Props {
        /** @return {(result: string): void} callback - consumes a JSON string containing QR code data */
        onScan: (result: string) => void,
        /** @param {boolean} active - flag if scanner should be active or not. */
        active?: boolean
    }

    let { onScan, active = true }: Props = $props();

	let canvas: HTMLCanvasElement;
    let video: HTMLVideoElement;

	onMount(() => {
        canvas = document.createElement('canvas');
        video.setAttribute('playsinline', 'true'); // tell iOS we don't want fullscreen
        startMedia();
    });

    $effect(() => {
        if (active && !video.srcObject)
            startMedia();
    })

    const startMedia = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: { facingMode: 'environment' }
            })
            .then(stream => {
                video.srcObject = stream;
                video.play().catch(console.error);
            })
            .catch(console.error);
    }

    const stopMedia = () => {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
        });

        video.srcObject = null;
    }

    const handleCanPlay = () => {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        requestAnimationFrame(draw);
    }

    const draw = () => {
        const ctx = canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: true,
        });
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.drawImage(video, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const qr = jsQR(imageData.data, width, height);

        if (qr) {
            onScan(qr.data);
            stopMedia()
            return;
        }

        requestAnimationFrame(draw);
    }
</script>

<div class={`relative w-full max-w-[500px]`}>
	<div class="relative overflow-hidden pb-[100%] rounded-[10%]">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video 
			bind:this={video} 
            oncanplay={handleCanPlay}
			class="absolute top-0 left-0 w-full h-full rounded-[10%] object-cover outline-none transform scale-x-[-1]"
		></video>
		<QRBorder />
	</div>
</div>