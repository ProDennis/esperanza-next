"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/admin-aoibh");
    } catch (err: any) {
      setError("Error al iniciar sesión con Google. Intenta nuevamente.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-neutral-700 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">Admin Login</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm w-full text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-800 font-bold py-3 px-4 rounded-lg transition-colors border border-neutral-200"
        >
          <Image src="/google-logo.svg" alt="Google" width={24} height={24} />
          <span>Ingresar con Google</span>
        </button>

        <p className="text-neutral-500 text-sm mt-6 text-center">
          Solo el personal autorizado puede acceder al panel.
        </p>
      </div>
    </div>
  );
}
