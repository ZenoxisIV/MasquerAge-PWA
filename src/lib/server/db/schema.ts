import { mysqlTable, serial, text, int, date } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
	id: int("id").primaryKey().autoincrement(),
	pcn: text("pcn"),
	uin: text("uin"),
	firstName: text("firstName"),
	middleName: text("middleName"),
	lastName: text("lastName"),
	suffix: text("suffix"),
	sex: text("sex"),
	dateOfBirth: date(),
	placeOfBirth: text("placeOfBirth")
});