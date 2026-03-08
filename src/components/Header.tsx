"use client";

import { useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"

export default function Header() {

    const [collapse, setCollapse] = useState(false)

    const navItems = [
        { name: 'Inicio', href: '/' },
        { name: 'Menu', href: '#menu' },
        { name: 'Sobre Nosotros', href: '#about' },
        { name: 'Contacto', href: '#contact' },
    ]

    return (
        <header className="flex justify-between items-center p-4 sticky top-0 z-40 backdrop-blur-md bg-orange-50/90">
            <Image width={100} height={100} src="/logo.webp" alt="logo" className="w-40 h-18 object-contain drop-shadow-md md:hidden" />
            <Image width={100} height={100} src="/logo_no_text.webp" alt="logo" className="w-18 h-18 object-contain drop-shadow-md hidden md:block" />
            <button className="md:hidden cursor-pointer text-slate-800" onClick={() => setCollapse(!collapse)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <nav className="md:block hidden">
                <ul className="flex gap-8">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a href={item.href} className="text-slate-700 hover:text-amber-600 transition-colors font-bold text-lg">{item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            {createPortal(
                <div
                    className={`fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${collapse ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                    onClick={() => setCollapse(false)}
                >
                    <nav
                        className={`h-full w-2/3 max-w-xs bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out ${collapse ? "translate-x-0" : "translate-x-full"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end mb-8">
                            <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setCollapse(false)}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ul className="flex flex-col gap-6 text-lg font-medium text-gray-800">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="hover:text-amber-500 transition-colors" onClick={() => setCollapse(false)}>
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>,
                document.body
            )}

        </header>
    )
}
