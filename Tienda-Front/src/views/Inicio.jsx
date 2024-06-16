import React from 'react';
import Producto from '../components/Producto';
import useQuisco from '../hooks/useQuiosco';

export default function Inicio() {
  const { producto,  imgProduct, idImgProduct } = useQuisco();

  return (
    <>

      <h1 className="text-4xl font-black">Título de la Página</h1>
      <p className="text-2xl my-10">Elige y personaliza</p>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {producto.map((producto) => {
          if (producto.novelty === 1) {
            // Encontrar imgProduct correspondiente al producto actual
            const imgProductForProducto = imgProduct.find((imgP) => imgP.producto_id === producto.id);

            // Verificar si imgProductForProducto está definido antes de construir la clave
            const key = imgProductForProducto ? `${producto.id}_${imgProductForProducto.img_id}` : '';

            // Verificar si la imagen relacionada existe en idImgProduct
            const imgRelacionada = key && idImgProduct[key];

            return <Producto key={producto.id} producto={producto} img={imgRelacionada} />;
          }
          return null;
        })}
      </div>
    </>
  );
}
