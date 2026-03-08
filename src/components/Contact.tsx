"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Contact() {
    const [contactInfo, setContactInfo] = useState({
        phone: "+503 7000-6128",
        whatsapp: "70006128",
        address: "Carretera a Quezaltepeque KM, 18, local D-8 FOOD COURT centro comercial, Mall san Gabriel Apopa San Salvador",
        hours: "Lunes - Domingo: 6:00 AM - 10:00 PM",
        googleMapsSrc: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1733.108325402569!2d-89.22485682480324!3d13.794523895364373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2ssv!4v1770706055670!5m2!1ses-419!2ssv",
        pedidosYa: ""
    });

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const docRef = doc(db, "settings", "contact_info");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContactInfo(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching contact info:", error);
            }
        };
        fetchContactInfo();
    }, []);

    return (
        <section id="contact" className="py-20 md:py-28 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800">
                        Visítanos
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Estamos listos para atenderte con el mejor sabor salvadoreño.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Información de Contacto */}
                    <div className="space-y-8">
                        <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Información</h3>

                            <div className="space-y-6">
                                <ContactItem
                                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    title="Ubicación"
                                    content={contactInfo.address}
                                />

                                <ContactItem
                                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                    title="Teléfono"
                                    content={contactInfo.phone}
                                />

                                <ContactItem
                                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    title="Horarios"
                                    content={contactInfo.hours}
                                />
                            </div>

                            {contactInfo.pedidosYa && (
                                <div className="mt-8">
                                    <a
                                        href={contactInfo.pedidosYa}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#E11933] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md"
                                    >
                                        Pedir en PedidosYa
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="h-full min-h-[400px] bg-slate-100 rounded-3xl overflow-hidden shadow-inner relative">
                        <iframe
                            src={contactInfo.googleMapsSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ContactItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white text-amber-500 rounded-2xl shadow-sm border border-orange-100 shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{title}</h4>
                <div className="text-slate-600">{content}</div>
            </div>
        </div>
    )
}