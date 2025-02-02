<script lang="ts">
	let uin: string = '';
	let dateOfBirth: string = '';
	let responseMessage: string = '';

	async function validateID() {
		let dob = new Date(dateOfBirth).toISOString().split('T')[0].replace(/-/g, '/');
		try {
			const response = await fetch('http://127.0.0.1:3000/dob', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uin, dob })
			});
			const data = await response.json();
			responseMessage = data.authStatus;
		} catch (error) {
			console.error('Error:', error);
			responseMessage = 'An error occurred';
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="MOSIP ID Validation" />
</svelte:head>

<section class="container">
	<h1>MOSIP ID Validation</h1>
	<div class="form-group">
		<label for="uin">UIN:</label>
		<input type="text" id="uin" bind:value={uin} placeholder="Enter your UIN" />
	</div>

	<div class="form-group">
		<label for="dob">Date of Birth:</label>
		<input type="date" id="dob" bind:value={dateOfBirth} />
	</div>

	<button class="submit-button" on:click={validateID}>Submit</button>

	<p class="response-message">{responseMessage}</p>
</section>

<style>
	.container {
		background: white;
		padding: 2em;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 500px;
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 1em;
		color: #333;
	}

	.form-group {
		margin-bottom: 1em;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5em;
		color: #555;
	}

	input {
		width: calc(100% - 1em);
		padding: 0.5em;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.submit-button {
		background-color: #007BFF;
		color: white;
		padding: 0.75em 1.5em;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1em;
	}

	.submit-button:hover {
		background-color: #0056b3;
	}

	.response-message {
		margin-top: 1em;
		color: #333;
		font-size: 2em;
	}
</style>