CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pcn` varchar(19) NOT NULL,
	`uin` varchar(10) NOT NULL,
	`firstName` varchar(256) NOT NULL,
	`middleName` varchar(256),
	`lastName` varchar(256) NOT NULL,
	`suffix` varchar(5),
	`sex` enum('Male','Female') NOT NULL,
	`maritalStatus` enum('Single','Married','Divorced','Separated','Widowed') NOT NULL,
	`bloodType` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
	`dateOfBirth` date NOT NULL,
	`placeOfBirth` varchar(256) NOT NULL,
	`photo` text,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
