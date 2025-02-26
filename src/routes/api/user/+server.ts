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

function generateQRCode(user: any): string {
	const dob: string = new Date(user.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

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
		signature: "gbmFAsdp09KL2dsalTYnC32OP",
	});
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