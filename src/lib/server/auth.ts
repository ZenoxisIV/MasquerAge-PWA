import { Lucia } from "lucia";
import { NeonHTTPAdapter } from '@lucia-auth/adapter-postgresql'
import { client } from "$lib/server/db/index";

// Issue: https://github.com/lucia-auth/lucia/issues/1424
class OverrideNeonHTTPAdapter extends NeonHTTPAdapter {
    override async getSessionAndUser(
        sessionId: string
    ): ReturnType<
        (typeof NeonHTTPAdapter)['prototype']['getSessionAndUser']
    > {
        const [session, user] = await super.getSessionAndUser(sessionId);

        if (session) {
        session.expiresAt = new Date(session.expiresAt);
        }

        return [session, user];
    }
}

const adapter = new OverrideNeonHTTPAdapter(client, {
    user: 'users',
    session: 'sessions',
})

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
        secure: import.meta.env.PROD,
        },
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            username: attributes.username,
        }
    },
})

interface DatabaseUserAttributes {
    id: string
    username: string
}

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: DatabaseUserAttributes
    }
}