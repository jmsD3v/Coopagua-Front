# Sistema de Gestión para Cooperativa de Agua

Este es un sistema de gestión interna para una cooperativa de agua, construido sobre Next.js. Permite la administración de socios (abonados), la gestión de sus datos y, próximamente, la facturación de servicios.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) (gestionado con Docker)
-   **ORM**: [Drizzle](https://orm.drizzle.team/)
-   **Pagos**: [MercadoPago](https://mercadopago.com.ar/)
-   **UI**: [Tailwind CSS](https://tailwindcss.com/) y [shadcn/ui](https://ui.shadcn.com/)

## Cómo Iniciar el Proyecto Localmente

**1. Clonar el Repositorio**
```bash
# (El usuario ya tiene esto)
```

**2. Configurar el Entorno**
*   Asegúrate de tener un archivo `docker-compose.yml` en la raíz con la configuración de la base de datos.
*   Crea un archivo `.env` en la raíz del proyecto. Puedes copiar `.env.example` como plantilla y rellenar tus variables (especialmente las de MercadoPago y `AUTH_SECRET`).

**3. Iniciar la Base de Datos**
*   Ejecuta el siguiente comando para iniciar la base de datos en Docker:
    ```bash
    docker compose up -d
    ```

**4. Preparar la Base de Datos (Solo la primera vez)**
*   Si es la primera vez que inicias, la base de datos estará vacía. Deberás aplicar las migraciones (crear las tablas) y crear el usuario administrador.
    ```bash
    # 1. Conectarse a psql vía docker exec y pegar el script SQL para crear las tablas.
    # 2. Luego, crear el usuario admin:
    pnpm db:seed
    ```

**5. Instalar Dependencias e Iniciar la Aplicación**
```bash
pnpm install
pnpm dev
```
La aplicación estará disponible en `http://localhost:3000`.

**Usuario de Prueba:**
*   **Email:** `test@test.com`
*   **Contraseña:** `admin123`

- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
