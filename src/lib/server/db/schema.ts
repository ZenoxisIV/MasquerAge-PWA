import { mysqlTable } from 'drizzle-orm/mysql-core';
import * as t from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable('users', {
	id: t.int("id").primaryKey().autoincrement(),
	pcn: t.varchar("pcn", { length: 19 }).notNull(),
	uin: t.varchar("uin", { length: 10 }).notNull(),
	firstName: t.varchar("firstName", { length: 256 }).notNull(),
	middleName: t.varchar("middleName", { length: 256 }),
	lastName: t.varchar("lastName", { length: 256 }).notNull(),
	suffix: t.varchar("suffix", { length: 5 }),
	sex: t.mysqlEnum(["Male", "Female"]).notNull(),
	maritalStatus: t.mysqlEnum(["Single", "Married", "Divorced", "Separated", "Widowed"]).notNull(),
	bloodType: t.mysqlEnum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).notNull(),
	dateOfBirth: t.date().notNull(),
	placeOfBirth: t.varchar("placeOfBirth", { length: 256 }).notNull(),
	photo: t.text("photo")
});