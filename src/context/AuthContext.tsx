"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Array de correos permitidos para acceder al panel de admin
// Los correos ahora se leen desde las variables de entorno para no exponerlos en el código cliente.
const ALLOWED_ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS 
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

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        if (session.user.email && ALLOWED_ADMIN_EMAILS.includes(session.user.email)) {
          if (mounted) setUser(session.user);
        } else {
          await supabase.auth.signOut();
          if (mounted) setUser(null);
          alert("Acceso denegado: Tu cuenta no tiene permisos de administrador.");
        }
      } else {
        if (mounted) setUser(null);
      }
      
      if (mounted) setLoading(false);
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        if (session.user.email && ALLOWED_ADMIN_EMAILS.includes(session.user.email)) {
          if (mounted) setUser(session.user);
        } else {
          await supabase.auth.signOut();
          if (mounted) setUser(null);
          alert("Acceso denegado: Tu cuenta no tiene permisos de administrador.");
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
