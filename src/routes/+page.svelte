<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import QRScanner from './QRScanner.svelte';

	let verifiedPrompt = false, rejectedPrompt = false, invalidPrompt = false;
	let modalOpen = false;
	let pcn = "", dateOfBirth: string
	let result: { isAdult?: boolean; photo?: string } = {};

	let qrResult: string | null = null;

	let timer: number;

	function startCountdown(duration: number, callback: () => void): void {
		const intervalId = setInterval(() => {
			timer--;
			duration--;
			if (duration < 0) {
				clearInterval(intervalId);
				callback();
			}
		}, 1000);
	}

	async function validateID(): Promise<void> {
		verifiedPrompt = rejectedPrompt = invalidPrompt = false;
		modalOpen = false;

		if (!pcn.trim() || !dateOfBirth) return;

		dateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0]; // YYYY-MM-DD format

		try {
			const response = await fetch(`/api/encode?pcn=${encodeURIComponent(pcn)}&dob=${encodeURIComponent(dateOfBirth)}`);
			const res = await response.json();

			if (response.ok) {
				result = res;
				result.isAdult ? (verifiedPrompt = true) : (rejectedPrompt = true);
			} else {
				invalidPrompt = true;
			}

			modalOpen = true;
		} catch (error) {
			console.error(error);
			invalidPrompt = true;
			modalOpen = true;
		}

		if (modalOpen) {
			timer = 5;
			startCountdown(timer, () => {
				modalOpen = false;
			});
		}
	}
</script>

<svelte:head>
	<title>MasquerAge | Home</title>
	<meta name="description" content="MOSIP Anonymous Age Verification" />
</svelte:head>

<section>
	<Modal bind:open={modalOpen} size="xs" autoclose outsideclose>
		<div class="text-center">
			{#if verifiedPrompt}
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

			{:else if rejectedPrompt}
				<CloseCircleSolid class="mx-auto mb-4 text-red-600 w-36 h-36 dark:text-red-400" />
				<h3 class="text-xl font-normal text-black dark:text-gray-400">
					This person is below 35.
				</h3>
			{:else if invalidPrompt}
				<ExclamationCircleSolid class="mx-auto mb-4 text-yellow-400 w-36 h-36 dark:text-yellow-400" />
				<h3 class="text-xl font-normal text-black dark:text-gray-400">
					Invalid ID. Please try again.
				</h3>
			{/if}
			<p class="mt-1 mb-5 text-lg font-normal text-black dark:text-gray-400">
				Closing in {timer} second(s)
			</p>
			<Button>Close</Button>
		</div>
	</Modal>

	<section class="flex flex-col justify-center items-center flex-[0.6] pt-15 pb-15">
		<QRScanner bind:result={qrResult} />
	</section>
</section>
