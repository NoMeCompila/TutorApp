import React, { useState } from 'react';
import { Search, Plus, Phone, MessageCircle, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { Student, UserProfile } from '../types';
import { calculateStudentStatus, formatCurrency, getInitials, generateWhatsappLink } from '../utils/studentHelpers';

interface StudentsListViewProps {
  students: Student[];
  user: UserProfile;
  onOpenStudentDetail: (student: Student) => void;
  onRecordPayment: (student: Student) => void;
  onOpenAddModal: () => void;
  onOpenWhatsapp?: (url: string) => void;
}

export const StudentsListView: React.FC<StudentsListViewProps> = ({
  students,
  user,
  onOpenStudentDetail,
  onRecordPayment,
  onOpenAddModal,
  onOpenWhatsapp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 pb-28 space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Directorio de Alumnos</h2>
          <p className="text-xs font-medium text-slate-500">
            {students.length} {students.length === 1 ? 'estudiante registrado' : 'estudiantes registrados'}
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="h-10 px-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar alumno por nombre o materia..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 shadow-xs"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
        {filtered.length > 0 ? (
          filtered.map((st) => {
            const statusInfo = calculateStudentStatus(st.dueDate);
            const initials = getInitials(st.name);
            const formattedAmount = formatCurrency(st.amount, user.currencySymbol);
            const whatsappUrl = generateWhatsappLink(st, user.customWhatsappMsg);

            return (
              <div
                key={st.id}
                onClick={() => onOpenStudentDetail(st)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {st.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>{st.subject}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">{formattedAmount}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${statusInfo.badgeBg}`}>
                      {statusInfo.status === 'OVERDUE' ? 'Vencido' : statusInfo.status === 'DUE_SOON' ? 'Por Vencer' : 'Al Día'}
                    </span>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs font-medium space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No hay alumnos en la lista.</p>
          </div>
        )}
      </div>
    </div>
  );
};
