import React from 'react';
import {
  Phone,
  MessageCircle,
  Edit2,
  AlertTriangle,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  CheckCircle2,
  Calendar,
  Clock,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { Student, UserProfile, PaymentRecord } from '../types';
import {
  calculateStudentStatus,
  formatCurrency,
  formatDateSpanish,
  getInitials,
  generateWhatsappLink,
} from '../utils/studentHelpers';

interface StudentDetailViewProps {
  student: Student;
  user: UserProfile;
  onEditStudent: (student: Student) => void;
  onRecordPayment: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenWhatsapp?: (url: string) => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({
  student,
  user,
  onEditStudent,
  onRecordPayment,
  onDeleteStudent,
  onOpenWhatsapp,
}) => {
  const statusInfo = calculateStudentStatus(student.dueDate);
  const initials = getInitials(student.name);
  const formattedAmount = formatCurrency(student.amount, user.currencySymbol);
  const formattedDueDate = formatDateSpanish(student.dueDate);
  const whatsappUrl = generateWhatsappLink(student, user.customWhatsappMsg);

  const handleCall = () => {
    const cleanPhone = (student.countryCode + student.phone).replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsapp = () => {
    if (onOpenWhatsapp) {
      onOpenWhatsapp(whatsappUrl);
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Bank Transfer':
        return <Building2 className="w-4 h-4 text-indigo-500" />;
      case 'Cash':
        return <Banknote className="w-4 h-4 text-emerald-500" />;
      case 'Mercado Pago':
        return <Smartphone className="w-4 h-4 text-cyan-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 pb-28 space-y-4">
      {/* 1. Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 relative">
        {/* Edit Button */}
        <button
          onClick={() => onEditStudent(student)}
          title="Editar información"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md mb-3 border-4 border-white ring-4 ring-indigo-100">
            {initials}
          </div>

          {/* Student Name & Subject */}
          <h2 className="text-xl font-bold text-slate-900 mb-0.5">{student.name}</h2>
          <p className="text-sm font-medium text-slate-500 mb-5">{student.subject}</p>

          {/* Call & WhatsApp Quick Buttons */}
          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={handleCall}
              className="flex-1 max-w-[140px] flex items-center justify-center gap-2 bg-slate-100 text-slate-800 px-5 h-12 rounded-full text-sm font-semibold hover:bg-slate-200 active:scale-95 transition-all shadow-xs border border-slate-200"
            >
              <Phone className="w-4 h-4 fill-slate-700" />
              Llamar
            </button>

            <button
              onClick={handleWhatsapp}
              className="flex-1 max-w-[150px] flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 h-12 rounded-full text-sm font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-200"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-[2.2]" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* 2. Subscription Status Alert Banner */}
      {statusInfo.status === 'OVERDUE' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
          <div className="p-2.5 bg-rose-100 rounded-full text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-rose-900">Pago Vencido</h3>
            <p className="text-xs text-rose-700 font-medium">{statusInfo.label} - {formattedDueDate}</p>
          </div>
        </div>
      )}

      {statusInfo.status === 'DUE_SOON' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
          <div className="p-2.5 bg-amber-100 rounded-full text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-900">Pago Próximo a Vencer</h3>
            <p className="text-xs text-amber-700 font-medium">{statusInfo.label} - {formattedDueDate}</p>
          </div>
        </div>
      )}

      {statusInfo.status === 'UP_TO_DATE' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
          <div className="p-2.5 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-emerald-900">Suscripción al Día</h3>
            <p className="text-xs text-emerald-700 font-medium">Próximo vencimiento: {formattedDueDate}</p>
          </div>
        </div>
      )}

      {/* 3. Próximo Vencimiento Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Próximo Vencimiento
        </h3>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formattedAmount}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Vence: {formattedDueDate}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeBg}`}>
            {statusInfo.status === 'OVERDUE'
              ? 'Vencido'
              : statusInfo.status === 'DUE_SOON'
              ? 'Por Vencer'
              : 'Al Día'}
          </span>
        </div>

        {/* Big Action Button */}
        <button
          onClick={() => onRecordPayment(student)}
          className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <CreditCard className="w-5 h-5" />
          Registrar Pago de Cuota
        </button>
      </div>

      {/* 4. Historial de Pagos Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Historial de Pagos ({student.payments.length})
          </h3>
          <button
            onClick={() => onRecordPayment(student)}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        {student.payments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {student.payments.map((p: PaymentRecord) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {formatDateSpanish(p.date)}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      {getMethodIcon(p.method)}
                      <span>{p.method}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(p.amount, user.currencySymbol)}
                  </p>
                  {p.notes && <p className="text-[10px] text-slate-400 max-w-[120px] truncate">{p.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs font-medium">
            Aún no hay registros de pago en el historial.
          </div>
        )}
      </div>

      {/* 5. Delete Student Option */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (confirm(`¿Estás seguro de eliminar a ${student.name}?`)) {
              onDeleteStudent(student.id);
            }
          }}
          className="w-full py-3 text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
        >
          <Trash2 className="w-4 h-4" /> Eliminar Alumno
        </button>
      </div>
    </div>
  );
};
