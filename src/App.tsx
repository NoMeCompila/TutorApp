import React, { useState, useEffect } from 'react';
import { Student, UserProfile, TabType, PaymentMethod } from './types';
import { INITIAL_STUDENTS, INITIAL_USER_PROFILE } from './data/initialData';
import { calculateStudentStatus, addDaysToDate, formatDateSpanish, formatCurrency } from './utils/studentHelpers';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavigation } from './components/BottomNavigation';
import { StudentFormModal } from './components/StudentFormModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { Toast, ToastProps } from './components/Toast';

import { DashboardView } from './pages/DashboardView';
import { StudentDetailView } from './pages/StudentDetailView';
import { StudentsListView } from './pages/StudentsListView';
import { SettingsView } from './pages/SettingsView';
import { LoginView } from './pages/LoginView';
import { authService } from './services/authService';
import { studentsService } from './services/studentsService';
import { paymentsService } from './services/paymentsService';

const STORAGE_KEY_STUDENTS = 'tutorapp_students_v1';
const STORAGE_KEY_PROFILE = 'tutorapp_profile_v1';
const STORAGE_KEY_AUTH = 'tutorapp_auth_v1';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [students, setStudents] = useState<Student[]>([]);

  const loadStudents = async () => {
    try {
      const data = await studentsService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error al cargar alumnos desde Supabase:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStudents();
    } else {
      setStudents([]);
    }
  }, [isAuthenticated]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetStudent, setPaymentTargetStudent] = useState<Student | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: ToastProps['type'] } | null>(null);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  // Supabase Auth State Listener
  useEffect(() => {
    authService.getSession().then((session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        authService.getProfile(session.user.id).then((profile) => {
          if (profile) {
            setUserProfile((prev) => ({ ...prev, ...profile }));
          }
        });
      } else {
        setIsAuthenticated(false);
      }
    });

    const authListener = authService.onAuthStateChange(async (session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const profile = await authService.getProfile(session.user.id);
        if (profile) {
          setUserProfile((prev) => ({ ...prev, ...profile }));
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const showToast = (message: string, type: ToastProps['type'] = 'success') => {
    setToast({ message, type });
  };

  // Student counts for notifications
  const overdueCount = students.filter(
    (s) => calculateStudentStatus(s.dueDate).status === 'OVERDUE'
  ).length;

  const dueSoonCount = students.filter(
    (s) => calculateStudentStatus(s.dueDate).status === 'DUE_SOON'
  ).length;

  // Handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    showToast(`¡Bienvenida de nuevo!`);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    }
    setIsAuthenticated(false);
    setSelectedStudent(null);
    setActiveTab('home');
  };

  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsAddEditModalOpen(true);
  };

  const handleSaveStudent = async (
    studentData: Omit<Student, 'id' | 'payments' | 'createdAt'>,
    existingId?: string
  ) => {
    try {
      if (existingId) {
        // Edit existing
        await studentsService.updateStudent(existingId, studentData);
        setStudents((prev) =>
          prev.map((s) => (s.id === existingId ? { ...s, ...studentData } : s))
        );
        if (selectedStudent && selectedStudent.id === existingId) {
          setSelectedStudent((prev) => (prev ? { ...prev, ...studentData } : null));
        }
        showToast(`Datos de ${studentData.name} actualizados en Supabase`);
      } else {
        // Add new in Supabase
        const newStudent = await studentsService.createStudent(studentData);
        setStudents((prev) => [newStudent, ...prev]);
        showToast(`¡Alumno ${newStudent.name} guardado en la nube!`);
      }
    } catch (e: any) {
      showToast(e.message || 'Error al guardar el alumno en Supabase', 'error');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const student = students.find((s) => s.id === studentId);
      await studentsService.deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setSelectedStudent(null);
      if (student) {
        showToast(`Alumno ${student.name} eliminado de Supabase`, 'info');
      }
    } catch (e: any) {
      showToast('Error al eliminar el alumno en Supabase', 'error');
    }
  };

  const handleOpenRecordPayment = (student: Student) => {
    setPaymentTargetStudent(student);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (
    studentId: string,
    amount: number,
    method: PaymentMethod,
    date: string,
    notes?: string
  ) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;

    try {
      const result = await paymentsService.recordPayment({
        studentId,
        amount,
        method,
        date,
        notes,
        currentDueDate: target.dueDate,
      });

      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === studentId) {
            return {
              ...s,
              dueDate: result.newDueDate,
              payments: [result.newPayment, ...s.payments],
            };
          }
          return s;
        })
      );

      // Update selected student if in detail view
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent((prev) =>
          prev
            ? {
                ...prev,
                dueDate: result.newDueDate,
                payments: [result.newPayment, ...prev.payments],
              }
            : null
        );
      }

      const formattedNext = formatDateSpanish(result.newDueDate);
      const formattedAmt = formatCurrency(amount, userProfile.currencySymbol);
      showToast(
        `¡Pago de ${formattedAmt} registrado para ${target.name}! Próximo vencimiento: ${formattedNext}`
      );
    } catch (e: any) {
      showToast(e.message || 'Error al registrar el pago en Supabase', 'error');
    }
  };

  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setUserProfile(INITIAL_USER_PROFILE);
    showToast('Datos restablecidos a los valores iniciales de prueba');
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // If not authenticated, render Login view
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-start sm:py-6">
      {/* Container simulating PWA mobile layout (max-w-md mx-auto) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-slate-100 relative shadow-2xl sm:rounded-[36px] overflow-hidden flex flex-col border border-slate-300">
        
        {/* Top Header Bar */}
        <HeaderBar
          user={userProfile}
          title={selectedStudent ? 'Perfil del Alumno' : undefined}
          showBack={selectedStudent !== null}
          onBack={() => setSelectedStudent(null)}
          overdueCount={overdueCount}
          dueSoonCount={dueSoonCount}
        />

        {/* Main Content View Switcher */}
        <main className="flex-1 overflow-y-auto">
          {selectedStudent ? (
            <StudentDetailView
              student={selectedStudent}
              user={userProfile}
              onEditStudent={handleOpenEditStudent}
              onRecordPayment={handleOpenRecordPayment}
              onDeleteStudent={handleDeleteStudent}
            />
          ) : activeTab === 'home' ? (
            <DashboardView
              students={students}
              user={userProfile}
              onOpenStudentDetail={(student) => setSelectedStudent(student)}
              onRecordPayment={handleOpenRecordPayment}
              onOpenAddModal={handleOpenAddStudent}
            />
          ) : activeTab === 'students' ? (
            <StudentsListView
              students={students}
              user={userProfile}
              onOpenStudentDetail={(student) => setSelectedStudent(student)}
              onRecordPayment={handleOpenRecordPayment}
              onOpenAddModal={handleOpenAddStudent}
            />
          ) : (
            <SettingsView
              user={userProfile}
              onUpdateUser={handleUpdateProfile}
              onResetData={handleResetData}
              onLogout={handleLogout}
              showToast={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation (shown when not viewing student detail) */}
        {!selectedStudent && (
          <BottomNavigation
            activeTab={activeTab}
            onChangeTab={(tab) => {
              setActiveTab(tab);
              setSelectedStudent(null);
            }}
            overdueCount={overdueCount}
          />
        )}

        {/* Modal Form for Add/Edit Student */}
        <StudentFormModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSave={handleSaveStudent}
          initialStudent={editingStudent}
          currencySymbol={userProfile.currencySymbol}
        />

        {/* Modal for Record Payment */}
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          student={paymentTargetStudent}
          currencySymbol={userProfile.currencySymbol}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPaymentTargetStudent(null);
          }}
          onConfirm={handleConfirmPayment}
        />

        {/* Global Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
