import { Laptop } from "../../../interfaces/laptop";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getLaptop(id: string): Promise<Laptop | null> {
  // Validación temprana: evita pegarle al backend con "undefined" o vacío
  if (!id || id === "undefined") return null;

  const res = await fetch(`http://localhost:3000/laptops/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Error al cargar la laptop");
  }

  return res.json();
}

export default async function LaptopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;   // 👈 Promise en Next 15
}) {
  const { id } = await params;       // 👈 await antes de usar .id

  const laptop = await getLaptop(id);

  if (!laptop) {
    notFound(); // Redirige a una página 404 automática si no encuentra el ID
  }

  // Configuración de WhatsApp (Código 505 para Nicaragua + tu número)
  const numeroWhatsApp = "50581100299"; 
  const mensaje = `¡Hola! Me interesa la laptop ${laptop.brand} ${laptop.model} por $${laptop.price} que vi en el catálogo.`;
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Botón de regreso */}
        <div className="p-4 border-b">
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            &larr; Volver al catálogo
          </Link>
        </div>

        <div className="md:flex">
          {/* Sección de Imagen */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center min-h-[300px]">
            {laptop.imageUrl ? (
              <img 
                src={laptop.imageUrl} 
                alt={`${laptop.brand} ${laptop.model}`} 
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400">Sin imagen disponible</span>
            )}
          </div>

          {/* Sección de Detalles */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-bold">
              {laptop.brand}
            </div>
            <h1 className="mt-1 text-3xl font-black text-gray-900 leading-tight">
              {laptop.model}
            </h1>
            
            <p className="mt-4 text-3xl text-gray-700 font-bold">
              ${laptop.price}
            </p>

            <div className="mt-6 border-t pt-6 space-y-3">
              <p className="text-gray-600"><strong>Procesador:</strong> {laptop.processor}</p>
              <p className="text-gray-600"><strong>Memoria RAM:</strong> {laptop.ram}</p>
              <p className="text-gray-600"><strong>Almacenamiento:</strong> {laptop.storage}</p>
            </div>

            {laptop.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900">Descripción:</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {laptop.description}
                </p>
              </div>
            )}

            {/* Botón de WhatsApp */}
            <div className="mt-8">
              <a 
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Comprar por WhatsApp
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}