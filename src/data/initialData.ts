import { Student, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Elena Gómez',
  role: 'Maestra y Tutora',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  customWhatsappMsg: 'Hola {nombre}, te recuerdo que el pago de {monto} para las clases de {materia} vence el {fecha}. ¡Muchas gracias!',
  currencySymbol: '$',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    subject: 'Matemáticas',
    countryCode: '+52',
    phone: '5551234567',
    amount: 25000,
    dueDate: '2026-08-02', // Vencido hace 2 días (relative to 2026-08-04)
    notes: 'Clases particulares de álgebra lineal los martes y jueves.',
    createdAt: '2026-01-10',
    payments: [
      {
        id: 'p1',
        studentId: '1',
        amount: 25000,
        date: '2026-07-02',
        method: 'Bank Transfer',
        notes: 'Transferencia BBVA',
      },
      {
        id: 'p2',
        studentId: '1',
        amount: 25000,
        date: '2026-06-02',
        method: 'Cash',
        notes: 'Pago en efectivo',
      },
    ],
  },
  {
    id: '2',
    name: 'Sofía García',
    subject: 'Inglés',
    countryCode: '+52',
    phone: '5559876543',
    amount: 20000,
    dueDate: '2026-08-07', // Vence en 3 días
    notes: 'Preparación para examen TOEFL.',
    createdAt: '2026-02-15',
    payments: [
      {
        id: 'p3',
        studentId: '2',
        amount: 20000,
        date: '2026-07-07',
        method: 'Mercado Pago',
        notes: 'Mercado Pago MP-99412',
      },
    ],
  },
  {
    id: '3',
    name: 'Lucas Martínez',
    subject: 'Física',
    countryCode: '+52',
    phone: '5554567890',
    amount: 25000,
    dueDate: '2026-08-25', // Al día (vence en 21 días)
    notes: 'Refuerzo de física mecánica general.',
    createdAt: '2026-03-01',
    payments: [
      {
        id: 'p4',
        studentId: '3',
        amount: 25000,
        date: '2026-07-25',
        method: 'Bank Transfer',
      },
    ],
  },
  {
    id: '4',
    name: 'Mateo Rodríguez',
    subject: 'Guitar Lessons - Beginners',
    countryCode: '+1',
    phone: '5551239876',
    amount: 45.0,
    dueDate: '2026-08-01', // Vencido
    notes: 'Clases presenciales de guitarra acústica.',
    createdAt: '2026-04-05',
    payments: [
      {
        id: 'p5',
        studentId: '4',
        amount: 45.0,
        date: '2026-07-01',
        method: 'Bank Transfer',
        notes: 'Transferencia bancaria directa',
      },
      {
        id: 'p6',
        studentId: '4',
        amount: 45.0,
        date: '2026-06-01',
        method: 'Cash',
        notes: 'Pago en efectivo',
      },
      {
        id: 'p7',
        studentId: '4',
        amount: 45.0,
        date: '2026-05-01',
        method: 'Bank Transfer',
      },
    ],
  },
];
