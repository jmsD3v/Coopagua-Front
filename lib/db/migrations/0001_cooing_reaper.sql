CREATE TYPE "public"."claim_status" AS ENUM('abierto', 'en proceso', 'resuelto');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('DNI', 'CUIT', 'Pasaporte');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('pendiente', 'pagada', 'vencida');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('socio', 'admin', 'tecnico', 'superadmin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('activo', 'moroso', 'suspendido', 'baja');--> statement-breakpoint
CREATE TYPE "public"."vat_condition" AS ENUM('Responsable Inscripto', 'Monotributo', 'Exento', 'Consumidor Final');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"street" varchar(255) NOT NULL,
	"number" varchar(50),
	"neighborhood" varchar(100),
	"city" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'activo' NOT NULL,
	"route" varchar(100),
	"block" varchar(50),
	"plot" varchar(50),
	"ch_number" varchar(50),
	"section" varchar(50),
	"district" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"address_id" integer NOT NULL,
	"type" varchar(255) NOT NULL,
	"description" text,
	"status" "claim_status" DEFAULT 'abierto' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"assigned_technician_id" integer
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reading_id" integer,
	"total_amount" numeric(10, 2) NOT NULL,
	"issue_date" date NOT NULL,
	"due_date" date NOT NULL,
	"status" "invoice_status" DEFAULT 'pendiente' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meters" (
	"id" serial PRIMARY KEY NOT NULL,
	"address_id" integer NOT NULL,
	"serial_number" varchar(255) NOT NULL,
	"type" varchar(100),
	"installation_date" date,
	CONSTRAINT "meters_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"payment_date" date NOT NULL,
	"payment_method" varchar(100) NOT NULL,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"meter_id" integer NOT NULL,
	"date" date NOT NULL,
	"reading_m3" numeric(10, 2) NOT NULL,
	"observations" text
);
--> statement-breakpoint
ALTER TABLE "invitations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "teams" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "invitations" CASCADE;--> statement-breakpoint
DROP TABLE "team_members" CASCADE;--> statement-breakpoint
DROP TABLE "teams" CASCADE;--> statement-breakpoint
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "activity_logs" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'socio'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'activo' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "document_type" "document_type";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "document_number" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vat_condition" "vat_condition";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "membership_number" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tariff_category" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "coefficient" numeric(10, 4);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_tax_exempt" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "enable_pdf_printing" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mp_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mp_subscription_id" text;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_assigned_technician_id_users_id_fk" FOREIGN KEY ("assigned_technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_reading_id_readings_id_fk" FOREIGN KEY ("reading_id") REFERENCES "public"."readings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meters" ADD CONSTRAINT "meters_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_meter_id_meters_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" DROP COLUMN "team_id";--> statement-breakpoint
ALTER TABLE "activity_logs" DROP COLUMN "ip_address";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_document_number_unique" UNIQUE("document_number");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_membership_number_unique" UNIQUE("membership_number");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_mp_customer_id_unique" UNIQUE("mp_customer_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_mp_subscription_id_unique" UNIQUE("mp_subscription_id");