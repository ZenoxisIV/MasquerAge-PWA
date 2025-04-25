import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./register/$types";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, "/login");
	}
	return {
		username: event.locals.user.username
	};
};