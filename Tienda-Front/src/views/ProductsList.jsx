import React, { useEffect } from 'react';
import Product from '../components/Product';
import useQuiosco from '../hooks/useQuiosco';

export default function ProductsList() {
    const { imgProduct, idImgProduct, filteredProducts } = useQuiosco();

    useEffect(() => {
        console.log('Filtered Products:', filteredProducts);
        console.log('Image Product:', imgProduct);
        console.log('ID Image Product:', idImgProduct);
    }, [filteredProducts, imgProduct, idImgProduct]);

    if (filteredProducts.length === 0) {
        return <p className="text-zinc-300">No se encontraron productos.</p>;
    }

    return (
        <>
            <h1 className="text-4xl text-zinc-400 md:m-8">Producto Buscado</h1>
            <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </>
    );
}
