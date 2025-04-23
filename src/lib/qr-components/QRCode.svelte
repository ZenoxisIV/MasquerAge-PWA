<script lang='ts'>
    import QRCode from 'qrcode';
	import { onMount } from 'svelte';

    interface Props {
        text: string,
        margin?: number,
        width?: number
    }

    let { text, margin = 2, width = 176 }: Props = $props();

    let canvas: HTMLCanvasElement;
    onMount(() => {
        QRCode.toCanvas(canvas, text, { margin, width });
    })

</script>

<canvas bind:this={canvas}></canvas>