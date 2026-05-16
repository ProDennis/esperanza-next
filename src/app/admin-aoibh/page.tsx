"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Product } from "../../lib/types";

const imageOptions = [
  { value: "/agua.webp", label: "Agua" },
  { value: "/banano-leche.webp", label: "Banano Leche" },
  { value: "/cafe.webp", label: "Café" },
  { value: "/cafe-leche.webp", label: "Café con Leche" },
  { value: "/chocolate.webp", label: "Chocolate" },
  { value: "/cocacola.webp", label: "Coca Cola" },
  { value: "/fanta.webp", label: "Fanta" },
  { value: "/fresa.webp", label: "Fresa" },
  { value: "/fresa-leche.webp", label: "Fresa con Leche" },
  { value: "/jamaica.webp", label: "Jamaica" },
  { value: "/kolashanpan.webp", label: "Kolashanpan" },
  { value: "/leche.webp", label: "Leche" },
  { value: "/mandarina.webp", label: "Mandarina" },
  { value: "/manzana-espinaca.webp", label: "Manzana y Espinaca" },
  { value: "/naranja.webp", label: "Naranja" },
  { value: "/naranja-arandanos.webp", label: "Naranja y Arándanos" },
  { value: "/orchata.webp", label: "Horchata" },
  { value: "/oreo.webp", label: "Oreo" },
  { value: "/papaya-limon.webp", label: "Papaya con Limón" },
  { value: "/pepino-espinaca.webp", label: "Pepino y Espinaca" },
  { value: "/pepino-limon.webp", label: "Pepino con Limón" },
  { value: "/pepino-piña.webp", label: "Pepino con Piña" },
  { value: "/pupusa.webp", label: "Pupusa" },
  { value: "/remolacha-naranja.webp", label: "Remolacha y Naranja" },
  { value: "/salutaris.webp", label: "Salutaris" },
  { value: "/sprite.webp", label: "Sprite" },
  { value: "/tamales-elote.webp", label: "Tamales de Elote" },
  { value: "/tamales-pisques.webp", label: "Tamales Pisques" },
  { value: "/tamales-pollo.webp", label: "Tamales de Pollo" },
  { value: "/te-durazno.webp", label: "Té de Durazno" },
  { value: "/te-frambuesa.webp", label: "Té de Frambuesa" },
  { value: "/te-limon.webp", label: "Té de Limón" },
  { value: "/tomate-apio.webp", label: "Tomate y Apio" },
  { value: "/toronja-naranja.webp", label: "Toronja y Naranja" },
  { value: "/uva.webp", label: "Uva" },
  { value: "/zanahoria-naranja.webp", label: "Zanahoria y Naranja" }
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Tab Navigation
  const [activeTab, setActiveTab] = useState<'productos' | 'configuracion' | 'administradores'>('productos');

  // Custom Image Select State
  const [isImageSelectOpen, setIsImageSelectOpen] = useState(false);
  const [imageSearch, setImageSearch] = useState("");

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'price', dir: 'asc' | 'desc' }>({ key: 'price', dir: 'desc' });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Admin Users State
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [fetchingAdmins, setFetchingAdmins] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setFetching(false);
      }
    };

    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 'contact_info').single();
        if (error) {
          if (error.code !== 'PGRST116') throw error;
        } else if (data) {
          const { id, ...restData } = data;
          setContactInfo(restData as any);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    const fetchAdminUsers = async () => {
      try {
        const { data, error } = await supabase.from('admin_users').select('*');
        if (error) {
          if (error.code !== '42P01') console.error("Error fetching admins:", error); // Ignore table not found if not created yet
        } else {
          setAdminUsers(data?.map(d => d.email) || []);
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      } finally {
        setFetchingAdmins(false);
      }
    };

    if (user) {
      fetchProductsData();
      fetchContactInfo();
      fetchAdminUsers();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  /* --- PRODUCT HANDLERS --- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value
    }));
  };

  const handleImageSelect = (value: string) => {
    setFormData(prev => ({ ...prev, image: value }));
    setIsImageSelectOpen(false);
    setImageSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        const { error } = await supabase.from('products').update(formData).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([formData]);
        if (error) throw error;
      }
      setFormData({ name: "", image: "/logo.webp", description: "", price: 0, category: "tradicional", type: "pupusa" });
      setIsEditing(false);
      setCurrentId(null);
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      alert("Producto guardado exitosamente");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error al guardar producto");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setCurrentId(product.id!);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        const { data } = await supabase.from('products').select('*');
        setProducts(data || []);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  /* --- CONTACT HANDLERS --- */
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      const { error } = await supabase.from('settings').upsert({ id: 'contact_info', ...contactInfo });
      if (error) throw error;
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

  /* --- ADMIN USERS HANDLERS --- */
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      alert("Ingresa un correo electrónico válido.");
      return;
    }
    
    try {
      const { error } = await supabase.from('admin_users').insert([{ email: newAdminEmail.trim() }]);
      if (error) {
        if (error.code === '23505') alert("Este correo ya es administrador.");
        else throw error;
      } else {
        setAdminUsers([...adminUsers, newAdminEmail.trim()]);
        setNewAdminEmail("");
        alert("Administrador agregado con éxito.");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Error al agregar administrador. ¿Creaste la tabla en Supabase?");
    }
  };

  const handleDeleteAdmin = async (email: string) => {
    if (email === user?.email) {
      alert("No puedes eliminar tu propio correo por seguridad.");
      return;
    }

    if (confirm(`¿Estás seguro de revocar el acceso a ${email}?`)) {
      try {
        const { error } = await supabase.from('admin_users').delete().eq('email', email);
        if (error) throw error;
        setAdminUsers(adminUsers.filter(e => e !== email));
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Error al eliminar administrador.");
      }
    }
  };

  /* --- COMPUTED PRODUCTS & PAGINATION --- */
  const nameCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.name] = (acc[p.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, searchQuery, filterCategory, maxPrice, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, maxPrice]);

  if (loading || !user) return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30">
      
      {/* Header Premium */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg shadow-orange-500/20 flex items-center justify-center text-xl">
              🥟
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Pupuseria Esperanza</h1>
              <p className="text-neutral-400 text-xs">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Conectado como <span className="text-white font-medium">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-neutral-800 hover:bg-neutral-700 hover:text-white px-4 py-2 text-neutral-300 rounded-lg text-sm transition-all border border-neutral-700 hover:border-neutral-600 shadow-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide border-b border-neutral-800">
          <button 
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all border-b-2 ${activeTab === 'productos' ? 'text-orange-400 border-orange-500 bg-orange-500/5' : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-neutral-900'}`}
          >
            🍔 Gestión de Productos
          </button>
          <button 
            onClick={() => setActiveTab('configuracion')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all border-b-2 ${activeTab === 'configuracion' ? 'text-orange-400 border-orange-500 bg-orange-500/5' : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-neutral-900'}`}
          >
            ⚙️ Datos de Contacto
          </button>
          <button 
            onClick={() => setActiveTab('administradores')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all border-b-2 ${activeTab === 'administradores' ? 'text-orange-400 border-orange-500 bg-orange-500/5' : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-neutral-900'}`}
          >
            🔒 Administradores
          </button>
        </div>

        {/* --- TAB CONTENT: PRODUCTOS --- */}
        {activeTab === 'productos' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Panel Izquierdo: Formulario */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-neutral-900/50 backdrop-blur p-6 rounded-2xl border border-neutral-800 shadow-xl shadow-black/20">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                  {isEditing ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Nombre</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none" placeholder="Ej. Pupusa de Ayote" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Tipo</label>
                      <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-orange-500 outline-none appearance-none [&>option]:bg-neutral-900 [&>option]:text-white">
                        <option value="pupusa">Pupusa</option>
                        <option value="tamal">Tamal</option>
                        <option value="bebida">Bebida</option>
                        <option value="comida">Comida</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Categoría</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-orange-500 outline-none appearance-none [&>option]:bg-neutral-900 [&>option]:text-white">
                        {formData.type === "pupusa" && (
                          <>
                            <option value="tradicional">Tradicional</option>
                            <option value="especial">Especial</option>
                          </>
                        )}
                        {formData.type === "tamal" && <option value="tradicional">Tradicional</option>}
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
                        {formData.type === "comida" && <option value="comida">Comida</option>}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Precio ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                      <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 pl-8 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Descripción</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none min-h-[100px] resize-none" placeholder="Breve descripción del producto..." required></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Imagen</label>
                    <div className="relative">
                      <div 
                        onClick={() => setIsImageSelectOpen(!isImageSelectOpen)}
                        className="flex items-center gap-3 w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm cursor-pointer hover:border-orange-500 transition-colors"
                      >
                        <img 
                          src={formData.image} 
                          alt="Selected" 
                          className="w-8 h-8 object-cover rounded bg-white shadow-sm"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.webp' }}
                        />
                        <span className="flex-1 text-white">
                          {imageOptions.find(o => o.value === formData.image)?.label || "Seleccionar imagen"}
                        </span>
                        <span className="text-neutral-500">▼</span>
                      </div>
                      
                      {isImageSelectOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => { setIsImageSelectOpen(false); setImageSearch(""); }}
                          />
                          <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl shadow-black/50 custom-scrollbar">
                            <div className="sticky top-0 bg-neutral-900 p-2 border-b border-neutral-800 z-10">
                              <input 
                                type="text"
                                placeholder="Buscar imagen..."
                                value={imageSearch}
                                onChange={(e) => setImageSearch(e.target.value)}
                                className="w-full bg-neutral-950 text-white border border-neutral-800 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                            {imageOptions.filter(opt => opt.label.toLowerCase().includes(imageSearch.toLowerCase())).map((opt) => (
                              <div 
                                key={opt.value}
                                onClick={() => handleImageSelect(opt.value)}
                                className="flex items-center gap-3 p-3 hover:bg-neutral-800 cursor-pointer transition-colors border-b border-neutral-800/50 last:border-0"
                              >
                                <img src={opt.value} alt={opt.label} className="w-8 h-8 object-cover rounded bg-white" />
                                <span className="text-sm text-neutral-200">{opt.label}</span>
                              </div>
                            ))}
                            {imageOptions.filter(opt => opt.label.toLowerCase().includes(imageSearch.toLowerCase())).length === 0 && (
                              <div className="p-4 text-center text-sm text-neutral-500">
                                No se encontraron imágenes
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 py-3 rounded-lg font-bold text-white shadow-lg shadow-orange-500/20 transition-all transform active:scale-95">
                      {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', description: '', price: 0, category: 'tradicional', type: 'pupusa', image: '/logo.webp' }); setCurrentId(null); }} className="bg-neutral-800 hover:bg-neutral-700 px-5 py-3 rounded-lg font-semibold text-neutral-300 transition-colors border border-neutral-700">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Panel Derecho: Tabla con Paginación */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-900/50 backdrop-blur rounded-2xl border border-neutral-800 shadow-xl shadow-black/20 flex flex-col overflow-hidden">
                
                {/* Header & Filters */}
                <div className="p-6 border-b border-neutral-800 bg-neutral-900/80">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Inventario</h2>
                      <p className="text-sm text-neutral-400">{filteredProducts.length} productos encontrados</p>
                    </div>
                    
                    <div className="flex w-full sm:w-auto gap-3">
                      <div className="relative w-full sm:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
                        <input
                          type="text"
                          placeholder="Buscar producto..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        />
                      </div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-neutral-950 text-white border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:border-orange-500 outline-none cursor-pointer hidden sm:block appearance-none [&>option]:bg-neutral-900 [&>option]:text-white"
                      >
                        <option value="all">Todas las categorías</option>
                        <option value="tradicional">Tradicional</option>
                        <option value="especial">Especial</option>
                        <option value="licuados">Licuados</option>
                        <option value="gaseosa">Gaseosas</option>
                        <option value="café">Cafés</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-x-auto min-h-[400px]">
                  {fetching ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4 py-20">
                      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <p>Cargando inventario...</p>
                    </div>
                  ) : currentProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4 py-20">
                      <span className="text-4xl">📭</span>
                      <p>No se encontraron productos con esos filtros</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-xs uppercase tracking-wider text-neutral-500 bg-neutral-950/50">
                          <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => setSortConfig({ key: 'name', dir: sortConfig.key === 'name' && sortConfig.dir === 'asc' ? 'desc' : 'asc' })}>
                            <div className="flex items-center gap-2">
                              Producto
                              {sortConfig.key === 'name' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
                            </div>
                          </th>
                          <th className="py-4 px-6 font-semibold">Tipo</th>
                          <th className="py-4 px-6 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => setSortConfig({ key: 'price', dir: sortConfig.key === 'price' && sortConfig.dir === 'asc' ? 'desc' : 'asc' })}>
                            <div className="flex items-center gap-2">
                              Precio
                              {sortConfig.key === 'price' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
                            </div>
                          </th>
                          <th className="py-4 px-6 font-semibold text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {currentProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors group">
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-4">
                                <img src={p.image.startsWith('/') ? p.image : `/${p.image}`} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-white shadow-sm" />
                                <div>
                                  <p className="font-medium text-white group-hover:text-orange-400 transition-colors">{p.name}</p>
                                  {nameCounts[p.name] > 1 && (
                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-medium">Duplicado</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-6">
                              <div className="flex flex-col">
                                <span className="text-sm text-neutral-300 capitalize">{p.category}</span>
                                <span className="text-xs text-neutral-500 capitalize">{p.type}</span>
                              </div>
                            </td>
                            <td className="py-3 px-6">
                              <span className="font-mono bg-neutral-900 px-2 py-1 rounded text-sm text-neutral-300 border border-neutral-800">
                                ${p.price.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-6">
                              <div className="flex justify-end gap-2 transition-opacity">
                                <button onClick={() => handleEdit(p)} className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Editar">
                                  ✏️
                                </button>
                                <button onClick={() => handleDelete(p.id!)} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Eliminar">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination Controls */}
                {filteredProducts.length > 0 && (
                  <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
                    <p className="text-sm text-neutral-500">
                      Mostrando <span className="font-medium text-white">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de <span className="font-medium text-white">{filteredProducts.length}</span>
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-neutral-700"
                      >
                        Anterior
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-neutral-700"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: CONFIGURACION --- */}
        {activeTab === 'configuracion' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neutral-900/50 backdrop-blur p-8 rounded-2xl border border-neutral-800 shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold mb-2 text-white">Información Pública</h2>
              <p className="text-neutral-400 text-sm mb-8">Estos datos se muestran en el encabezado y pie de página de la web principal.</p>
              
              <form onSubmit={handleSaveContact} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Teléfono Público</label>
                    <input type="text" name="phone" value={contactInfo.phone} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" placeholder="+503 0000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">WhatsApp (Solo números)</label>
                    <input type="text" name="whatsapp" value={contactInfo.whatsapp} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" placeholder="50300000000" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Horarios de Atención</label>
                  <input type="text" name="hours" value={contactInfo.hours} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-orange-500 outline-none" placeholder="Lunes a Domingo: 6:00 AM - 10:00 PM" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Dirección Física</label>
                  <textarea name="address" value={contactInfo.address} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-orange-500 outline-none min-h-[80px] resize-y" placeholder="Dirección del local..."></textarea>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <h3 className="text-sm font-bold text-white mb-4">Redes y Enlaces</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Facebook URL</label>
                      <input type="text" name="facebook" value={contactInfo.facebook} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Instagram URL</label>
                      <input type="text" name="instagram" value={contactInfo.instagram} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-pink-500 outline-none" placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Pedidos Ya URL</label>
                      <input type="text" name="pedidosYa" value={contactInfo.pedidosYa} onChange={handleContactChange} className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 text-sm focus:border-red-500 outline-none" placeholder="https://pedidosyasv.com.sv/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Google Maps Embed (src)</label>
                      <input type="text" name="googleMapsSrc" value={contactInfo.googleMapsSrc} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs focus:border-orange-500 outline-none text-neutral-500 font-mono" placeholder="https://www.google.com/maps/embed?pb=..." />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={savingContact}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {savingContact ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Guardando...</>
                    ) : 'Guardar Configuración de Contacto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: ADMINISTRADORES --- */}
        {activeTab === 'administradores' && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neutral-900/50 backdrop-blur p-8 rounded-2xl border border-neutral-800 shadow-xl shadow-black/20">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Gestión de Accesos</h2>
                  <p className="text-neutral-400 text-sm max-w-lg">
                    Agrega los correos electrónicos de las personas que podrán acceder a este panel de administración con Google.
                  </p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <span className="text-3xl">🔐</span>
                </div>
              </div>

              {/* Formulario Agregar Admin */}
              <form onSubmit={handleAddAdmin} className="flex gap-3 mb-10 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">✉️</span>
                  <input 
                    type="email" 
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="nuevo.admin@gmail.com"
                    className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-sm focus:outline-none text-white placeholder-neutral-600"
                    required
                  />
                </div>
                <button type="submit" className="bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap shadow-sm">
                  Autorizar Acceso
                </button>
              </form>

              {/* Lista de Administradores */}
              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Administradores Actuales ({adminUsers.length})</h3>
                
                {fetchingAdmins ? (
                  <p className="text-neutral-500 text-center py-8">Cargando administradores...</p>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-950/50">
                    <p className="text-neutral-500 mb-2">Aún no has agregado correos desde aquí.</p>
                    <p className="text-xs text-neutral-600">(Tu correo maestro de Vercel sigue funcionando por seguridad)</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminUsers.map((email) => (
                      <div key={email} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-neutral-200">{email}</span>
                          {email === user?.email && (
                            <span className="text-[10px] uppercase font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">Tú</span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDeleteAdmin(email)}
                          disabled={email === user?.email}
                          className="text-neutral-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                          title={email === user?.email ? "No puedes eliminarte a ti mismo" : "Revocar acceso"}
                        >
                          Revocar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 text-sm text-blue-200">
                <span className="text-xl">ℹ️</span>
                <p>El inicio de sesión solo funciona con cuentas de Google (Gmail). Asegúrate de escribir el correo exactamente igual.</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
