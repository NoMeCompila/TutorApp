import { supabase } from '../lib/supabase';
import { Student, PaymentRecord, PaymentMethod } from '../types';

export const studentsService = {
  /**
   * Obtener todos los alumnos del usuario autenticado con sus suscripciones e historial de pagos
   */
  async getStudents(): Promise<Student[]> {
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select(`
        id,
        full_name,
        phone_number,
        subject,
        monthly_fee,
        created_at,
        subscriptions (
          id,
          due_date,
          status,
          last_paid_at
        ),
        payment_history (
          id,
          amount,
          payment_date,
          payment_method,
          notes
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (studentsError) {
      console.error('Error fetching students from Supabase:', studentsError);
      throw studentsError;
    }

    if (!studentsData) return [];

    return studentsData.map((s: any) => {
      // Tomamos la suscripción más reciente si hay varias
      const sub = Array.isArray(s.subscriptions) && s.subscriptions.length > 0
        ? s.subscriptions[0]
        : null;

      const payments: PaymentRecord[] = Array.isArray(s.payment_history)
        ? s.payment_history.map((p: any) => ({
            id: p.id,
            studentId: s.id,
            amount: Number(p.amount),
            date: p.payment_date ? p.payment_date.split('T')[0] : new Date().toISOString().split('T')[0],
            method: (p.payment_method as PaymentMethod) || 'Transferencia',
            notes: p.notes || '',
          }))
        : [];

      return {
        id: s.id,
        name: s.full_name,
        subject: s.subject,
        countryCode: '+54',
        phone: s.phone_number,
        amount: Number(s.monthly_fee),
        dueDate: sub ? sub.due_date : new Date().toISOString().split('T')[0],
        payments,
        createdAt: s.created_at ? s.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      };
    });
  },

  /**
   * Crear un nuevo alumno y su suscripción inicial en Supabase
   */
  async createStudent(studentData: Omit<Student, 'id' | 'payments' | 'createdAt'>): Promise<Student> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    // 1. Insertar alumno
    const { data: newStudent, error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: user.id,
        full_name: studentData.name,
        phone_number: studentData.phone,
        subject: studentData.subject,
        monthly_fee: studentData.amount,
        is_active: true,
      })
      .select()
      .single();

    if (studentError || !newStudent) {
      console.error('Error creating student:', studentError);
      throw studentError || new Error('No se pudo crear el alumno');
    }

    // 2. Crear suscripción inicial
    const { data: newSub, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        student_id: newStudent.id,
        user_id: user.id,
        due_date: studentData.dueDate,
        status: 'ACTIVE',
      })
      .select()
      .single();

    if (subError) {
      console.error('Error creating initial subscription:', subError);
    }

    return {
      id: newStudent.id,
      name: newStudent.full_name,
      subject: newStudent.subject,
      countryCode: studentData.countryCode || '+54',
      phone: newStudent.phone_number,
      amount: Number(newStudent.monthly_fee),
      dueDate: newSub ? newSub.due_date : studentData.dueDate,
      payments: [],
      createdAt: newStudent.created_at ? newStudent.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    };
  },

  /**
   * Actualizar los datos de un alumno y su fecha de vencimiento
   */
  async updateStudent(id: string, studentData: Omit<Student, 'id' | 'payments' | 'createdAt'>): Promise<void> {
    // 1. Actualizar tabla `students`
    const { error: studentError } = await supabase
      .from('students')
      .update({
        full_name: studentData.name,
        phone_number: studentData.phone,
        subject: studentData.subject,
        monthly_fee: studentData.amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (studentError) {
      console.error('Error updating student:', studentError);
      throw studentError;
    }

    // 2. Actualizar fecha de vencimiento en `subscriptions`
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        due_date: studentData.dueDate,
        updated_at: new Date().toISOString(),
      })
      .eq('student_id', id);

    if (subError) {
      console.error('Error updating subscription due date:', subError);
    }
  },

  /**
   * Eliminar un alumno de Supabase
   */
  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
};
