import React from 'react';
import { Home, Users, Settings } from 'lucide-react';

export type TabType = 'home' | 'students' | 'settings';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  overdueCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  overdueCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] max-w-md mx-auto h-16">
      <div className="flex justify-around items-center h-full px-2">
        {/* Home / Inicio */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 ${
            activeTab === 'home'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full mb-0.5 transition-colors ${
              activeTab === 'home' ? 'bg-indigo-50 text-indigo-600' : ''
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-wide">Inicio</span>
        </button>

        {/* Alumnos / Students */}
        <button
          onClick={() => onChangeTab('students')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 relative ${
            activeTab === 'students'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full mb-0.5 transition-colors ${
              activeTab === 'students' ? 'bg-indigo-50 text-indigo-600' : ''
            }`}
          >
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-wide">Alumnos</span>
          {overdueCount > 0 && (
            <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Ajustes / Settings */}
        <button
          onClick={() => onChangeTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 ${
            activeTab === 'settings'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full mb-0.5 transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : ''
            }`}
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold tracking-wide">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};
