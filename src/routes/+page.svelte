<script lang='ts'>
	import { Button, Card, Modal, Spinner } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
    import { source } from 'sveltekit-sse';
    import QRCode from "$lib/qr-components/QRCode.svelte";
	import { invalidate } from "$app/navigation";

    let { data } = $props();

    let sessionId = $derived(data.sessionId);
    let src = $derived(source(`/api/scan/${sessionId}`));
    let result = $derived(src.select('message'));

	let isValidSession = $state(true);
    let isAdult = $state(false);

    let modalOpen = $state(false);

    $effect(() => {
        try {
            const res = JSON.parse($result);
            if (res.error) {
                isValidSession = false;
            } else {
                ({ isAdult } = res);
            }
            modalOpen = true;
            countdown.start(5, () => {
                if (modalOpen) modalOpen = false
            });
        } catch(error) {

        }
        console.log($result);
    })

    let timer = $state(0);
    const countdown = {
        value: 0,
        start: function(duration: number, callback: () => void) {
            timer = duration;
            this.value = duration;
            const interval = setInterval(() => {
                this.value--;
                timer = this.value;
                if (this.value === 0) {
                    clearInterval(interval);
                    callback();
                }
            }, 1000);
        }
    }

    const handleModalClose = async () => {
        src.close();
        invalidate('state:sessionId');
        isValidSession = true;
    }
</script>

<Modal onclose={() => handleModalClose} bind:open={modalOpen} size="xs" autoclose outsideclose>
    <div class="text-center">
        {#if !isValidSession}
            <ExclamationCircleSolid class="mx-auto mb-4 text-yellow-400 w-36 h-36 dark:text-yellow-400" />
            <h3 class="text-xl font-normal text-black dark:text-gray-400">
                Invalid ID. Please try again.
            </h3>

        {:else if isAdult}
            <div class="flex flex-col items-center">
                <div class="relative">
                    {#if $result.photo}
                        <img src="{`data:image/png;base64,${$result.photo}`}" alt="Profile" class="w-60 h-60 rounded-lg border-4 border-green-600 dark:border-green-400" />
                    {:else}
                        <div class="w-24 h-24 rounded-lg border-4 border-gray-300 dark:border-gray-500 flex items-center justify-center text-gray-500 text-sm">
                            No Image
                        </div>
                    {/if}
                </div>
                <div class="mt-4 flex items-center gap-2 text-lg font-normal text-black dark:text-gray-400">
                    <CheckCircleSolid class="w-6 h-6 text-green-600 dark:text-green-400 stroke-white stroke-2" />
                    <span class="text-xl">This person is 35 or older.</span>
                </div>
            </div>

        {:else}
            <CloseCircleSolid class="mx-auto mb-4 text-red-600 w-36 h-36 dark:text-red-400" />
            <h3 class="text-xl font-normal text-black dark:text-gray-400">
                This person is below 35.
            </h3>
        {/if}
        <p class="mt-1 mb-5 text-lg font-normal text-black dark:text-gray-400">
            Closing in {timer} second(s)
        </p>
        <Button onclick={() => modalOpen = false}>Close</Button>
    </div>
</Modal>
<div class="py-12 flex justify-center">
    <Card horizontal class="relative flex justify-center">
        <div class={`transition-(filter) duration-200 ${$result === 'confirm' ? 'blur-xs' : ''}`}>
            <QRCode text={sessionId} />
        </div>
        {#if $result === 'confirm'}
        <div class="absolute top-1/2 left-1/2 -translate-1/2">
            <Spinner color="blue" size="10"/>
        </div>
        {/if}
    </Card>
</div>