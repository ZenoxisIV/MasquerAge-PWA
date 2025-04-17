import path from 'path';
import { fileURLToPath } from 'url';
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable, authSessionsTable } from "$lib/server/db/schema";
import pino from "pino";
import { produce } from 'sveltekit-sse';
import { FASTAPI_URL } from '$env/static/private';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'backend_server.log');

const logger: pino.Logger = pino({
    level: import.meta.env.MODE === "production" ? "info" : "debug",
    transport: {
        target: 'pino/file',
        options: {
            destination: logFilePath,
            mkdir: true
        }
    }
});

/**
 * ReadableStream controller, takes two arguments: event and data, and facilitates wrting messages into the stream.
 */
type Emitter = (event: string, message: string) => void;

const clients = new Map<string,Emitter>();

export const POST: RequestHandler = async ({ request, params }) => {
    const browserSessionID = params.id!;
    return produce(
        function start({ emit }) {
            emit('message', 'authStart');
            clients.set(browserSessionID, emit);
        },
        {
            stop() {
                clients.delete(browserSessionID);
            }
        }
    );
};

// must protect this route!
export const PUT: RequestHandler = async ({ request, params }) => {
    const { userId } = await request.json();
    const authSessionId = params.id!;
    try {
        // await db.insert(authSessionsTable).values({
        //     id: authSessionId,
        //     userId,
        //     isValid: true,
        //     expiresAt: new Date(Date.now() + 1000 * 60 * 10) // 10 mins
        // });

        const emitter = clients.get(authSessionId);
        if (!emitter)
            return json({ error: "Invalid session" }, { status: 400 });

        emitter('message', 'authConfirm');

    } catch (error) { // neon db fail
        return json({ error: "Invalid session" }, { status: 400 });
    }

    return json({ status: 200 });
}

export const PATCH: RequestHandler = async ({ request, params }) => {
    const authSessionId = params.id!;
    // const isValid = await invalidateSession(authSessionId);
    // if (!isValid)
    //     return json({ error: "Invalid session" }, { status: 400 });

    const { pcn, dob } = await request.json(); // photo?
    const uin = await getUIN(pcn);
    if (!uin)
        return json({ error: "Invalid session" }, { status: 400 });

    let authResult: { authStatus: boolean, responseTime: string, errorMessages: string};
    try {
        const response = await fetch(`${FASTAPI_URL}/dob/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({uin, dob: dob.replace(/-/g, "/")})
        });

        if (!response.ok) // fastapi fail
            return json({ error: "Invalid session" }, { status: 400 });

        authResult = await response.json();
    } catch (error) {
        console.log(error);
        return json({ error: "Invalid session" }, { status: 400 });
    }

    const { authStatus } = authResult;
    if (!authStatus) // mosip fail
        return json({ error: "Invalid session "}, { status: 400 });

    const datedob = new Date(dob);
    const isLegalAge = datedob.setFullYear(datedob.getFullYear() + 35) < Date.now();

    const emitter = clients.get(authSessionId);
    if (!emitter)
        return json({ error: "Invalid session "}, { status: 400 });

    emitter('message', 'authComplete');
    emitter('result', JSON.stringify({ isLegalAge })); // include photo?

    return new Response();
}

async function invalidateSession (authSessionId: string) {
    try {
        const queryResult = await db
            .select({
                userId: authSessionsTable.userId,
                isValid: authSessionsTable.isValid,
                expiresAt: authSessionsTable.expiresAt})
            .from(authSessionsTable)
            .where(eq(authSessionsTable.id, authSessionId));

        if (queryResult.length !== 1)
            throw new Error('Invalid DB query');

        const { userId, isValid, expiresAt } = queryResult[0];
        if (!isValid || Date.now() > expiresAt.valueOf()) // also need to check if userid matches id in request?
            throw new Error('Session expired');

        await db.update(authSessionsTable)
            .set({ isValid: false })
            .where(eq(authSessionsTable.id, authSessionId));

    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

async function getUIN (pcn: string) {
    let uin: string = '';
    try {
        const queryResult = await db
            .select({ uin: usersTable.uin })
            .from(usersTable)
            .where(eq(usersTable.pcn, pcn));

        if (queryResult.length !== 1)
            throw new Error('Invalid DB query');

        ({ uin } = queryResult[0]);
    } catch (error) { // neon db fail
        console.log(error);
    }
    return uin;
}