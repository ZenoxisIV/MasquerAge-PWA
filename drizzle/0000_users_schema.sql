CREATE TYPE "public"."bloodType" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."maritalStatus" AS ENUM('Single', 'Married', 'Divorced', 'Separated', 'Widowed');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_demographics" (
	"pcn" varchar(19),
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
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"pcn" varchar(30) NOT NULL,
	"password_hash" varchar(256) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_demographics" ADD CONSTRAINT "user_demographics_pcn_users_id_fk" FOREIGN KEY ("pcn") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;