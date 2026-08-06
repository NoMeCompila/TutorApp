import React from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';
import { Student } from '../types';
import { calculateStudentStatus, formatCurrency, getInitials, generateWhatsappLink } from '../utils/studentHelpers';

interface StudentCardProps {
  student: Student;
  currencySymbol?: string;
  customWhatsappMsg?: string;
  onOpenDetail: (student: Student) => void;
  onRecordPayment: (student: Student) => void;
  onOpenWhatsapp?: (url: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  currencySymbol = '$',
  customWhatsappMsg,
  onOpenDetail,
  onRecordPayment,
  onOpenWhatsapp,
}) => {
  const statusInfo = calculateStudentStatus(student.dueDate);
  const initials = getInitials(student.name);
  const formattedAmount = formatCurrency(student.amount, currencySymbol);
  const whatsappUrl = generateWhatsappLink(student, customWhatsappMsg);

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenWhatsapp) {
      onOpenWhatsapp(whatsappUrl);
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRegisterPaymentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRecordPayment(student);
  };

  const borderAccentClass =
    statusInfo.status === 'OVERDUE'
      ? 'border-l-4 border-l-rose-500'
      : statusInfo.status === 'DUE_SOON'
      ? 'border-l-4 border-l-amber-500'
      : 'border-l-4 border-l-emerald-500';

  return (
    <div
      onClick={() => onOpenDetail(student)}
      className={`bg-white rounded-xl shadow-xs border border-slate-200/80 p-4 relative overflow-hidden group hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] ${borderAccentClass}`}
    >
      {/* Header Info */}
      <div className="flex justify-between items-start mb-2.5 gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar Initials */}
          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-700 font-bold text-base shrink-0 shadow-2xs">
            {initials}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {student.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{student.subject}</span>
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <span className="text-base font-bold text-slate-900 tracking-tight block">
            {formattedAmount}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${statusInfo.badgeBg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.badgeDot} mr-1.5`} />
          {statusInfo.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 items-center pt-1 border-t border-slate-100">
        {/* Button Registrar Pago */}
        <button
          onClick={handleRegisterPaymentClick}
          className={`flex-1 h-10 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] ${
            statusInfo.status === 'OVERDUE'
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : statusInfo.status === 'DUE_SOON'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Registrar Pago
        </button>

        {/* WhatsApp Icon Button */}
        <button
          onClick={handleWhatsappClick}
          title="Recordar por WhatsApp"
          aria-label={`Recordar por WhatsApp a ${student.name}`}
          className="h-10 px-3 flex items-center justify-center bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 active:scale-95 transition-all border border-emerald-200 shrink-0 text-xs font-bold gap-1.5 shadow-2xs"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600/10 stroke-[2.2]" />
          <span className="hidden xs:inline">WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
