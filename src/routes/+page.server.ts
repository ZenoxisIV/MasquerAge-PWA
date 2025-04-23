import type { PageServerLoad } from "./$types";
import { randomUUID } from "crypto";

export const load: PageServerLoad = ({ depends }) => {
    const sessionId = randomUUID() as string;
	depends('state:sessionId');
    return { sessionId };
};