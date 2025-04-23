import type { PageServerLoad } from "./$types";
import { randomUUID } from "crypto";

export const load: PageServerLoad = () => {
    const userId = randomUUID() as string;
    return { userId };
};