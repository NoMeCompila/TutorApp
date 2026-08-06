# Especificación Técnica de Despliegue: TutorApp (MVP)

**Enfoque:** Specification-Driven Development (SDD) \- Módulo de Despliegue en la Nube  
**Versión:** 2.0.0  
**Fecha:** 2026-08-05

---

## 1\. Contexto y Objetivo del Despliegue

### 1.1 Contexto

El código fuente de **TutorApp** se encuentra desarrollado con la pila de tecnologías moderna (React 19 \+ Vite 6 \+ Tailwind CSS v4 \+ Supabase) y respaldado con desarrollo acelerado asistido por **Gemini 3.6 Flash (High)** y **Antigravity (Google DeepMind)**. Todo el código fuente se encuentra alojado en **GitHub**.

### 1.2 Objetivo

Desplegar la PWA en la nube utilizando infraestructura **100% gratuita**, con certificados SSL automáticos (necesarios para la instalación de la PWA en celulares), integración continua (CI/CD) y asignación de un dominio público accesible para las maestras.

---

## 2\. Tecnologías e Infraestructura de la Aplicación

### Frontend (Interfaz de Usuario)

* **React 19:** Librería principal para la construcción de la interfaz.  
* **TypeScript:** Tipado seguro y estructurado.  
* **Vite 6:** Herramienta de construcción (*bundler*) y servidor de desarrollo.  
* **Tailwind CSS v4:** Framework de estilos utilitarios y diseño responsive *Mobile-First*.  
* **Lucide React:** Iconos vectoriales modernos.  
* **Motion:** Librería para transiciones y animaciones fluidas en la interfaz móvil.

### Backend y Base de Datos (Servicios en la Nube)

* **Supabase:** Plataforma Backend as a Service (BaaS).  
* **PostgreSQL:** Base de datos relacional en la nube para guardar alumnos, suscripciones y pagos.  
* **Supabase Auth:** Autenticación de la maestra (Email/Password y Google OAuth).  
* **Row Level Security (RLS):** Políticas SQL de aislamiento de datos por usuario.  
* **Triggers y Funciones SQL:** Automatización de creación de perfiles en PostgreSQL.  
* **`@supabase/supabase-js`:** Cliente JS/TS oficial para React 19\.

### Hosting & CI/CD

* **Vercel** (o **Netlify**): Plan gratuito (Hobby) con compilación automática desde GitHub y CDN global.

---

## 3\. Prerrequisitos de Despliegue

1. Repositorio de GitHub actualizado con el proyecto en Vite 6 \+ React 19\.  
2. Cuenta gratuita en **Vercel** vinculada a GitHub.  
3. Claves API de Supabase preparadas para entorno Vite:  
   * `VITE_SUPABASE_URL`  
   * `VITE_SUPABASE_ANON_KEY` (o `Publishable key`)

---

## 4\. Instructivo Paso a Paso de Despliegue (SDD)

### PASO 1: Vinculación de GitHub con Vercel

1. Acceder a [vercel.com](https://vercel.com) e iniciar sesión con la cuenta de **GitHub**.  
2. Autorizar a Vercel el acceso a los repositorios.

### PASO 2: Importar el Repositorio de TutorApp

1. En el Dashboard de Vercel, presionar **"Add New..." \-\> "Project"**.  
2. Seleccionar el repositorio `TutorApp` de GitHub y hacer clic en **"Import"**.

### PASO 3: Configuración del Build Preset y Variables de Entorno (Vite)

1. **Framework Preset:** Vercel detectará automáticamente **Vite**.  
     
2. **Build Command:** `npm run build` (o `vite build`).  
     
3. **Output Directory:** `dist`.  
     
4. **Environment Variables (Variables de Entorno):** Agregar las variables de entorno formateadas para Vite:  
     
   * **Nombre:** `VITE_SUPABASE_URL`  
     * **Valor:** `https://tu-proyecto.supabase.co`  
   * **Nombre:** `VITE_SUPABASE_ANON_KEY`  
     * **Valor:** `sb_publishable_...` (o la clave `anon` copiada de Supabase)

   

5. Hacer clic en **"Add"** para guardar ambas variables.

### PASO 4: Ejecución del Despliegue (Deploy)

1. Hacer clic en **"Deploy"**.  
2. Vercel compilará la aplicación con Vite 6 y React 19 en aproximadamente 45-60 segundos.  
3. Al finalizar, Vercel proporcionará el dominio público HTTPS asignado (ejemplo: `https://tutorapp.vercel.app`).

---

## 5\. Verificación de la PWA e Instalación en Móviles

1. **Prueba de Funcionamiento:**  
   * Abrir la URL `https://tutorapp.vercel.app` en el celular.  
   * Probar el inicio de sesión con Supabase Auth y la carga de alumnos.  
2. **Instalación de la PWA:**  
   * **Android (Chrome):** Menú ➔ *"Agregar a la pantalla principal"*.  
   * **iPhone (Safari):** Botón Compartir ➔ *"Agregar al inicio"*.

---

## 6\. Mantenimiento Automático (Workflow CI/CD)

* Cada `git push` a la rama principal en GitHub disparará automáticamente la reconstrucción del proyecto en Vercel, manteniendo la PWA siempre actualizada para las maestras sin interrumpir el servicio.

