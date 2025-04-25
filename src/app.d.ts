// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/vanillajs';

declare global {
	namespace App {
		interface Locals {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
	}
}


export {};
