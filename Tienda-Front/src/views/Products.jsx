import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const { product } = useQuisco();

  const [errores, setErrores] = useState([]);
  const { deleteProduct } = useAuth({
    middleware: 'auth',
    url: '/'
  });

  const handleDelete = async(prodId) => {
    try {
      await deleteProduct(prodId, setErrores);
    } catch (error) {
      setErrores([error.message]);
    }
  }

  return (
    <>
      <h1  className="text-4xl font-black">Productos en la Base de Datos</h1>
      <div className="flex flex-col ">
        {product.map((prod) => (
          <div key={prod.id} className="flex flex-nowrap mt-3">
         <Link to={`/admin/detailsProduct`}   state={{ product: prod }} className="flex flex-nowrap w-4/5 md:top-32  bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white">
          <p className="md:mr-3">{prod.name}</p>
            <p>{prod.code}</p>
            <p>Precio: {prod.price}</p>
          </Link>
              <button onClick={() => handleDelete(prod.id)} className="bg-red-500 hover:bg-red-700  text-white p-3">
                Borrar producto
              </button>
          </div>
        ))}
      </div>
    </>
  );
}
