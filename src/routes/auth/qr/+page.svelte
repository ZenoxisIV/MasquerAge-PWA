<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid, QuestionCircleOutline } from 'flowbite-svelte-icons';
	import QRScanner from '$lib/qr-components/QRScanner.svelte';

	let { data } = $props();
	let { userId } = data;
	let sessionId = $state('');

	let isOpenConfModal = $state(false);
	let isOpenAuthModal = $state(false);
	let isValidSession = $state(true);
	let result: { isAdult?: boolean; photo?: string } = $state({});

	async function handleScan(result: string) {
		sessionId = result;
		try {
			const response = await fetch(`/api/scan/${sessionId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId })
			});

			if (!response.ok) {
				throw new Error('an error occured while scanning');
			}

			isOpenConfModal = true;
			countdown.start(15, () => {
				if (isOpenConfModal) {
					isOpenConfModal = false;
				}
			})
		} catch(error) {
			console.error(error);
			isValidSession = false;
			isOpenAuthModal = true;
			countdown.start(5, () => {
				if (isOpenAuthModal) isOpenAuthModal = false;
			})
		}
	}

	const pcn = '1128-4572-2969-9457';
    const dob = '1985/04/29';
	async function authID() {
		isOpenConfModal = false;
		try {
			const response = await fetch(`/api/scan/${sessionId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pcn, dob })
			});

			if (response.ok) {
				result = await response.json();
			} else {
				throw new Error("Invalid ID");
			}
		} catch (error) {
			console.error(error);
			isValidSession = false;
		}

		isOpenAuthModal = true;
		countdown.start(5, () => {
			if (isOpenAuthModal) isOpenAuthModal = false;
		});
	}

	let timer = $state(0);
	const countdown = {
		value: 0,
		interval: null as null | NodeJS.Timeout,
		start: function(duration: number, callback: () => void) {
			timer = duration;
			this.value = duration;
			if (this.interval) clearInterval(this.interval);
			this.interval = setInterval(() => {
				this.value--;
				timer = this.value;
				if (this.value === 0) {
					clearInterval(this.interval!);
					this.interval = null;
					callback();
				}
			}, 1000);
		}
	}

	const handleAuthModalClose = () => {
        isValidSession = true;
		result = {};
    }
</script>

<svelte:head>
	<title>MasquerAge | Home</title>
	<meta name="description" content="MOSIP Anonymous Age Verification" />
</svelte:head>

<section>
	<Modal bind:open={isOpenConfModal} size="xs">
		<div class="text-center">
			<ExclamationCircleSolid class="mx-auto mb-4 text-grey-400 w-16 h-16 dark:text-grey-400" />
			<h3 class="text-xl font-normal text-black dark:text-gray-400">
				You are verifying your age. <br> Only confirm if the QR is loading and waiting for a response.
			</h3>
		</div>
		<div class="text-center">
			<Button color="alternative" class="me-2 text-md" onclick={() => isOpenConfModal = false}>No, cancel</Button>
			<Button color="red" class="text-md" onclick={() => authID()}>Yes, I'm sure</Button>
		</div>
		<div class="flex items-baseline text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
			<QuestionCircleOutline class="inline w-3 h-3 me-1" />
			<div>
				If someone sent you this QR code, please <span class="font-bold text-red">DO NOT</span> confirm! Someone may be trying to impersonate you.
			</div>
		</div>
	</Modal>
	<Modal onclose={handleAuthModalClose} bind:open={isOpenAuthModal} size="xs" autoclose outsideclose>
		<div class="text-center">
			{#if !isValidSession}
				<ExclamationCircleSolid class="mx-auto mb-4 text-yellow-400 w-36 h-36 dark:text-yellow-400" />
				<h3 class="text-xl font-normal text-black dark:text-gray-400">
					Invalid ID. Please try again.
				</h3>

			{:else if result.isAdult}
				<div class="flex flex-col items-center">
					<div class="relative">
						{#if result.photo}
							<img src="{`data:image/png;base64,${result.photo}`}" alt="Profile" class="w-60 h-60 rounded-lg border-4 border-green-600 dark:border-green-400" />
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
			<Button onclick={() => isOpenAuthModal = false}>Close</Button>
		</div>
	</Modal>
	<section class="flex flex-col justify-center items-center flex-[0.6] pt-15 pb-15">
		<QRScanner onScan={handleScan} active={!isOpenAuthModal}/>
	</section>
</section>