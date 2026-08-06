import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MessageCircle, DollarSign, Download, RotateCcw, Check, Sparkles, Smartphone, LogOut } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onResetData: () => void;
  onLogout: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetData,
  onLogout,
  showToast,
}) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [currencySymbol, setCurrencySymbol] = useState(user.currencySymbol);
  const [whatsappMsg, setWhatsappMsg] = useState(user.customWhatsappMsg);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Catch PWA beforeinstallprompt event if available
  React.useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        showToast('¡TutorApp se ha instalado en tu dispositivo!');
      }
      setDeferredPrompt(null);
    } else {
      showToast('Abre las opciones del navegador y selecciona "Agregar a la pantalla de inicio".', 'info');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim(),
      role: role.trim(),
      currencySymbol,
      customWhatsappMsg: whatsappMsg.trim(),
    });
    showToast('Ajustes guardados correctamente');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 pb-28 space-y-4">
      {/* Title Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
        <h2 className="text-lg font-bold text-slate-900">Ajustes y Configuración</h2>
        <p className="text-xs font-medium text-slate-500">
          Personaliza tu perfil de tutor, mensajes de WhatsApp y preferencias del sistema.
        </p>
      </div>

      {/* PWA Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl p-5 text-white shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Instalar TutorApp (PWA)</h3>
            <p className="text-xs text-indigo-100">
              Usa la app sin conexión y accede rápidamente desde tu pantalla de inicio.
            </p>
          </div>
        </div>
        <button
          onClick={handleInstallPWA}
          className="w-full h-10 bg-white text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-50 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Instalar en el Celular
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil del Tutor</h3>

        {/* Name & Role */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Tu Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3 mt-1 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Título / Especialidad</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 px-3 mt-1 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
            />
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-indigo-600" /> Símbolo de Moneda
          </label>
          <select
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            className="w-full h-11 px-3 mt-1 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
          >
            <option value="$">$ (Pesos / Dólares)</option>
            <option value="S/">S/ (Soles)</option>
            <option value="€">€ (Euros)</option>
            <option value="R$">R$ (Reales)</option>
            <option value="US$">US$ (USD)</option>
          </select>
        </div>

        {/* WhatsApp Custom Template */}
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-emerald-600" /> Plantilla de Recordatorio WhatsApp
          </label>
          <textarea
            rows={3}
            value={whatsappMsg}
            onChange={(e) => setWhatsappMsg(e.target.value)}
            className="w-full p-3 mt-1 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none resize-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Variables disponibles: <span className="font-semibold text-indigo-600">{'{nombre}'}</span>, <span className="font-semibold text-indigo-600">{'{monto}'}</span>, <span className="font-semibold text-indigo-600">{'{materia}'}</span>, <span className="font-semibold text-indigo-600">{'{fecha}'}</span>.
          </p>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Guardar Cambios
        </button>
      </form>

      {/* Data Management Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gestión de Datos y Sesión</h3>
        
        <button
          onClick={() => {
            if (confirm('¿Deseas restablecer los datos de prueba iniciales? Se reemplazarán tus cambios actualizados.')) {
              onResetData();
            }
          }}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" /> Restablecer Alumnos de Prueba
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-rose-200"
        >
          <LogOut className="w-4 h-4 text-rose-600" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
