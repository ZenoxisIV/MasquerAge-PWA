import path from 'path';
import { fileURLToPath } from 'url';
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq, param } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable, ageSessionsTable } from "$lib/server/db/schema";
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
 * ReadableStream controller, takes two arguments: event and data, and facilitates writing messages into the stream.
 */
type Emitter = (event: string, message: string) => void;

// move this to db for statelessness and use event forwarders?
const clients = new Map<string,Emitter>();

export const POST: RequestHandler = async ({ request, params }) => {
    const browserSessionID = params.id!;
    return produce(
        function start({ emit }) {
            clients.set(browserSessionID, emit);
            emit('message', '');
        },
        {
            stop() {
                clients.delete(browserSessionID);
            }
        }
    );
};

// protect these routes
export const PUT: RequestHandler = async ({ request, params }) => {
    const { userId } = await request.json();
    const authSessionId = params.id!;

    const emitter = clients.get(authSessionId);
    if (!emitter)
        return json({ error: "Invalid session "}, { status: 400 });

    try {
        await db.insert(ageSessionsTable).values({
            id: authSessionId,
            userId,
            isValid: true,
            expiresAt: new Date(Date.now() + 1000 * 60 * 10) // 10 mins
        });

    } catch (error) { // neon db fail
        console.log(error)
        emitter('message', JSON.stringify({ error: "Invalid ID" }));
        return json({ error: "Invalid session" }, { status: 400 });
    }

    emitter('message', 'confirm');
    return new Response();
}

export const PATCH: RequestHandler = async ({ request, params }) => {
    const authSessionId = params.id!;

    const emitter = clients.get(authSessionId);
    if (!emitter)
        return json({ error: "Invalid session "}, { status: 400 });

    const isValid = await invalidateSession(authSessionId);
    if (!isValid)
        return json({ error: "Invalid session" }, { status: 400 });

    const { pcn, dob } = await request.json(); // photo?
    const uin = await getUIN(pcn);
    if (!uin) {
        emitter('message', JSON.stringify({ error: "Invalid ID" }));
        return json({ error: "Invalid session" }, { status: 400 });
    }

    let authResult: { authStatus: boolean, responseTime: string, errorMessages: string};
    try {
        const response = await fetch(`${FASTAPI_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({uin, dob: dob.replace(/-/g, "/")})
        });

        if (!response.ok)
            throw new Error('FastAPI server error');

        authResult = await response.json();
    } catch (error) {
        console.log(error);
        emitter('message', JSON.stringify({ error: "Invalid ID" }));
        return json({ error: "Invalid session" }, { status: 400 });
    }

    const { authStatus } = authResult;
    if (!authStatus) {// mosip fail
        emitter('message', JSON.stringify({ error: "Invalid ID" }));
        return json({ error: "Invalid session "}, { status: 400 });
    }

    const datedob = new Date(dob);
    const isAdult = datedob.setFullYear(datedob.getFullYear() + 35) < Date.now();

    const body = { isAdult } // include photo?
    emitter('message', JSON.stringify(body));

    db.delete(ageSessionsTable)
        .where(eq(ageSessionsTable.id, authSessionId));

    return json(body, { status: 200 });
}

async function invalidateSession (authSessionId: string) {
    try {
        const queryResult = await db
            .select({
                userId: ageSessionsTable.userId,
                isValid: ageSessionsTable.isValid,
                expiresAt: ageSessionsTable.expiresAt})
            .from(ageSessionsTable)
            .where(eq(ageSessionsTable.id, authSessionId));

        if (queryResult.length !== 1)
            throw new Error('Invalid DB query');

        const { userId, isValid, expiresAt } = queryResult[0];
        if (!isValid || Date.now() > expiresAt.valueOf()) // also need to check if userid matches id in request?
            throw new Error('Session expired');

        await db.update(ageSessionsTable)
            .set({ isValid: false })
            .where(eq(ageSessionsTable.id, authSessionId));

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