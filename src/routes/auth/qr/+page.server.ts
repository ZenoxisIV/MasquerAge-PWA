import type { PageServerLoad } from "./$types";
import { randomUUID } from "crypto";

export const load: PageServerLoad = async () => {
    const sessionId = randomUUID();
    const userId = randomUUID();
    return { sessionId, userId };
};