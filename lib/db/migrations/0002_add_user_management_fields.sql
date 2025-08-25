-- 1. Creamos el ENUM para el estado de la conexión
CREATE TYPE "connection_status" AS ENUM ('activa', 'morosa', 'suspendida');

-- 2. Creamos el ENUM para los roles de usuario
CREATE TYPE "user_role" AS ENUM ('socio', 'admin', 'superadmin');

-- 3. Modificamos la tabla de usuarios
ALTER TABLE "users" ADD COLUMN "phone" varchar(50);
ALTER TABLE "users" ADD COLUMN "membership_number" varchar(100);
ALTER TABLE "users" ADD COLUMN "tariff_category" varchar(100);
ALTER TABLE "users" ADD COLUMN "connection_status" "connection_status" DEFAULT 'activa';
ALTER TABLE "users" ADD CONSTRAINT "users_membership_number_unique" UNIQUE("membership_number");
-- Actualizamos la columna 'role' para que use el nuevo ENUM
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE user_role USING role::user_role;
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'socio';


-- 4. Creamos la tabla de domicilios
CREATE TABLE "addresses" (
  "id" serial PRIMARY KEY NOT NULL,
  "street" varchar(255),
  "city" varchar(100),
  "state" varchar(100),
  "zip" varchar(20),
  "user_id" integer NOT NULL
);

-- 5. Conectamos la tabla de domicilios con la de usuarios
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
