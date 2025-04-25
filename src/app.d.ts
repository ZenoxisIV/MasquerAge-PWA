// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/vanillajs';

import type { Session } from "lucia";

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
			user: User | null;
		}
	}
}


export {};
