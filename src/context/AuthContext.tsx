"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verificar si el correo está en la lista de permitidos
        if (currentUser.email && ALLOWED_ADMIN_EMAILS.includes(currentUser.email)) {
          setUser(currentUser);
        } else {
          // Si no está permitido, cerramos la sesión inmediatamente
          await signOut(auth);
          setUser(null);
          // Opcional: Podrías disparar una alerta aquí o guardar un error en el estado global
          alert("Acceso denegado: Tu cuenta no tiene permisos de administrador.");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
