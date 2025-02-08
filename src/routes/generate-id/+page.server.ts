import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';

export const actions = {
  default: async (event) => {
    // TODO: needs server-side validation
    const formData = await event.request.formData();

    await db.insert(usersTable).values({
      pcn: generatePCN(),
      uin: generateUIN()
    });

  },
};

function generatePCN(): string {
  const generateSegment = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  return `${generateSegment()}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

function generateUIN(): string {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}