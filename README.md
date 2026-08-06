# 🎓 TutorApp

**TutorApp** es una aplicación web moderna, intuitiva y responsive diseñada para tutores, profesores particulares y educadores independientes. Permite gestionar fácilmente la lista de alumnos, controlar las fechas de vencimiento de las cuotas mensuales, registrar historiales de pago y enviar recordatorios directos por **WhatsApp** en un solo clic.

---

## 📸 Capturas de Pantalla (Screenshots)

> *Reemplaza las imágenes a continuación con tus capturas de pantalla de la aplicación.*

<div align="center">

| 📱 Dashboard Principal | 👤 Perfil y Detalle del Alumno |
| :---: | :---: |
| ![Dashboard de TutorApp](./assets/dashboard-preview.png) | ![Detalle del Alumno](./assets/student-detail-preview.png) |

| 🔑 Iniciar Sesión / Registro | 💳 Registrar Cobro |
| :---: | :---: |
| ![Pantalla de Login](./assets/login-preview.png) | ![Modal de Registro de Pago](./assets/record-payment-preview.png) |

</div>

---

## ✨ Funcionalidades Clave

- 🔐 **Autenticación Multiusuario Real**: Registro e inicio de sesión seguro en la nube mediante Supabase Auth.
- 👥 **Gestión de Alumnos (CRUD)**: Creación, edición y eliminación de alumnos con materias, contactos y monto de cuota.
- 🚦 **Control de Estados de Cuota**: Cálculo dinámico de cuotas (🔴 *Vencidas*, 🟡 *Por Vencer en <5 días*, 🟢 *Al día*).
- 📲 **Integración Directa con WhatsApp**: Generación de mensajes pre-redactados y personalizados según el estado del alumno.
- 💳 **Historial de Pagos y Renovación**: Registro de cobros (Transferencia, Efectivo, Mercado Pago) y actualización automática de la fecha de vencimiento (+30 días).
- 🔒 **Seguridad con RLS**: Políticas de Row Level Security en PostgreSQL para garantizar la privacidad de los datos de cada tutora.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **[React 19](https://react.dev/)** & **[TypeScript](https://www.typescriptlang.org/)**: Interfaz dinámica y tipado estático robusto.
- **[Vite 6](https://vitejs.dev/)**: Servidor de desarrollo ultra rápido y empaquetador de módulos.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilizado moderno con utilidad de diseño adaptable.
- **[Lucide React](https://lucide.dev/)**: Colección de íconos vectoriales UI.
- **[Motion](https://motion.dev/)**: Animaciones de interfaz fluidas.

### Backend as a Service (BaaS)
- **[Supabase](https://supabase.com/)**:
  - **PostgreSQL Database**: Base de datos relacional persistente.
  - **Supabase Auth**: Sistema de autenticación de usuarios.
  - **Row Level Security (RLS)**: Seguridad a nivel de fila en SQL.
  - **Triggers SQL**: Creación automática de perfiles al registrarse.

### 🤖 Desarrollo Acelerado con Inteligencia Artificial
Esta aplicación fue conceptualizada, diseñada y construida con la ayuda de:
- **[Gemini 3.6 Flash (High)](https://deepmind.google/technologies/gemini/)**: Modelo de lenguaje y razonamiento avanzado de Google DeepMind.
- **Antigravity**: Asistente de programación agentica de IA diseñado por el equipo de Google DeepMind.

---

## 🚀 Cómo Iniciar el Proyecto Localmente

### Prerrequisitos
Tener instalado **Node.js** (v18 o superior).

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/NoMeCompila/TutorApp.git
cd TutorApp
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto e ingresa tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

Abre tu navegador en 👉 **`http://localhost:3000`**

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT.
