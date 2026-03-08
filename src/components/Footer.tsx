"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Footer() {
    const [contactInfo, setContactInfo] = useState({
        facebook: "https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61587905220070&sk=about",
        instagram: "https://www.instagram.com/accounts/login/?next=%2Fesperanzapupuseria&source=omni_redirect",
        phone: "+503 7000-6128",
        whatsapp: "50370006128"
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

    // Helper to format WhatsApp link
    const waNumber = contactInfo.whatsapp.replace(/\D/g, "");
    const waLink = `https://wa.me/${waNumber}`;

    return (
        <footer className="bg-zinc-900 py-12 border-t-8 border-amber-600 text-white font-sans">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <img src="/logo.webp" alt="logo" className="w-60 h-32 object-contain drop-shadow-md mx-auto md:mx-0" />
                        <p className="text-zinc-400 mt-2 italic">
                            Hechas con amor, servidas con sabor.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <SocialIcon href={contactInfo.facebook} label="Facebook" icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        } />
                        <SocialIcon href={contactInfo.instagram} label="Instagram" icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        }
                        />
                        <SocialIcon href={waLink} label="WhatsApp" icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        } />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Pupusería Esperanza. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-amber-600 hover:text-white transition-all duration-300"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon || <span className="font-bold text-xs">{label[0]}</span>}
        </a>
    );
}
