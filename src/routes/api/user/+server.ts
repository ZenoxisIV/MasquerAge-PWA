import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable, userDemographicsTable } from "$lib/server/db/schema";
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

function generateQRCode(user: any, isDigital: string | null = 'false'): string {
	const dob: string = new Date(user.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	if (isDigital === 'false') {
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
	} else {
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
			pcn: (user.pcn).replace(/-/g, ''),
			pob: user.placeOfBirth.toUpperCase(),
			s: user.sex,
			v: "2.0",
			z: "TU9TSVAgaXMgYXdlc29tZSE="
		});
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const pcn: string | null = url.searchParams.get("pcn");
	const isDigital: string | null = url.searchParams.get("bool");

	if (!pcn) {
		return json({ error: "PCN is required" }, { status: 400 });
	}

	try {
		const result = await db
		.select({
			pcn: usersTable.pcn,
			photo: usersTable.photo,
			firstName: userDemographicsTable.firstName,
			middleName: userDemographicsTable.middleName,
			lastName: userDemographicsTable.lastName,
			suffix: userDemographicsTable.suffix,
			sex: userDemographicsTable.sex,
			dateOfBirth: userDemographicsTable.dateOfBirth,
			placeOfBirth: userDemographicsTable.placeOfBirth,
			maritalStatus: userDemographicsTable.maritalStatus,
			bloodType: userDemographicsTable.bloodType
		})
		.from(usersTable)
		.innerJoin(userDemographicsTable, eq(usersTable.pcn, userDemographicsTable.pcn))
		.where(eq(usersTable.pcn, pcn));

		if (result.length === 0) {
			return json({ error: "Invalid credentials" }, { status: 404 });
		}

		const user = result[0];

		const qrCodeData = generateQRCode(user, isDigital);

		return json({ user, qrCodeData });
	} catch (error: unknown) {
		logger.error({ error }, "Database error");
		return json({ error: "Internal Server Error" }, { status: 500 });
	}
};