import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';

function generatePCN(): string {
  const generateSegment = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  return `${generateSegment()}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

function generateUIN(): string {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}

export const actions = {
  default: async (event) => {
    // TODO: needs server-side validation
    const formData = await event.request.formData();
    const firstName: FormDataEntryValue | null = formData.get("firstName");
    const middleName: FormDataEntryValue | null = formData.get("middleName");
    const lastName: FormDataEntryValue | null = formData.get("lastName");
    const suffix: FormDataEntryValue | null = formData.get("suffix");
    const sex: FormDataEntryValue | null = formData.get("sex");
    const dateOfBirth: Date = new Date(formData.get("dateOfBirth") as string);
    const placeOfBirth: FormDataEntryValue | null = formData.get("placeOfBirth");

    await db.insert(usersTable).values({
      pcn: generatePCN(),
      uin: generateUIN(),
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      suffix: suffix,
      sex: sex,
      dateOfBirth: dateOfBirth,
      placeOfBirth: placeOfBirth
    });

  },
};