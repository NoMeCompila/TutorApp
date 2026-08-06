import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, CreditCard, Banknote, Building2, Smartphone } from 'lucide-react';
import { Student, PaymentMethod } from '../types';
import { formatCurrency, addDaysToDate, formatDateSpanish } from '../utils/studentHelpers';

interface RecordPaymentModalProps {
  isOpen: boolean;
  student: Student | null;
  currencySymbol?: string;
  onClose: () => void;
  onConfirm: (studentId: string, amount: number, method: PaymentMethod, date: string, notes?: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  student,
  currencySymbol = '$',
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (student) {
      setAmount(student.amount);
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setMethod('Bank Transfer');
      setNotes('Cobro de mensualidad registrado');
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const nextDueDate = addDaysToDate(student.dueDate, 30);
  const formattedNextDate = formatDateSpanish(nextDueDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(student.id, amount, method, date, notes);
    onClose();
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'Bank Transfer', label: 'Transferencia', icon: <Building2 className="w-4 h-4" /> },
    { id: 'Cash', label: 'Efectivo', icon: <Banknote className="w-4 h-4" /> },
    { id: 'Mercado Pago', label: 'Mercado Pago', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'Card', label: 'Tarjeta', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">Registrar Pago de Cuota</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <p className="text-xs font-semibold text-slate-500 uppercase">Alumno</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">{student.name}</p>
            <p className="text-xs text-slate-600 font-medium">{student.subject}</p>
          </div>

          {/* Amount input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Monto Recibido</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 font-bold text-slate-500">{currencySymbol}</span>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full h-11 pl-8 pr-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
              />
            </div>
          </div>

          {/* Payment Method selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase">Método de Pago</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    method === pm.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pm.icon}
                  <span>{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date of payment */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Fecha de Pago</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>

          {/* Info Banner: Next Due Date */}
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-medium">Nueva Fecha de Vencimiento:</span>
            <span className="font-bold text-emerald-900">{formattedNextDate}</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
