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

function formatDate(date: Date): string {
	const day: string = date.getDate().toString().padStart(2, '0');
	const month: string = date.toLocaleString('default', { month: 'long' });
	const year: number = date.getFullYear();
	return `${day} ${month} ${year}`;
}

function generateQRCode(user: any, mode: number = 1): string {
	const dob: string = new Date(user.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	switch (mode) {
		case 1:
			return JSON.stringify({
				DateIssued: formatDate(new Date()),
				Issuer: "PSA",
				subject: {
					Suffix: user.suffix,
					lName: user.lastName.toUpperCase(),
					fName: user.firstName.toUpperCase(),
					mName: user.middleName.toUpperCase(),
					sex: user.sex,
					BF: "[1,1]",
					DOB: dob,
					POB: user.placeOfBirth,
					PCN: user.pcn,
				},
				alg: "EDDSA",
				signature: "TU9TSVAgaXMgYXdlc29tZSE=",
			});
		case 2:
			return JSON.stringify({
				bd: user.dateOfBirth,
				bf: null,
				bt: user.bloodType,
				iat: 1234567890,
				id: "ABC1234",
				iss: "national-id.gov.ph",
				ms: user.maritalStatus,
				n_f: user.firstName.toUpperCase(),
				n_l: user.lastName.toUpperCase(),
				n_m: user.middleName.toUpperCase(),
				n_s: user.suffix,
				p: user.photo,
				pcn: (user.pcn).replace('-', ''),
				pob: user.placeOfBirth.toUpperCase(),
				s: user.sex,
				v: "2.0",
				z: "TU9TSVAgaXMgYXdlc29tZSE="
			});
		default:
			return "";
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const pcn: string | null = url.searchParams.get("pcn");

	if (!pcn) {
		return json({ error: "PCN is required" }, { status: 400 });
	}

	try {
		const result = await db.select().from(usersTable).where(eq(usersTable.pcn, pcn));

		if (result.length === 0) {
			return json({ error: "Invalid credentials" }, { status: 404 });
		}

		const user = result[0];

		const qrCodeData = generateQRCode(user);

		return json({ user, qrCodeData });
	} catch (error: unknown) {
		logger.error({ error }, "Database error");
		return json({ error: "Internal Server Error" }, { status: 500 });
	}
};