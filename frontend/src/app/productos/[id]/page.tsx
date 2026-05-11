'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productoService } from '@/services/productoService';

interface Precio {
  ID_PRECIO: number;
  PRECIO: number;
  NOMBRE_SUPERMERCADO: string;
}

export default function ProductoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<any>(null);
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productoService.getProducto(Number(id)),
      productoService.getPrecios(Number(id))
    ]).then(([prod, prec]) => {
      setProducto(prod);
      setPrecios(prec);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!producto) return <div className="text-center py-12">Producto no encontrado</div>;

  const precioMinimo = precios.length > 0 ? Math.min(...precios.map(p => p.PRECIO)) : null;

  return (
    <div>
      <button onClick={() => router.back()} className="text-blue-600 mb-4">← Volver</button>
      
      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-2">{producto.NOMBRE}</h1>
        <p className="text-gray-600">Marca: {producto.MARCA || 'General'}</p>
        {precioMinimo && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-green-800 font-semibold">💰 Precio más bajo: ${precioMinimo}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Precios por supermercado</h2>
        {precios.length === 0 ? (
          <p className="text-gray-500">No hay precios registrados</p>
        ) : (
          <table>
            <thead>
              <tr><th className="py-2">Supermercado</th><th className="py-2">Precio</th></tr>
            </thead>
            <tbody>
              {precios.map((p) => (
                <tr key={p.ID_PRECIO} className="border-t">
                  <td className="py-3">{p.NOMBRE_SUPERMERCADO}</td>
                  <td className="py-3 font-semibold text-blue-600">${p.PRECIO}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}