CREATE TYPE "public"."bloodType" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."maritalStatus" AS ENUM('Single', 'Married', 'Divorced', 'Separated', 'Widowed');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"pcn" varchar(19) NOT NULL,
	"uin" varchar(10) NOT NULL,
	"firstName" varchar(256) NOT NULL,
	"middleName" varchar(256),
	"lastName" varchar(256) NOT NULL,
	"suffix" varchar(5),
	"sex" "sex",
	"maritalStatus" "maritalStatus",
	"bloodType" "bloodType",
	"dateOfBirth" date NOT NULL,
	"placeOfBirth" varchar(256) NOT NULL,
	"photo" text
);
