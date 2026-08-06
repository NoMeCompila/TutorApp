import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export const authService = {
  /**
   * Registrar una nueva usuaria/maestra en Supabase Auth
   */
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Cerrar sesión
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  /**
   * Obtener el perfil público desde la tabla `profiles`
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      name: data.full_name || 'Maestra TutorApp',
      role: 'Tutora Principal',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      customWhatsappMsg: 'Hola {student_name}, te recuerdo que el pago de {subject} vence el {due_date}. El monto es {amount}.',
      currencySymbol: '$',
    };
  },

  /**
   * Obtener la sesión activa actual
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  },

  /**
   * Escuchar cambios de estado de autenticación (login, logout, etc.)
   */
  onAuthStateChange(callback: (session: any) => void) {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return subscription;
  },
};
