<div>
	<div class="qr-border qr-border--top-left"></div>
	<div class="qr-border qr-border--top-right"></div>
	<div class="qr-border qr-border--bottom-left"></div>
	<div class="qr-border qr-border--bottom-right"></div>
</div>

<style>
	:root {
		--border-thickness: 3px;
		--border-radius: 40%;
		--border-offset: 5%;
		--border-color: #cbe4f3;
	}

	.qr-border {
		position: absolute;

		width: 20%;
		height: 20%;
	}

	.qr-border--top-left {
		top: var(--border-offset);
		left: var(--border-offset);

		border-top: var(--border-thickness) solid var(--border-color);
		border-left: var(--border-thickness) solid var(--border-color);
		border-top-left-radius: var(--border-radius);
	}

	.qr-border--top-right {
		top: var(--border-offset);
		right: var(--border-offset);

		border-top: var(--border-thickness) solid var(--border-color);
		border-right: var(--border-thickness) solid var(--border-color);
		border-top-right-radius: var(--border-radius);
	}

	.qr-border--bottom-left {
		bottom: var(--border-offset);
		left: var(--border-offset);

		border-bottom: var(--border-thickness) solid var(--border-color);
		border-left: var(--border-thickness) solid var(--border-color);
		border-bottom-left-radius: var(--border-radius);
	}

	.qr-border--bottom-right {
		right: var(--border-offset);
		bottom: var(--border-offset);

		border-right: var(--border-thickness) solid var(--border-color);
		border-bottom: var(--border-thickness) solid var(--border-color);
		border-bottom-right-radius: var(--border-radius);
	}
</style>