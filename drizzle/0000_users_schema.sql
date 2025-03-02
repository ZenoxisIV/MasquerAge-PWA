CREATE TYPE "public"."bloodType" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."maritalStatus" AS ENUM('Single', 'Married', 'Divorced', 'Separated', 'Widowed');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TABLE "user_demographics" (
	"pcn" varchar(19) PRIMARY KEY NOT NULL,
	"firstName" varchar(256) NOT NULL,
	"middleName" varchar(256),
	"lastName" varchar(256) NOT NULL,
	"suffix" varchar(5),
	"sex" "sex",
	"maritalStatus" "maritalStatus",
	"bloodType" "bloodType",
	"dateOfBirth" date NOT NULL,
	"placeOfBirth" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"pcn" varchar(19) PRIMARY KEY NOT NULL,
	"uin" varchar(10) NOT NULL,
	"photo" text
);
--> statement-breakpoint
ALTER TABLE "user_demographics" ADD CONSTRAINT "user_demographics_pcn_users_pcn_fk" FOREIGN KEY ("pcn") REFERENCES "public"."users"("pcn") ON DELETE cascade ON UPDATE no action;