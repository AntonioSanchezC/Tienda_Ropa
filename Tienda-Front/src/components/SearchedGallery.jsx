import React from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';
import useQuisco from '../hooks/useQuiosco';

export default function SearchedGallery() {
  const { product, imgProduct, idImgProduct } = useQuisco();

  if (!product || product.length === 0) {
    return <div>No hay products disponibles.</div>;
  }

  // Ordenar los products por el campo "searched" de forma descendente
  product.sort((a, b) => b.searched - a.searched);

  // Obtener el product con el campo "searched" más alto y los otros cuatro products
  const [mainProduct, ...otherProducts] = product.slice(0, 5);

  // Función para obtener la imagen relacionada con el product
  const getImageForProduct = (prod) => {
    const imgProductForProduct = imgProduct.find((imgP) => imgP.product_id === prod.id);
    const key = imgProductForProduct ? `${prod.id}_${imgProductForProduct.img_id}` : '';
    const imgRelated = key && idImgProduct[key];
    return imgRelated && imgRelated.image ? `${clienteAxios.defaults.baseURL}/${imgRelated.image}` : null;
  };

  return (
    <div className="flex flex-row md:mt-6 md:mb-20">
        {/* Imagen grande a la izquierda */}
        <div className="basis-1/2 mr-4 p-5">
          <h1 className='text-2xl ml-4 text-slate-400'>Más buscados</h1>
          <p className="text-slate-400 mb-0 ml-8">{mainProduct.name}</p>
          <Link to={`/details`} state={{ product: mainProduct, imageProduct: getImageForProduct(mainProduct) }} className="mt-0">
            {getImageForProduct(mainProduct) && <img src={getImageForProduct(mainProduct)} alt={mainProduct.name} className="w-full h-full  mb-2 py-8" />}
          </Link>
        </div>

      {/* Cuatro imágenes pequeñas en dos columnas */}
      <div className="flex flex-wrap w-1/2 justify-between md:mt-24 md:pb-6 md:px-5">
        {otherProducts.map((product, index) => (
          <div key={index} className="w-1/2 h-1/2 md:mt-3">
            <Link to={`/details`} state={{ product: product, imageProduct: getImageForProduct(product) }}>
              {getImageForProduct(product) && <img src={getImageForProduct(product)} alt={product.name} className="w-full h-full md:px-2" />}
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}
