import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable, userDemographicsTable } from "$lib/server/db/schema";
import pino from "pino";
import sharp from "sharp";

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

async function generateQRCode(user: any): Promise<string> {
	const processedImg = await sharp(Buffer.from(user.photo, "base64"))
		.greyscale()
		.resize(36)
		.sharpen()
		.toFormat("webp")
		.toBuffer();

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
		p: processedImg.toString("base64"),
		pcn: (user.pcn).replace(/-/g, ''),
		pob: user.placeOfBirth.toUpperCase(),
		s: user.sex,
		v: "2.0",
		z: "TU9TSVAgaXMgYXdlc29tZSE="
	});
}

export const GET: RequestHandler = async ({ url }) => {
	const pcn: string | null = url.searchParams.get("pcn");

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

		const qrCodeData = await generateQRCode(user);

		return json({ user, qrCodeData });
	} catch (error: unknown) {
		logger.error({ error }, "Database error");
		return json({ error: "Internal Server Error" }, { status: 500 });
	}
};