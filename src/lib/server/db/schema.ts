import * as t from "drizzle-orm/pg-core";

export const sex = t.pgEnum('sex', ["Male", "Female"]);
export const maritalStatus = t.pgEnum('maritalStatus', ["Single", "Married", "Divorced", "Separated", "Widowed"]);
export const bloodType = t.pgEnum('bloodType', ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

export const usersTable = t.pgTable('users', {
    id: t.varchar("id", { length: 16 }).primaryKey(),
    username: t.varchar("username", { length: 30 }).notNull(),
    password_hash: t.varchar("password_hash", { length: 256 }).notNull()
});

export const userDemographicsTable = t.pgTable('user_demographics', {
    id: t.varchar("pcn", { length: 16 }).primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
    pcn: t.varchar("pcn", { length: 19 }),
    uin: t.varchar("uin", { length: 10 }).notNull(),
    firstName: t.varchar("firstName", { length: 256 }).notNull(),
    middleName: t.varchar("middleName", { length: 256 }),
    lastName: t.varchar("lastName", { length: 256 }).notNull(),
    suffix: t.varchar("suffix", { length: 5 }),
    sex: sex(),
    maritalStatus: maritalStatus(),
    bloodType: bloodType(),
    dateOfBirth: t.date().notNull(),
    placeOfBirth: t.varchar("placeOfBirth", { length: 256 }).notNull(),
    photo: t.text("photo")
});

export const sessionsTable = t.pgTable('sessions', {
    id: t.varchar("id", { length: 128 }).primaryKey(),
    expiresAt: t.timestamp('expires_at', { 
        withTimezone: true,
        mode: "date"
    }).notNull(),
    user_id: t.text('user_id')
        .notNull()
        .references(() => usersTable.id),
});
