# Plan de Implementación Backend: TutorApp (Supabase + React + Vite)

**Enfoque:** Specification-Driven Development (SDD) - Módulo Backend  
**Versión:** 1.1.0 (Adaptado a React + Vite)  
**Fecha:** 2026-08-05

---

## 1. Visión General de la Arquitectura Backend

El backend de **TutorApp** se basa en **Supabase** como BaaS (Backend as a Service) integrado nativamente con **React 19 + Vite** mediante `@supabase/supabase-js` y módulos de servicio en `src/services/`.

### Componentes Clave:

* **Autenticación (Supabase Auth):** Manejo de sesiones de la maestra (Email/Password y OAuth si se requiere).  
* **Base de Datos Relacional (PostgreSQL):** Almacenamiento persistente con integridad referencial.  
* **Seguridad (Row Level Security - RLS):** Políticas de seguridad a nivel de fila para garantizar que cada usuario (maestra) solo pueda ver y modificar sus propios datos.  
* **Lógica de Negocio (Supabase Client Services / Postgres Triggers):** Servicios TypeScript (`src/services/`) y triggers en base de datos para gestión de suscripciones, pagos y cálculo de vencimientos.

---

## 2. Esquema de Base de Datos y Scripts DDL (SQL)

A continuación se detallan las sentencias SQL para crear las tablas, relaciones e índices necesarios en la consola de Supabase (SQL Editor).

-- 1. Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Perfiles / Maestras
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Alumnos (students)
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    subject TEXT NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL CHECK (monthly_fee > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para búsquedas por usuario y nombre
CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_students_full_name ON public.students(full_name);

-- 4. Tabla de Suscripciones / Ciclos de Cobro (subscriptions)
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'DUE_SOON', 'OVERDUE');

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status subscription_status DEFAULT 'ACTIVE',
    last_paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_due_date ON public.subscriptions(due_date);

-- 5. Tabla de Historial de Pagos (payment_history)
CREATE TABLE public.payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method TEXT DEFAULT 'Transferencia',
    notes TEXT
);

CREATE INDEX idx_payment_history_student ON public.payment_history(student_id);

---

## 3. Políticas de Seguridad (Row Level Security - RLS)

Cada tabla está protegida para que únicamente el usuario autenticado (`auth.uid()`) pueda consultar, insertar, actualizar o eliminar sus propios registros.

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Políticas para Students
CREATE POLICY "Maestra gestiona sus propios alumnos" ON public.students
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para Subscriptions
CREATE POLICY "Maestra gestiona suscripciones de sus alumnos" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para Payment History
CREATE POLICY "Maestra gestiona historial de sus pagos" ON public.payment_history
    FOR ALL USING (auth.uid() = user_id);

---

## 4. Trigger Automático para Creación de Perfil

Crear una función y trigger para que cuando una maestra se registre mediante Supabase Auth, se cree automáticamente su fila en `public.profiles`.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

---

## 5. Función de Base de Datos para Cálculo de Estados

Evaluación dinámica de las fechas de vencimiento de las cuotas:

* **OVERDUE (Vencido):** Si `due_date < CURRENT_DATE`  
* **DUE_SOON (Por Vencer):** Si `due_date >= CURRENT_DATE AND due_date <= CURRENT_DATE + INTERVAL '5 days'`  
* **ACTIVE (Al Día):** Si `due_date > CURRENT_DATE + INTERVAL '5 days'`

---

## 6. Configuración del Cliente Supabase en React + Vite

### 6.1 Variables de Entorno (`.env.local`)

```env
VITE_SUPABASE_URL=https://dxvubzlrfuaxsxuzrjwr.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 6.2 Cliente de Supabase (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 7. Módulos de Servicios (Lógica de Negocio)

### 7.1 Módulo de Autenticación (`src/services/authService.ts`)

* `signUpWithEmail(email, password, fullName)`: Registro de nuevas maestras.
* `signInWithEmail(email, password)`: Inicio de sesión tradicional.
* `signOut()`: Cierre de sesión y limpieza de estado.
* `getCurrentSession()` / `onAuthStateChange()`: Verificación y escucha en tiempo real de la sesión.

### 7.2 Módulo de Alumnos (`src/services/studentsService.ts`)

* `getStudents(searchQuery, statusFilter)`: Obtiene la lista de alumnos con sus suscripciones activas desde Supabase.
* `getStudentById(id)`: Información detallada + historial de pagos.
* `createStudent(data)`:  
  1. Inserta registro en `students`.  
  2. Crea la suscripción inicial en `subscriptions` fijando el primer vencimiento (`due_date`).  
* `updateStudent(id, data)`: Actualiza datos del estudiante y monto de cuota.  
* `deleteStudent(id)`: Eliminación o desactivación lógica del alumno.

### 7.3 Módulo de Registro de Pagos y Renovación (`src/services/paymentsService.ts`)

* `recordPayment(subscriptionId, amount, paymentMethod)`:  
  1. Registra la transacción en `payment_history`.  
  2. Suma 1 mes exacto a `due_date` en `subscriptions`.  
  3. Actualiza `status = 'ACTIVE'` y `last_paid_at = NOW()`.

### 7.4 Helper de Enlace a WhatsApp (`src/utils/whatsapp.ts`)

```typescript
export function generateWhatsAppLink(phone: string, studentName: string, subject: string, dueDate: string, amount: number) {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = `Hola ${studentName}, te recuerdo que la cuota mensual de ${subject} vence el ${dueDate}. El monto es de $${amount}. ¡Muchas gracias!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
```

---

## 8. Hitos del Plan de Implementación Backend

1. **Hito 1: Setup Supabase (Completado ✅)**  
   * Crear proyecto en consola Supabase.  
   * Ejecutar script SQL de Tablas, RLS y Trigger en el SQL Editor.  
   * Obtener URL y Anon Key e instalar `@supabase/supabase-js`.  
   * Crear `.env.local` e inicializar `src/lib/supabase.ts`.

2. **Hito 2: Integración de Autenticación (Completado ✅)**  
   * Crear servicio de Autenticación (`src/services/authService.ts`).  
   * Conectar la vista de Login (`LoginView.tsx`) con Supabase Auth (Login y Registro).  
   * Gestionar la sesión global en `App.tsx`.

3. **Hito 3: CRUD de Alumnos y Suscripciones (Completado ✅)**  
   * Crear servicio de Alumnos (`src/services/studentsService.ts`).  
   * Reemplazar `localStorage` por llamadas asíncronas a Supabase en la UI (`StudentsListView.tsx`, `StudentFormModal.tsx`).

4. **Hito 4: Lógica de Renovación de Cuotas y Registro de Pagos (Completado ✅)**  
   * Crear servicio de Pagos (`src/services/paymentsService.ts`).  
   * Conectar modal de pagos `RecordPaymentModal.tsx` con Supabase.  
   * Actualización automática de fechas de vencimiento (+30 días) e historial de transacciones.
