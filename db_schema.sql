-- Borra las tablas existentes en el orden correcto para evitar errores de FK
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS readings;
DROP TABLE IF EXISTS meters;
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

-- Borra los tipos ENUM existentes
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS user_status;
DROP TYPE IF EXISTS invoice_status;
DROP TYPE IF EXISTS claim_status;

-- Creación de tipos ENUM
CREATE TYPE user_role AS ENUM ('socio', 'admin', 'tecnico', 'superadmin');
CREATE TYPE user_status AS ENUM ('activo', 'moroso', 'suspendido');
CREATE TYPE invoice_status AS ENUM ('pendiente', 'pagada', 'vencida');
CREATE TYPE claim_status AS ENUM ('abierto', 'en proceso', 'resuelto');

-- Creación de la tabla de usuarios (users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    dni VARCHAR(50) UNIQUE,
    password_hash TEXT,
    role user_role DEFAULT 'socio' NOT NULL,
    status user_status DEFAULT 'activo' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    phone VARCHAR(50),
    membership_number VARCHAR(100) UNIQUE,
    tariff_category VARCHAR(100),
    mp_customer_id TEXT UNIQUE,
    mp_subscription_id TEXT UNIQUE
);

-- Creación de la tabla de direcciones (addresses)
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(50),
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'activo' NOT NULL
);

-- Creación de la tabla de medidores (meters)
CREATE TABLE meters (
    id SERIAL PRIMARY KEY,
    address_id INTEGER NOT NULL REFERENCES addresses(id),
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(100),
    installation_date DATE
);

-- Creación de la tabla de lecturas (readings)
CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    meter_id INTEGER NOT NULL REFERENCES meters(id),
    date DATE NOT NULL,
    reading_m3 NUMERIC(10, 2) NOT NULL,
    observations TEXT
);

-- Creación de la tabla de facturas (invoices)
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    reading_id INTEGER REFERENCES readings(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status DEFAULT 'pendiente' NOT NULL
);

-- Creación de la tabla de pagos (payments)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),
    payment_date DATE NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);

-- Creación de la tabla de reclamos (claims)
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    address_id INTEGER NOT NULL REFERENCES addresses(id),
    type VARCHAR(255) NOT NULL,
    description TEXT,
    status claim_status DEFAULT 'abierto' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    assigned_technician_id INTEGER REFERENCES users(id)
);

-- Creación de la tabla de registros de actividad (activity_logs)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);
