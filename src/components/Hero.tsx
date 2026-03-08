"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Hero() {
    const [pedidosYaUrl, setPedidosYaUrl] = useState("https://www.pedidosyasv.com.sv/");

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const docRef = doc(db, "settings", "contact_info");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.pedidosYa) {
                        setPedidosYaUrl(data.pedidosYa);
                    }
                }
            } catch (error) {
                console.error("Error fetching contact info for Hero:", error);
            }
        };
        fetchContactInfo();
    }, []);

    return (
        <section className="relative bg-orange-50 overflow-hidden py-16 md:py-24">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">

                {/* Imagen con fondo decorativo */}
                <div className="w-full md:w-1/2 relative flex justify-center">
                    <div className="absolute inset-0 bg-linear-to-tr from-orange-400 to-amber-300 rounded-full blur-2xl opacity-40 transform scale-90 translate-y-4"></div>
                    <img
                        src="/hero.webp"
                        alt="Plato de pupusas deliciosas"
                        className="relative w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Contenido de texto */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight">
                        Pupusería <span className="text-amber-600 inline-block transform hover:rotate-3 transition-transform cursor-default">Esperanza</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-lg mx-auto md:mx-0">
                        Hechas con amor, servidas con sabor.
                        La auténtica tradición salvadoreña en tu mesa.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-4">
                        <a
                            href="#menu"
                            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all transform hover:-translate-y-1"
                        >
                            Ver Menú
                        </a>

                        <div className="flex items-center gap-2 text-slate-700 font-bold bg-white/50 px-4 py-2 rounded-full border border-orange-100">
                            <span>Pídelo por:</span>
                            <a
                                href={pedidosYaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#EA044E] hover:text-[#c40340] underline decoration-2 underline-offset-2 transition-colors"
                            >
                                PedidosYa
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}