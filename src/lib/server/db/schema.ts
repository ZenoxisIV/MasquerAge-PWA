import * as t from "drizzle-orm/pg-core";

export const sex = t.pgEnum('sex', ["Male", "Female"]);
export const maritalStatus = t.pgEnum('maritalStatus', ["Single", "Married", "Divorced", "Separated", "Widowed"]);
export const bloodType = t.pgEnum('bloodType', ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

export const usersTable = t.pgTable('users', {
    pcn: t.varchar("pcn", { length: 19 }).primaryKey(),
    uin: t.varchar("uin", { length: 10 }).notNull(),
    photo: t.text("photo")
});

export const userDemographicsTable = t.pgTable('user_demographics', {
    pcn: t.varchar("pcn", { length: 19 }).primaryKey().references(() => usersTable.pcn, { onDelete: "cascade" }),
    firstName: t.varchar("firstName", { length: 256 }).notNull(),
    middleName: t.varchar("middleName", { length: 256 }),
    lastName: t.varchar("lastName", { length: 256 }).notNull(),
    suffix: t.varchar("suffix", { length: 5 }),
    sex: sex(),
    maritalStatus: maritalStatus(),
    bloodType: bloodType(),
    dateOfBirth: t.date().notNull(),
    placeOfBirth: t.varchar("placeOfBirth", { length: 256 }).notNull()
});
