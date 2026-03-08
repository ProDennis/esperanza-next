export default function About() {
    return (
        <section id="about" className="py-20 md:py-28 bg-orange-50 relative overflow-hidden">
            {/* Elemento decorativo flotante */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

                    {/* Imagen / Visual */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/local.webp"
                                alt="Preparación tradicional"
                                className="w-full h-auto object-cover bg-white"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                <span className="text-white font-bold text-lg">Tradición Salvadoreña</span>
                            </div>
                        </div>
                        {/* Insignia flotante */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-xl border-4 border-amber-500 hidden md:block animate-bounce-slow">
                            <div className="text-center">
                                <span className="block text-3xl font-black text-slate-800">100%</span>
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Artesanal</span>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                            Nuestra <span className="text-amber-600 relative inline-block">
                                Historia
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                                </svg>
                            </span>
                        </h2>

                        <div className="space-y-4 text-lg text-slate-600">
                            <p>
                                En <strong className="text-slate-800">Pupusería Esperanza</strong>, no solo servimos comida, compartimos una tradición. Lo que comenzó como un pequeño sueño familiar se ha convertido en el lugar favorito para disfrutar del auténtico sabor salvadoreño.
                            </p>
                            <p>
                                Cada pupusa es palmeada a mano al momento, utilizando ingredientes frescos y nuestra receta secreta de masa y salsas que ha pasado de generación en generación.
                            </p>
                            <p>
                                Creemos que la comida une corazones, y por eso cocinamos con la misma dedicación y cariño que le pondrías a tu propia familia.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-orange-100 mobile-hover-effect">
                                <div className="text-3xl mb-2">🌽</div>
                                <h3 className="font-bold text-slate-800">Maíz Fresco</h3>
                                <p className="text-sm text-slate-500">Masa preparada diariamente</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-orange-100 mobile-hover-effect">
                                <div className="text-3xl mb-2">❤️</div>
                                <h3 className="font-bold text-slate-800">Hecho con Amor</h3>
                                <p className="text-sm text-slate-500">Dedicación en cada plato</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-orange-100 mobile-hover-effect">
                                <div className="text-3xl mb-2">🥣</div>
                                <h3 className="font-bold text-slate-800">Ingredientes Frescos</h3>
                                <p className="text-sm text-slate-500">Ingredientes de calidad</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-orange-100 mobile-hover-effect">
                                <div className="text-3xl mb-2">🥤</div>
                                <h3 className="font-bold text-slate-800">Deliciosas Bebidas</h3>
                                <p className="text-sm text-slate-500">Bebidas naturales y clásicas</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}