import React, { useState, useMemo } from 'react';
import { Search, Plus, UserX } from 'lucide-react';
import { Student, SubscriptionStatus, UserProfile } from '../types';
import { calculateStudentStatus } from '../utils/studentHelpers';
import { StudentCard } from '../components/StudentCard';

interface DashboardViewProps {
  students: Student[];
  user: UserProfile;
  onOpenStudentDetail: (student: Student) => void;
  onRecordPayment: (student: Student) => void;
  onOpenAddModal: () => void;
  onOpenWhatsapp?: (url: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  user,
  onOpenStudentDetail,
  onRecordPayment,
  onOpenAddModal,
  onOpenWhatsapp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<SubscriptionStatus>('ALL');

  // Compute status counts for the filter pills
  const counts = useMemo(() => {
    let overdue = 0;
    let dueSoon = 0;
    let upToDate = 0;

    students.forEach((st) => {
      const { status } = calculateStudentStatus(st.dueDate);
      if (status === 'OVERDUE') overdue++;
      else if (status === 'DUE_SOON') dueSoon++;
      else if (status === 'UP_TO_DATE') upToDate++;
    });

    return { overdue, dueSoon, upToDate, total: students.length };
  }, [students]);

  // Filter students based on search term and tab selection
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchesSearch =
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.subject.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'ALL') return true;
      const { status } = calculateStudentStatus(st.dueDate);
      return status === activeFilter;
    });
  }, [students, searchTerm, activeFilter]);

  const handleFilterClick = (filter: SubscriptionStatus) => {
    setActiveFilter((prev) => (prev === filter ? 'ALL' : filter));
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-100">
      {/* Search Bar & Filter Capsules Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/60 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar alumnos por nombre o materia..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 text-xs font-semibold">
          {/* Vencidos */}
          <button
            onClick={() => handleFilterClick('OVERDUE')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-full min-h-[36px] transition-all flex items-center gap-1.5 ${
              activeFilter === 'OVERDUE'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Vencidos
            <span className={`w-2 h-2 rounded-full inline-block ${activeFilter === 'OVERDUE' ? 'bg-white' : 'bg-rose-500'}`} />
            <span>({counts.overdue})</span>
          </button>

          {/* Por Vencer */}
          <button
            onClick={() => handleFilterClick('DUE_SOON')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-full min-h-[36px] transition-all flex items-center gap-1.5 ${
              activeFilter === 'DUE_SOON'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Por Vencer
            <span className={`w-2 h-2 rounded-full inline-block ${activeFilter === 'DUE_SOON' ? 'bg-white' : 'bg-amber-500'}`} />
            <span>({counts.dueSoon})</span>
          </button>

          {/* Al Día */}
          <button
            onClick={() => handleFilterClick('UP_TO_DATE')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-full min-h-[36px] transition-all flex items-center gap-1.5 ${
              activeFilter === 'UP_TO_DATE'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Al Día
            <span className={`w-2 h-2 rounded-full inline-block ${activeFilter === 'UP_TO_DATE' ? 'bg-white' : 'bg-emerald-500'}`} />
            <span>({counts.upToDate})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-28 space-y-3.5">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              currencySymbol={user.currencySymbol}
              customWhatsappMsg={user.customWhatsappMsg}
              onOpenDetail={onOpenStudentDetail}
              onRecordPayment={onRecordPayment}
              onOpenWhatsapp={onOpenWhatsapp}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 my-6 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <UserX className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No se encontraron alumnos</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {searchTerm
                ? `No hay alumnos que coincidan con "${searchTerm}".`
                : 'Intenta seleccionar otro filtro o registra un nuevo alumno.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-xs mt-2"
            >
              <Plus className="w-4 h-4" /> Registrar Alumno
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={onOpenAddModal}
        title="Registrar Nuevo Alumno"
        aria-label="Registrar Nuevo Alumno"
        className="fixed bottom-20 right-5 z-30 w-14 h-14 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-90 transition-all border border-white/20"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
