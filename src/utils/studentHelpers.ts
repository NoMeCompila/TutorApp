import { Student, CalculatedStatus, PaymentMethod } from '../types';

export function calculateStudentStatus(dueDateStr: string): CalculatedStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    const dayText = absDays === 1 ? 'día' : 'días';
    return {
      status: 'OVERDUE',
      label: `Vencido hace ${absDays} ${dayText}`,
      daysDiff: diffDays,
      badgeBg: 'bg-rose-100 border border-rose-200 text-rose-700',
      badgeText: 'text-rose-700',
      badgeDot: 'bg-rose-500',
    };
  } else if (diffDays === 0) {
    return {
      status: 'OVERDUE',
      label: 'Vence hoy',
      daysDiff: 0,
      badgeBg: 'bg-rose-100 border border-rose-200 text-rose-700',
      badgeText: 'text-rose-700',
      badgeDot: 'bg-rose-500',
    };
  } else if (diffDays <= 5) {
    const dayText = diffDays === 1 ? 'mañana' : `en ${diffDays} días`;
    return {
      status: 'DUE_SOON',
      label: `Vence ${dayText}`,
      daysDiff: diffDays,
      badgeBg: 'bg-amber-100 border border-amber-200 text-amber-800',
      badgeText: 'text-amber-800',
      badgeDot: 'bg-amber-500',
    };
  } else {
    return {
      status: 'UP_TO_DATE',
      label: 'Al día',
      daysDiff: diffDays,
      badgeBg: 'bg-emerald-100 border border-emerald-200 text-emerald-700',
      badgeText: 'text-emerald-700',
      badgeDot: 'bg-emerald-500',
    };
  }
}

export function formatCurrency(amount: number, symbol = '$'): string {
  // Format with thousand separators e.g. $25,000 or $45.00
  return `${symbol}${amount.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  return `${day} ${monthNames[date.getMonth()]}, ${year}`;
}

export function generateWhatsappLink(student: Student, customTemplate?: string): string {
  const cleanPhone = (student.countryCode + student.phone).replace(/[^0-9]/g, '');
  const formattedDueDate = formatDateSpanish(student.dueDate);
  const formattedAmount = formatCurrency(student.amount);
  
  const statusInfo = calculateStudentStatus(student.dueDate);

  let defaultMsg = `Hola ${student.name}, te saludo desde TutorApp. Te recuerdo que la cuota de $${student.amount} para la materia de ${student.subject} `;
  
  if (statusInfo.status === 'OVERDUE') {
    defaultMsg += `venció el ${formattedDueDate}. Te agradecería confirmarme si pudiste realizar el pago. ¡Muchas gracias!`;
  } else if (statusInfo.status === 'DUE_SOON') {
    defaultMsg += `vence el ${formattedDueDate}. Saludos cordiales!`;
  } else {
    defaultMsg += `está al día. Próximo vencimiento: ${formattedDueDate}. ¡Muchas gracias!`;
  }

  const message = customTemplate
    ? customTemplate
        .replace('{nombre}', student.name)
        .replace('{monto}', formattedAmount)
        .replace('{materia}', student.subject)
        .replace('{fecha}', formattedDueDate)
    : defaultMsg;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function addDaysToDate(dateStr: string, days = 30): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const current = new Date(year, month - 1, day);
  
  // If date was overdue in the far past, set base to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let baseDate = current < today ? today : current;
  baseDate.setDate(baseDate.getDate() + days);

  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, '0');
  const d = String(baseDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getInitials(name: string): string {
  if (!name) return 'AL';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
