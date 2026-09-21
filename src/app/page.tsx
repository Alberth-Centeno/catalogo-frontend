import { Laptop } from "../interfaces/laptop";

async function getLaptops(): Promise<Laptop[]> {
  // Llamamos al backend en el puerto 3000
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptops`, {
    cache: 'no-store' 
  });

  if (!res.ok) {
    throw new Error('Error al cargar las laptops');
  }

  return res.json();
}
export default async function Home() {
  // Obtenemos los datos directamente en el servidor
  const laptops = await getLaptops();

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold text-center mb-8">
        Catálogo de Laptops
      </h1>
      
      {/* Cuadrícula (Grid) responsiva */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {laptops.map((laptop) => (
          <div 
            key={laptop.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Imagen (Usamos una etiqueta img estándar para el PMV) */}
            <div className="h-48 bg-gray-200 w-full overflow-hidden flex items-center justify-center">
              {laptop.imageUrl ? (
                <img 
                  src={laptop.imageUrl} 
                  alt={`${laptop.brand} ${laptop.model}`} 
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="text-gray-400">Sin imagen</span>
              )}
            </div>

            {/* Detalles de la Laptop */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">
                {laptop.brand} {laptop.model}
              </h2>
              <p className="text-2xl font-black text-blue-600 mt-2">
                ${laptop.price}
              </p>
              
              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li>💻 <span className="font-semibold">CPU:</span> {laptop.processor}</li>
                <li>🧠 <span className="font-semibold">RAM:</span> {laptop.ram}</li>
                <li>💾 <span className="font-semibold">Disco:</span> {laptop.storage}</li>
              </ul>

              <a 
                href={`/laptop/${laptop.id}`}
                className="mt-6 block w-full text-center bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Ver detalles
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si el catálogo está vacío */}
      {laptops.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hay computadoras en el catálogo todavía. ¡Agrega una desde Swagger!
        </p>
      )}
    </main>
  );
}