import { supabase } from '../lib/supabase';
import { PaymentMethod } from '../types';
import { addDaysToDate } from '../utils/studentHelpers';

export interface RecordPaymentParams {
  studentId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  notes?: string;
  currentDueDate: string;
}

export const paymentsService = {
  /**
   * Registra un pago en `payment_history` y actualiza la fecha de vencimiento en `subscriptions`
   */
  async recordPayment({
    studentId,
    amount,
    method,
    date,
    notes,
    currentDueDate,
  }: RecordPaymentParams) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    // 1. Obtener la suscripción activa del alumno
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('id, due_date')
      .eq('student_id', studentId)
      .maybeSingle();

    let subscriptionId = sub?.id;
    const baseDueDate = sub?.due_date || currentDueDate;

    // Si por alguna razón no existía la suscripción, la creamos
    if (!subscriptionId) {
      const { data: newSub, error: createSubError } = await supabase
        .from('subscriptions')
        .insert({
          student_id: studentId,
          user_id: user.id,
          due_date: currentDueDate,
          status: 'ACTIVE',
        })
        .select()
        .single();

      if (createSubError || !newSub) {
        throw createSubError || new Error('No se pudo encontrar ni crear la suscripción');
      }
      subscriptionId = newSub.id;
    }

    // 2. Registrar el pago en `payment_history`
    const { data: newPayment, error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        subscription_id: subscriptionId,
        student_id: studentId,
        user_id: user.id,
        amount,
        payment_date: date ? `${date}T12:00:00Z` : new Date().toISOString(),
        payment_method: method,
        notes,
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error al registrar pago en Supabase:', paymentError);
      throw paymentError;
    }

    // 3. Calcular la nueva fecha de vencimiento (+30 días)
    const newDueDate = addDaysToDate(baseDueDate, 30);

    // 4. Actualizar la suscripción con la nueva fecha de vencimiento y estado ACTIVE
    const { error: updateSubError } = await supabase
      .from('subscriptions')
      .update({
        due_date: newDueDate,
        status: 'ACTIVE',
        last_paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    if (updateSubError) {
      console.error('Error al renovar la fecha de vencimiento en Supabase:', updateSubError);
      throw updateSubError;
    }

    return {
      newPayment: {
        id: newPayment.id,
        studentId,
        amount: Number(newPayment.amount),
        date: date || new Date().toISOString().split('T')[0],
        method,
        notes,
      },
      newDueDate,
    };
  },
};
