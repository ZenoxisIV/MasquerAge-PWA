CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pcn` text,
	`uin` text,
	`firstName` text,
	`middleName` text,
	`lastName` text,
	`suffix` text,
	`sex` text,
	`dateOfBirth` date,
	`placeOfBirth` text,
	`photo` text,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
