<script lang="ts">
	import { onMount } from 'svelte';
	import { stream, error, status } from '../stores.js';

	onMount(() => {
		return () => {
			// stopMedia();
		};
	});

	const isMediaStream = (
		candidate: MediaStream | MediaSource | Blob | null
	): candidate is MediaStream => candidate !== null && 'getTracks' in candidate;

	type UseUserMediaStatusType = 'pending' | 'resolved' | 'rejected' | 'stopped';

	interface UseUserMediaType {
		stopMediaStream: () => void;
		startMediaStream: () => void;
	}

	function setStatus(params: UseUserMediaStatusType) {
		$status = params;
	}

	export const useUserMedia = (): UseUserMediaType => {
		$stream = null;
		$error = null;
		$status = 'stopped';

		function setError(params: string) {
			$error = params;
		}

		function setStream(params: MediaStream) {
			$stream = params;
		}

		const startMediaStream = (): void => {
			setStatus('pending');

			navigator.mediaDevices
				.getUserMedia({
					audio: false,
					video: {
						facingMode: 'environment'
					}
				})
				.then((userStream) => {
					setStream(userStream);
					setStatus('resolved');
				})
				.catch((err) => {
					setError(err);
					setStatus('rejected');
				});
		};

		const stopMediaStream = stopMedia;
		return { stopMediaStream, startMediaStream };
	};

	function stopMedia(): void {
		if (isMediaStream($stream)) {
			$stream.getTracks().forEach((track) => {
				track.stop();
				$stream.removeTrack(track);
			});

			setStatus('stopped');
		}
	}
</script>