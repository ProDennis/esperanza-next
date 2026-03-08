"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "../lib/types";

export default function FoodMenu() {
    const [menu, setMenu] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeBeverageFilter, setActiveBeverageFilter] = useState("todos");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const data: Product[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as Product);
                });
                setMenu(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const beverageCategories = ["todos", "café", "jugo", "té", "gaseosa", "fresco", "licuados", "agua"];

    return (
        <section className="py-16 md:py-24 bg-white" id="menu">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800">
                        Nuestra <span className="text-amber-600">Variedad</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Explora nuestros sabores tradicionales y especialidades preparadas al momento.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                        <p className="mt-4 text-slate-500 font-medium">Cargando el mejor sabor...</p>
                    </div>
                ) : (
                    <>
                        <MenuCategory 
                            title="Pupusas Tradicionales" 
                            items={menu.filter((item) => item.category === "tradicional" && item.type === "pupusa")} 
                        />
                        <MenuCategory 
                            title="Pupusas Especiales" 
                            items={menu.filter((item) => item.category === "especial" && item.type === "pupusa")} 
                        />
                        <MenuCategory 
                            title="Tamales" 
                            items={menu.filter((item) => item.type === "tamal")} 
                        />

                        <MenuCategory
                            title="Bebidas"
                            items={menu.filter((item) =>
                                item.type === "bebida" &&
                                (activeBeverageFilter === "todos" || item.category === activeBeverageFilter)
                            )}
                        >
                            <div className="flex flex-wrap items-center gap-2 mb-8">
                                {beverageCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveBeverageFilter(cat)}
                                        className={`px-5 py-2 rounded-full cursor-pointer text-sm font-bold capitalize transition-all duration-300 ${activeBeverageFilter === cat
                                            ? "bg-amber-500 text-white shadow-lg shadow-amber-200 scale-105"
                                            : "bg-orange-50 text-orange-400 hover:bg-orange-100"
                                            }`}
                                    >
                                        {cat === "todos" ? "Todas" : cat}
                                    </button>
                                ))}
                            </div>
                        </MenuCategory>
                    </>
                )}
            </div>
        </section>
    );
}

function MenuCategory({ title, items, children }: { title: string, items: Product[], children?: React.ReactNode }) {
    if (items.length === 0 && !children) return null;
    return (
        <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mb-8 border-l-4 border-amber-500 pl-4">
                {title}
            </h3>
            {children}
            {/* Contenedor con scroll suave y ocultamiento de barra de scroll */}
            <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide scroll-smooth">
                {items.length > 0 ? (
                    items.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))
                ) : (
                    <div className="w-full text-center py-10 text-slate-400 italic">
                        No hay productos en esta categoría por ahora.
                    </div>
                )}
            </div>
        </div>
    );
}

function MenuItem({ item }: { item: Product }) {
    return (
        <div className="shrink-0 w-72 snap-start bg-orange-50/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:bg-white border border-transparent hover:border-orange-100 group flex flex-col">
            <div className="relative mb-4 flex justify-center">
                <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <img
                    src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                    alt={item.name}
                    className="w-40 h-40 object-contain drop-shadow-md transform group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            <div className="space-y-2 text-center grow flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-xl text-slate-800 leading-tight group-hover:text-amber-600 transition-colors">
                        {item.name}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 h-10">
                        {item.description}
                    </p>
                </div>
                
                <div className="pt-4 mt-auto">
                    <div className="flex items-center justify-between bg-white/60 rounded-full px-4 py-1.5 border border-orange-100/50">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</span>
                        <span className="text-lg font-black text-slate-800">
                            ${item.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
