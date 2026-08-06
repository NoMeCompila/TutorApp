import React, { useState, useEffect } from 'react';
import { X, User, Phone, BookOpen, Calendar, Save } from 'lucide-react';
import { Student } from '../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id' | 'payments' | 'createdAt'>, existingId?: string) => void;
  initialStudent?: Student | null;
  currencySymbol?: string;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStudent,
  currencySymbol = '$',
}) => {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const subjectsList = [
    'Matemáticas',
    'Inglés',
    'Física',
    'Guitarra',
    'Química',
    'Historia',
    'Biología',
    'Programación',
    'Otro',
  ];

  useEffect(() => {
    if (initialStudent) {
      setName(initialStudent.name);
      setCountryCode(initialStudent.countryCode || '+52');
      setPhone(initialStudent.phone || '');
      if (subjectsList.includes(initialStudent.subject)) {
        setSubject(initialStudent.subject);
        setCustomSubject('');
      } else {
        setSubject('Otro');
        setCustomSubject(initialStudent.subject);
      }
      setAmount(String(initialStudent.amount));
      setDueDate(initialStudent.dueDate);
      setNotes(initialStudent.notes || '');
    } else {
      // Default new student values
      setName('');
      setCountryCode('+52');
      setPhone('');
      setSubject('');
      setCustomSubject('');
      setAmount('');
      // Default due date to today + 30 days
      const today = new Date();
      today.setDate(today.getDate() + 30);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDueDate(`${yyyy}-${mm}-${dd}`);
      setNotes('');
    }
  }, [initialStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSubject = subject === 'Otro' ? customSubject.trim() || 'General' : subject;
    const numericAmount = parseFloat(amount) || 0;

    onSave(
      {
        name: name.trim(),
        countryCode,
        phone: phone.trim(),
        subject: finalSubject,
        amount: numericAmount,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        notes: notes.trim(),
      },
      initialStudent?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Mobile handle indicator */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {initialStudent ? 'Editar Alumno' : 'Registrar Nuevo Alumno'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Nombre Completo
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Maria Gonzalez"
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-base font-medium"
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Número de WhatsApp
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-12 px-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-indigo-600 outline-none w-[90px] text-sm"
              >
                <option value="+52">+52 (MX)</option>
                <option value="+54">+54 (AR)</option>
                <option value="+1">+1 (US)</option>
                <option value="+34">+34 (ES)</option>
                <option value="+57">+57 (CO)</option>
                <option value="+56">+56 (CL)</option>
                <option value="+51">+51 (PE)</option>
              </select>
              <div className="relative flex-1 flex items-center">
                <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555 123 4567"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-base font-medium"
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Materia / Asignatura
            </label>
            <div className="relative flex items-center">
              <BookOpen className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-12 pl-11 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-base font-medium appearance-none"
              >
                <option value="" disabled>
                  Selecciona una materia...
                </option>
                {subjectsList.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
            {subject === 'Otro' && (
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Especifica la materia..."
                className="w-full h-11 px-4 mt-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium"
              />
            )}
          </div>

          {/* Grid Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            {/* Monthly Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Monto Mensual
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-base font-bold text-slate-500 pointer-events-none">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-base font-bold"
                />
              </div>
            </div>

            {/* Payment Due Day */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Fecha Vencimiento
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-12 pl-9 pr-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Notas adicionales (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Horario de clase, observaciones..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 text-sm outline-none resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar Alumno
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
