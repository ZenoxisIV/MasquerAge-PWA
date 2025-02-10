import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable } from "$lib/server/db/schema";

export const GET: RequestHandler = async ({ url }) => {
    const pcn: string | null = url.searchParams.get("pcn");
    const dobDB: string | null = url.searchParams.get("dob");

    if (!pcn) {
        return json({ error: "PCN is required" }, { status: 400 });
    }

    if (!dobDB) {
        return json({ error: "Date of birth is required" }, { status: 400 });
    }

    const dobMOSIP: string = dobDB.replace(/-/g, '/');

    try {
        const uinResult = await db.select({ uin: usersTable.uin }).from(usersTable).where(eq(usersTable.pcn, pcn));
        const uin: string | null = uinResult[0]?.uin;

        if (!uin) return json({ authStatus: false, error: 'Invalid credentials' }, { status: 404 });

        // Verify DOB via fastAPI
        const response = await fetch('http://127.0.0.1:3000/dob', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uin, dob: dobMOSIP })
        });

        const result = await response.json();

        if (result.authStatus) {
            const getAge = (birthDate: string | Date): number => {
                const date = birthDate instanceof Date ? birthDate : new Date(birthDate);
                return Math.floor((new Date().getTime() - date.getTime()) / 3.15576e+10);
            };
              
            const age: number = getAge(dobDB);

            return json({ authStatus: true, age });
        } else {
            return json({ authStatus: false, error: 'Invalid ID' }, { status: 401 });
        }
    } catch (error) {
        console.error('Server error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
