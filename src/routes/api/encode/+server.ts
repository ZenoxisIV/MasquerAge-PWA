import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable } from "$lib/server/db/schema";
import pino from "pino";

const logger: pino.Logger = pino({
    level: import.meta.env.MODE === "production" ? "info" : "debug",
    transport: import.meta.env.MODE === "development" ? 
        { 
            target: "pino-pretty", 
            options: { 
                colorize: true,
                levelFirst: true,
                translateTime: true
            }
        } : undefined,
});

const fetchWithTimeout = (url: string, options: RequestInit, timeout: number = 5000): Promise<Response> => {
    return Promise.race([
        fetch(url, options),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout))
    ]);
};

export const GET: RequestHandler = async ({ url }): Promise<Response> => {
    try {
        const pcn: string | null = url.searchParams.get("pcn");
        const dobDB: string | null = url.searchParams.get("dob");

        if (!pcn || !dobDB) {
            return json({ error: "PCN and Date of Birth are required" }, { status: 400 });
        }

        const dobMOSIP: string = dobDB.split("T")[0].replace(/-/g, '/');

        const uinResult: { uin: string }[] = await db
            .select({ uin: usersTable.uin })
            .from(usersTable)
            .where(eq(usersTable.pcn, pcn))
            .catch((err: unknown) => {
                logger.error({ err }, "Database query error");
                throw new Error("Database query failed");
            });

        if (!uinResult.length) {
            return json({ authStatus: false, error: "Invalid credentials" }, { status: 404 });
        }

        const uin: string = uinResult[0].uin;

        // Verify DOB via fastAPI
        const response: Response = await fetchWithTimeout("http://127.0.0.1:3000/dob", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uin, dob: dobMOSIP })
        }, 5000).catch((err: unknown) => {
            logger.error({ err }, "External API request error");
            throw new Error("Failed to verify DOB");
        });

        if (!response.ok) {
            logger.error({ status: response.status, statusText: response.statusText }, "External API response error");
            return json({ authStatus: false, error: "Verification service unavailable" }, { status: 502 });
        }

        const result: { authStatus: boolean } = await response.json().catch((err: unknown) => {
            logger.error({ err }, "Error parsing API response");
            throw new Error("Invalid API response format");
        });

        if (result.authStatus) {
            const getAge = (birthDate: string | Date): number => {
                const date: Date = birthDate instanceof Date ? birthDate : new Date(birthDate);
                return Math.floor((new Date().getTime() - date.getTime()) / 3.15576e+10);
            };

            return json({ authStatus: true, age: getAge(dobDB) });
        } else {
            return json({ authStatus: false, error: "Invalid ID" }, { status: 401 });
        }
    } catch (error: unknown) {
        logger.error({ error }, "Server error");
        return json({ error: "Internal server error" }, { status: 500 });
    }
};
