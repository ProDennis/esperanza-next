"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Array de correos root definidos en el entorno (fallback de emergencia)
const ROOT_ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS 
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',') 
  : [];

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para verificar si un email es administrador
  const verifyAdmin = async (email: string | undefined): Promise<boolean> => {
    if (!email) return false;
    
    // Primero revisamos si es root admin
    if (ROOT_ADMIN_EMAILS.includes(email)) return true;

    // Si no es root, consultamos la tabla en Supabase
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') console.error("Error verificando admin:", error);
        return false;
      }
      
      return !!data;
    } catch (err) {
      console.error("Error inesperado verificando admin:", err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const isAdmin = await verifyAdmin(session.user.email);
        if (isAdmin) {
          if (mounted) setUser(session.user);
        } else {
          await supabase.auth.signOut();
          if (mounted) setUser(null);
          window.location.href = "/";
        }
      } else {
        if (mounted) setUser(null);
      }
      
      if (mounted) setLoading(false);
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isAdmin = await verifyAdmin(session.user.email);
        if (isAdmin) {
          if (mounted) setUser(session.user);
        } else {
          await supabase.auth.signOut();
          if (mounted) setUser(null);
          window.location.href = "/";
        }
      } else {
        if (mounted) setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
