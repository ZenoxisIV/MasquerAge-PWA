import { mysqlTable, serial, text, int } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
	id: int("id").primaryKey().autoincrement(),
	pcn: text("pcn"),
	uin: text("uin")
});