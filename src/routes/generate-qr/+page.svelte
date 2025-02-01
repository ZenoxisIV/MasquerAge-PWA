<script lang="ts">
	import QrCode from "svelte-qrcode";
	//import IDCard from "./IDCard.svelte";

	let inputData = {
		Suffix: "",
		lName: "",
		fName: "",
		mName: "",
		sex: "",
		BF: "[1,1]",
		DOB: "",
		POB: "",
		PCN: generatePCN(),
	};

	let qrCodeData = "";

	function generateQRCode() {
		qrCodeData = JSON.stringify(
			{ 
				DateIssued: formatDate(new Date()),
				Issuer: "PSA",
				subject: inputData,
				alg: "EDDSA",
				signature: ""
			}
		);
	}

	function generatePCN(): string {
		let number = "";
		for (let i = 0; i < 4; i++) {
			number += Math.floor(1000 + Math.random() * 9000).toString();
			if (i < 3) {
				number += "-";
			}
		}
		return number;
	}

	function formatDate(date: Date): string {
		const day = date.getDate().toString().padStart(2, '0');
		const month = date.toLocaleString('default', { month: 'long' });
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}
</script>

<svelte:head>
	<title>Generate QR</title>
	<meta name="description" content="Generate QR" />
</svelte:head>

<section>
	<h1>Generate QR</h1>

	<h2>
		<strong>Philippine National ID</strong>
	</h2>

	<br>

	<div class="fields-container">
		<div>
			<label for="firstName">First Name:</label>
			<input type="text" id="firstName" bind:value={inputData.fName} />
		</div>

		<div>
			<label for="middleName">Middle Name:</label>
			<input type="text" id="middleName" bind:value={inputData.mName} />
		</div>

		<div>
			<label for="lastName">Last Name:</label>
			<input type="text" id="lastName" bind:value={inputData.lName} />
		</div>
	</div>

	<div class="fields-container">
		<div>
			<label for="sex">Sex:</label>
			<select id="sex" bind:value={inputData.sex}>
				<option value="">Select</option>
				<option value="Male">Male</option>
				<option value="Female">Female</option>
			</select>
		</div>

		<div>
			<label for="dateOfBirth">Date of Birth:</label>
			<input type="date" id="dateOfBirth" bind:value={inputData.DOB} />
		</div>

		<div>
			<label for="placeOfBirth">Place of Birth:</label>
			<input type="text" id="placeOfBirth" bind:value={inputData.POB} />
		</div>
	</div>

	<button on:click={generateQRCode}>Generate QR Code</button>

	{#if qrCodeData}
		<div class="qr-container">
			<div class="qr-data">
				<pre>{qrCodeData}</pre>
			</div>
			<QrCode value={qrCodeData} size=300 />
		</div>
	{/if}
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

	div {
		margin-bottom: 1rem;
	}

	.fields-container {
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
	}

	input, select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 0.75rem 1.5rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	.qr-container {
		display: flex;
		align-items: center;
		margin-top: 1rem;
		border: 1px solid #ccc;
		padding: 1rem;
		border-radius: 4px;
		background-color: #f9f9f9;
	}

	.qr-data {
		margin-right: 1rem;
	}

	pre {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
</style>