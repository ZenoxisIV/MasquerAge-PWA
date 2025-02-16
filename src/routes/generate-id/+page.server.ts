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
    const firstName = formData.get("firstName") as string | null;
    const middleName = formData.get("middleName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const suffix = formData.get("suffix") as string | null;
    const sex = formData.get("sex") as string | null;
    const dateOfBirth = new Date(formData.get("dateOfBirth") as string);
    const placeOfBirth = formData.get("placeOfBirth") as string | null;
    const imageAttachment = formData.get("imageAttachment") as string | null;
    
    await db.insert(usersTable).values({
      pcn: generatePCN(),
      uin: generateUIN(),
      firstName,
      middleName,
      lastName,
      suffix,
      sex,
      dateOfBirth,
      placeOfBirth,
      photo: imageAttachment
    });
  },
};
