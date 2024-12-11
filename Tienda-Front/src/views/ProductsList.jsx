import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import useQuiosco from '../hooks/useQuiosco';
import clienteAxios from '../config/axios';

export default function ProductsList() {
    const { imgProduct, idImgProduct,isCodeSearch,setIsCodeSearch,  filteredProducts } = useQuiosco();

        const navigate = useNavigate();

        useEffect(() => {
            if (isCodeSearch && filteredProducts.length > 0) {
                const singleProduct = filteredProducts[0];
                const imgProductForProducto = imgProduct.find((imgP) => imgP.product_id === singleProduct.id);
                const key = imgProductForProducto ? `${singleProduct.id}_${imgProductForProducto.img_id}` : `${singleProduct.id}`;
                const imgRelated = idImgProduct[key] || null;
                const imageProductUrl = imgRelated ? `${clienteAxios.defaults.baseURL}/${imgRelated.image}` : null;
        
                navigate('/details', {
                    state: {
                        product: singleProduct,
                        imageProduct: imageProductUrl,
                    },
                });
        
                setIsCodeSearch(false); // Resetea después de redirigir
            }
        }, [filteredProducts, isCodeSearch, imgProduct, idImgProduct, navigate]);

    if (filteredProducts.length === 0) {
        return <p className="text-zinc-300">No se encontraron productos.</p>;
    }

    return (
        <div>
            <h1 className="text-4xl  md:m-8">Producto Buscado</h1>
            <div className="grid gap-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((prod) => {
                    const imgProductForProducto = imgProduct.find((imgP) => imgP.product_id === prod.id);
                    const key = imgProductForProducto ? `${prod.id}_${imgProductForProducto.img_id}` : `${prod.id}`;
                    const imgRelated = idImgProduct[key] || null;

                    if (imgRelated && prod) {
                        return <Product key={key} product={prod} img={imgRelated} />;
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    );
}
