import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const session = await lucia.validateSession(event.cookies.get(lucia.sessionCookieName) ?? "");

	event.locals.session = session.session;

	// 👇 Assign the user to locals if session is valid
	if (session.session && session.user) {
		event.locals.user = session.user;
	}

	return resolve(event);
};
