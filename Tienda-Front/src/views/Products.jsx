import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const { obtenProducts,productAll } = useQuisco();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const indexOfLastOrder = currentPage * productsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - productsPerPage;
  const currentProducts = productAll.slice(indexOfFirstOrder, indexOfLastOrder);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  useEffect(() => {
      obtenProducts();
  }, []);
    
  const { deleteProduct } = useAuth({
    middleware: 'auth',
    url: '/'
  });
  const [errores, setErrores] = useState([]);

  const handleDelete = async (prodId) => {
    try {
      await deleteProduct(prodId, setErrores);
    } catch (error) {
      setErrores([error.message]);
    }
  };

  return (
    <>
      <div className="mt-8  p-4 shadow-2xl rounded-lg md:m-5">
        <div className="bg-white p-4 rounded-md mt-4">
          <h2 className="text-4xl text-gray-500 font-black pb-4">Productos en la Base de Datos</h2>
          <div className="my-1"></div> {/* Espacio de separación */}
          <div className="bg-gradient-to-r from-slate-400 to-cyan-500 h-px mb-6"></div> {/* Línea con gradiente */}
          
          {/* Tabla de encabezados */}
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-sm leading-normal">
                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light w-1/4">Código</th>
                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light w-1/4">Nombre</th>
                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light w-1/4">Precio</th>
                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light w-1/4 ">Acciones</th>
              </tr>
            </thead>
            
            {/* Lista de productos */}
            <tbody>
              {currentProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-grey-lighter">
                <td className="py-2 px-4 border-b border-grey-light text-center">{prod.product_code}</td>
                  <td className="py-2 px-4 border-b border-grey-light text-center">{prod.name}</td>
                  <td className="py-2 px-4 border-b border-grey-light text-center">${prod.price}</td>
                  <td className="py-2 px-4 border-b border-grey-light text-center">
                  <div className="flex justify-center items-center">
                    <Link to={`/admin/detailsProduct`} state={{ product: prod }} className="bg-white hover:bg-slate-400 text-gray-800 hover:text-white border border-gray-400 hover:border-transparent rounded-md py-1 px-2 mr-2">
                      Detalles
                    </Link>
                    <button onClick={() => handleDelete(prod.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md">
                      Borrar
                    </button>
                  </div>
                </td>
                
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Paginacion */}
          <div className="text-right mt-4">
            <div className="flex justify-center my-6">
              {Array.from({ length: Math.ceil(productAll.length / productsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-2 px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
