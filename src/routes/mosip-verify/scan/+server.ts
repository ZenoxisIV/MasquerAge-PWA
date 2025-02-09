import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { data } = await request.json();
		if (!data) return json({ error: 'No data provided' }, { status: 400 });

		let parsedData: any;
		try {
			parsedData = JSON.parse(data);
		} catch (error) {
			return json({ error: 'Invalid QR Code format' }, { status: 400 });
		}

		const pcn: string = parsedData.PCN;
		const dateOfBirth: Date = new Date(parsedData.subject.DOB);
		const dobDB: string = new Date(dateOfBirth.getTime() + Math.abs(dateOfBirth.getTimezoneOffset() * 60000))
		.toISOString().split('T')[0];
		const dobMOSIP: string = dobDB.replace(/-/g, '/');

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
