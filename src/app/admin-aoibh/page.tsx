"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Product } from "../../lib/types";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'price', dir: 'asc' | 'desc' }>({ key: 'price', dir: 'desc' });

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await setDoc(doc(db, "settings", "contact_info"), contactInfo);
      alert("Información de contacto actualizada correctamente");
    } catch (error) {
      console.error("Error updating contact info:", error);
      alert("Error al actualizar la información");
    } finally {
      setSavingContact(false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  // Contact settings state
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    whatsapp: "",
    address: "",
    hours: "",
    facebook: "",
    instagram: "",
    pedidosYa: "",
    googleMapsSrc: ""
  });
  const [savingContact, setSavingContact] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>({
    name: "",
    image: "/logo.webp",
    description: "",
    price: 0,
    category: "tradicional",
    type: "pupusa"
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setFetching(false);
      }
    };

    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, "settings", "contact_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactInfo(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    if (user) {
      fetchProductsData();
      fetchContactInfo();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, "products", currentId), { ...formData });
      } else {
        await addDoc(collection(db, "products"), formData);
      }
      // Reset form
      setFormData({ name: "", image: "/logo.webp", description: "", price: 0, category: "tradicional", type: "pupusa" });
      setIsEditing(false);
      setCurrentId(null);
      // Re-fetch products after add/update
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setCurrentId(product.id!);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        // Re-fetch products after delete
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productList);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const nameCounts = products.reduce((acc, p) => {
    acc[p.name] = (acc[p.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesPrice = maxPrice === "" || p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortConfig.key === 'price') {
      return sortConfig.dir === 'asc' ? a.price - b.price : b.price - a.price;
    } else {
      return sortConfig.dir === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  if (loading || !user) return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">Panel de Administración</h1>
            <p className="text-neutral-400 text-sm">Gestiona tus productos e información de contacto</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            {/* Formulario de Productos */}
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                {isEditing && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Editando</span>}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none" required />
                </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Tipo</label>
                      <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none">
                        <option value="pupusa">Pupusa</option>
                        <option value="tamal">Tamal</option>
                        <option value="bebida">Bebida</option>
                        <option value="comida">Comida</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Categoría</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none">
                        {formData.type === "pupusa" && (
                          <>
                            <option value="tradicional">Tradicional</option>
                            <option value="especial">Especial</option>
                          </>
                        )}
                        {formData.type === "tamal" && (
                          <option value="tradicional">Tradicional</option>
                        )}
                        {formData.type === "bebida" && (
                          <>
                            <option value="café">Café</option>
                            <option value="jugo">Jugo</option>
                            <option value="té">Té</option>
                            <option value="gaseosa">Gaseosa</option>
                            <option value="fresco">Fresco</option>
                            <option value="licuados">Licuado</option>
                            <option value="agua">Agua</option>
                          </>
                        )}
                        {formData.type === "comida" && (
                          <option value="comida">Comida</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Precio ($)</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none" required />
                  </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Descripción</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none h-24" required></textarea>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Imagen</label>
                  <div className="flex gap-4 items-center">
                    <select name="image" value={formData.image} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none">
                      <option value="/agua.webp">Agua</option>
                      <option value="/banano-leche.webp">Banano Leche</option>
                      <option value="/cafe.webp">Café</option>
                      <option value="/cafe-leche.webp">Café con Leche</option>
                      <option value="/chocolate.webp">Chocolate</option>
                      <option value="/cocacola.webp">Coca Cola</option>
                      <option value="/fanta.webp">Fanta</option>
                      <option value="/fresa.webp">Fresa</option>
                      <option value="/fresa-leche.webp">Fresa con Leche</option>
                      <option value="/jamaica.webp">Jamaica</option>
                      <option value="/kolashanpan.webp">Kolashanpan</option>
                      <option value="/leche.webp">Leche</option>
                      <option value="/mandarina.webp">Mandarina</option>
                      <option value="/manzana-espinaca.webp">Manzana y Espinaca</option>
                      <option value="/naranja.webp">Naranja</option>
                      <option value="/naranja-arandanos.webp">Naranja y Arándanos</option>
                      <option value="/orchata.webp">Horchata</option>
                      <option value="/oreo.webp">Oreo</option>
                      <option value="/papaya-limon.webp">Papaya con Limón</option>
                      <option value="/pepino-espinaca.webp">Pepino y Espinaca</option>
                      <option value="/pepino-limon.webp">Pepino con Limón</option>
                      <option value="/pepino-piña.webp">Pepino con Piña</option>
                      <option value="/pupusa.webp">Pupusa</option>
                      <option value="/remolacha-naranja.webp">Remolacha y Naranja</option>
                      <option value="/salutaris.webp">Salutaris</option>
                      <option value="/sprite.webp">Sprite</option>
                      <option value="/tamales-elote.webp">Tamales de Elote</option>
                      <option value="/tamales-pisques.webp">Tamales Pisques</option>
                      <option value="/tamales-pollo.webp">Tamales de Pollo</option>
                      <option value="/te-durazno.webp">Té de Durazno</option>
                      <option value="/te-frambuesa.webp">Té de Frambuesa</option>
                      <option value="/te-limon.webp">Té de Limón</option>
                      <option value="/tomate-apio.webp">Tomate y Apio</option>
                      <option value="/toronja-naranja.webp">Toronja y Naranja</option>
                      <option value="/uva.webp">Uva</option>
                      <option value="/zanahoria-naranja.webp">Zanahoria y Naranja</option>
                    </select>
                    
                    {formData.image && (
                      <div className="shrink-0">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded shadow-md bg-white border border-neutral-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-500 py-3 rounded-lg font-bold transition-colors">
                    {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', description: '', price: 0, category: 'tradicional', type: 'pupusa', image: '/logo.webp' }); setCurrentId(null); }} className="bg-neutral-700 hover:bg-neutral-600 px-4 py-3 rounded-lg font-bold transition-colors">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Configuración de Contacto */}
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Datos de Contacto</h2>
              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Teléfono</label>
                  <input type="text" name="phone" value={contactInfo.phone} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">WhatsApp (solo números)</label>
                  <input type="text" name="whatsapp" value={contactInfo.whatsapp} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Dirección</label>
                  <textarea name="address" value={contactInfo.address} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none h-20" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Horarios</label>
                  <input type="text" name="hours" value={contactInfo.hours} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Facebook URL</label>
                    <input type="text" name="facebook" value={contactInfo.facebook} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none text-xs" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Instagram URL</label>
                    <input type="text" name="instagram" value={contactInfo.instagram} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Pedidos Ya URL</label>
                  <input type="text" name="pedidosYa" value={contactInfo.pedidosYa} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none text-xs" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Google Maps Iframe (src)</label>
                  <input type="text" name="googleMapsSrc" value={contactInfo.googleMapsSrc} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-orange-500 focus:outline-none text-xs" />
                </div>
                <button 
                  type="submit" 
                  disabled={savingContact}
                  className="w-full bg-orange-600 hover:bg-orange-500 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {savingContact ? 'Guardando...' : 'Guardar Datos de Contacto'}
                </button>
              </form>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="lg:col-span-2 bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div className="flex flex-col mb-6 gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Productos ({filteredProducts.length})</h2>
              </div>

              {/* Filtros */}
              <div className="flex justify-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="calientes">Bebidas Calientes</option>
                    <option value="frias">Bebidas Frías</option>
                    <option value="frozen">Frozen</option>
                    <option value="te">Té Frío</option>
                    <option value="licuados">Licuados</option>
                    <option value="naturales">Jugos Naturales</option>
                    <option value="nacionales">Pupusas</option>
                    <option value="tamales">Tamales</option>
                  </select>
                </div>
              </div>
            </div>

            {fetching ? (
              <p className="text-neutral-400">Cargando productos...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-left text-neutral-400 text-sm border-b border-neutral-700">
                      <th className="py-3 font-medium cursor-pointer select-none group" onClick={() => setSortConfig({ key: 'name', dir: sortConfig.key === 'name' && sortConfig.dir === 'asc' ? 'desc' : 'asc' })}>
                        <div className="flex items-center gap-1 group-hover:text-white transition-colors">
                          Producto
                          {sortConfig.key === 'name' && (
                            sortConfig.dir === 'asc' ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )
                          )}
                        </div>
                      </th>
                      <th className="py-3 font-medium">Categoría</th>
                      <th className="py-3 font-medium cursor-pointer select-none group" onClick={() => setSortConfig({ key: 'price', dir: sortConfig.key === 'price' && sortConfig.dir === 'asc' ? 'desc' : 'asc' })}>
                        <div className="flex items-center gap-1 group-hover:text-white transition-colors">
                          Precio
                          {sortConfig.key === 'price' && (
                            sortConfig.dir === 'asc' ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )
                          )}
                        </div>
                      </th>
                      <th className="py-3 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b border-neutral-700">
                        <td className="py-3 flex items-center gap-2">
                          <img src={p.image.startsWith('/') ? p.image : `/${p.image}`} alt={p.name} className="w-8 h-8 object-cover rounded bg-white" />
                          <div className="flex flex-col">
                            <span>{p.name}</span>
                            {nameCounts[p.name] > 1 && (
                              <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 w-fit">
                                Repetido
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 capitalize">
                          <div className="text-xs text-neutral-500">{p.type}</div>
                          <div>{p.category}</div>
                        </td>
                        <td className="py-3">${p.price.toFixed(2)}</td>
                        <td className="py-3 flex justify-end gap-2">
                          <button onClick={() => handleEdit(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors group" title="Editar">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                              <path d="M16 5l3 3" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(p.id!)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors group" title="Eliminar">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-neutral-500">No hay productos registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
