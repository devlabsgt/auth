

## 🛠️ GUÍA COMPLETA: Primeros pasos Proyecto `auth` (PNPM)

Este tutorial asume que tienes instaladas las siguientes herramientas en tu PC:

  * **Node.js** (versión 18.x o superior)
  * **Git** (para clonar el repositorio)
  * **PNPM** (gestor de paquetes)

### PARTE I: Configuración del Backend en Supabase

#### 1\. Proyecto y Base de Datos (DB)

1.  Vaya al [**Supabase Dashboard**] y cree un **"New Project"**.
2.  Navegue a **SQL Editor**. Ejecute el Quickstart **"User Management Starter"**.

#### 2\. Restricción de Acceso (Auth)

1.  Navegue a **Authentication** \> **Sign In / Providers**.
2.  **DESACTIVAR** (OFF) la opción: $$\text{Allow new users to sign up}$$
3.  **DESACTIVAR** (OFF) la opción: $$\text{Confirm email}$$
4.  Haga clic en **"Save changes"**.

#### 3\. Configuración de Storage (Avatares)

1.  Navegue a **Storage** y haga clic en **"New bucket"**.

      * **Nombre:** `avatars`
      * **"Public bucket"**: Actívela (ON).
      * **Restricciones:** Active **"Restrict file size"** (0.5 MB) y **"Restrict MIME types"** (`image/jpeg, image/png, image/webp`).
      * Haga clic en **"Create"**.

2.  Navegue a **SQL Editor** y ejecute este código (Políticas RLS):

    ```sql
    create policy "Allow authenticated users to insert"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'avatars'::text);

    create policy "Allow public access"
    on storage.objects for select
    to public
    using (bucket_id = 'avatars'::text);
    ```

-----

### PARTE II: Obtener el Código, Variables y Ejecución

#### 4\. Clonar el Repositorio de GitHub

1.  Abre tu terminal y clona el repositorio:

    ```bash
    git clone https://github.com/devlabsgt/auth.git

    # Navega a la carpeta del proyecto
    cd auth
    ```

2.  **Localizar Credenciales (OBLIGATORIO):**

      * **Project ID (Para URL):** Vaya a **Project Settings (⚙️) \> General**.
      * **anon public key:** Vaya a **Project Settings (⚙️) \> API Keys** \> **Legacy API Keys**.

3.  **Cree el archivo `.env.local`** en la carpeta `auth` y pegue sus credenciales:

    ```env
    # RUTA: ./auth/.env.local

    # Construya la URL usando su Project ID
    NEXT_PUBLIC_SUPABASE_URL='https://[SU_PROJECT_ID_AQUÍ].supabase.co' 

    # Clave Pública (Copie el valor de 'anon public key')
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='[PEGA AQUÍ EL VALOR DE anon public key]'
    ```

#### 5\. Instalación y Ejecución Final

1.  **Instalar dependencias:**

    ```bash
    pnpm install
    ```

2.  **Instalar paquetes de Tailwind** (Obligatorio, ya que no están en el clon):

    ```bash
    pnpm install -D @tailwindcss/postcss autoprefixer
    ```

3.  **Ejecutar la aplicación:**

    ```bash
    pnpm dev
    ```

El proyecto estará listo en **`http://localhost:3000`**.

-----

### ✅ Instrucciones de Uso (Crear el Primer Usuario)

Debido a que deshabilitó el registro público, el único método para acceder es creándolo usted mismo:

1.  Vaya al **Supabase Dashboard** \> **Authentication** \> **Users**.
2.  Haga clic en el botón **"Add user"** (o "Create new user").
3.  Introduzca el email y la contraseña.
4.  **Asegúrese de tener marcada la opción "Auto Confirm User".**
5.  Haga clic en **"Create user"**.

Con esto, el usuario estará activo de inmediato y podrá iniciar sesión en la aplicación, y poder empezar a desarrollar diferentes componentes utilizando supabase, la poderosa herramienta serverless