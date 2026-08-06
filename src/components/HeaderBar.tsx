import React, { useState } from 'react';
import { Bell, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderBarProps {
  user: UserProfile;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  overdueCount?: number;
  dueSoonCount?: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  user,
  title,
  showBack = false,
  onBack,
  overdueCount = 0,
  dueSoonCount = 0,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const totalAlerts = overdueCount + dueSoonCount;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 h-16 max-w-md mx-auto">
        {showBack ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-indigo-600 flex items-center justify-center h-10 w-10 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 truncate max-w-[240px]">
              {title || 'Perfil del Alumno'}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover shadow-xs border-2 border-indigo-100 ring-2 ring-indigo-500/10"
            />
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Hola, {user.name.split(' ')[0]}
              </h1>
              <p className="text-[11px] font-medium text-slate-500">{user.role}</p>
            </div>
          </div>
        )}

        {/* Right Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificaciones"
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors relative active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Resumen de Cobros
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {overdueCount > 0 ? (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-medium flex items-center justify-between">
                    <span>⚠️ Alumnos vencidos</span>
                    <span className="font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      {overdueCount}
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡No hay cobros vencidos hoy!</span>
                  </div>
                )}

                {dueSoonCount > 0 && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium flex items-center justify-between">
                    <span>⏳ Vencen esta semana</span>
                    <span className="font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                      {dueSoonCount}
                    </span>
                  </div>
                )}

                <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-100">
                  TutorApp te mantiene al día con tus pagos
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
