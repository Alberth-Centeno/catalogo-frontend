"use client";

import { useState, useEffect } from "react";
import { Laptop } from "../../interfaces/laptop"; // Importamos la interfaz

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // --- NUEVO: Estados para manejar el inventario y la edición ---
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    brand: "", model: "", processor: "", ram: "", storage: "", price: "", imageUrl: "", description: ""
  });

  // --- NUEVO: Cargar las laptops automáticamente cuando haya un token ---
  useEffect(() => {
    if (token) {
      fetchLaptops();
    }
  }, [token]);

  const fetchLaptops = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptops`);
      if (res.ok) {
        const data = await res.json();
        setLaptops(data);
      }
    } catch (error) {
      console.error("Error al cargar inventario", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      alert("Error al conectar con el servidor backend");
    }
  };

  // --- ACTUALIZADO: Esta función ahora sirve para Crear (POST) o Actualizar (PUT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Si tenemos un editingId hacemos PUT, si no, POST
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/laptops/${editingId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/laptops`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }), 
      });

      if (res.ok) {
        alert(editingId ? "¡Computadora actualizada!" : "¡Computadora guardada exitosamente!");
        // Limpiamos el formulario y salimos del modo edición
        resetForm();
        // Recargamos la lista para ver los cambios
        fetchLaptops();
      } else {
        const errorData = await res.json();
        alert(`Error: ${JSON.stringify(errorData.message)}`);
      }
    } catch (error) {
      alert("Error de red al intentar guardar");
    }
  };

  // --- NUEVO: Función para Eliminar (DELETE) ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta laptop del catálogo?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptops/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Laptop eliminada");
        fetchLaptops(); // Recargamos la lista
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      alert("Error de red");
    }
  };

  // --- NUEVO: Cargar datos en el formulario para editar ---
  const handleEdit = (laptop: Laptop) => {
    setEditingId(laptop.id);
    setFormData({
      brand: laptop.brand,
      model: laptop.model,
      processor: laptop.processor,
      ram: laptop.ram,
      storage: laptop.storage,
      price: laptop.price.toString(), // Lo pasamos a string para el input
      imageUrl: laptop.imageUrl || "",
      description: laptop.description || ""
    });
    // Hacemos scroll hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ brand: "", model: "", processor: "", ram: "", storage: "", price: "", imageUrl: "", description: "" });
  };

  // --- VISTA 1: LOGIN ---
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        {/* ... (El formulario de login queda igual) ... */}
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Panel Admin</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700">Ingresar</button>
          </div>
        </form>
      </main>
    );
  }

  // --- VISTA 2: PANEL COMPLETO ---
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Catálogo</h1>
          <button onClick={() => setToken("")} className="text-red-500 font-medium hover:underline">
            Cerrar Sesión
          </button>
        </div>

        {/* --- SECCIÓN 1: FORMULARIO DINÁMICO --- */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10 border-t-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Actualizar Computadora" : "Agregar Nueva Computadora"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <input type="text" required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                <input type="text" required value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Procesador</label>
                <input type="text" required value={formData.processor} onChange={(e) => setFormData({...formData, processor: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Memoria RAM</label>
                <input type="text" required value={formData.ram} onChange={(e) => setFormData({...formData, ram: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Almacenamiento</label>
                <input type="text" required value={formData.storage} onChange={(e) => setFormData({...formData, storage: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio (USD)</label>
                <input type="number" required step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className={`flex-1 text-white font-bold py-3 rounded-md transition-colors ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {editingId ? "Guardar Cambios" : "Agregar al Catálogo"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-md hover:bg-gray-300 transition-colors">
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- SECCIÓN 2: LISTA DE INVENTARIO --- */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Inventario Actual</h2>
          
          {laptops.length === 0 ? (
            <p className="text-gray-500">No hay computadoras registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 border-b">Marca / Modelo</th>
                    <th className="p-3 border-b">Especificaciones</th>
                    <th className="p-3 border-b">Precio</th>
                    <th className="p-3 border-b text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {laptops.map(laptop => (
                    <tr key={laptop.id} className="hover:bg-gray-50 border-b">
                      <td className="p-3 font-medium">
                        {laptop.brand} <br/> <span className="text-sm text-gray-500">{laptop.model}</span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {laptop.ram} • {laptop.storage} <br/> {laptop.processor}
                      </td>
                      <td className="p-3 font-bold text-blue-600">${laptop.price}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(laptop)} 
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-200"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(laptop.id)} 
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}