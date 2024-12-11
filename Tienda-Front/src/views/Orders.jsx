import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  const { getOrders,orders } = useQuisco();
  const [currentPage, setCurrentPage] = useState(1);

  const OrdersPerPage = 8;


  const indexOfLastOrder = currentPage * OrdersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - OrdersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
      getOrders();
  }, []);


  return (
    <>
      <div className="mt-8 p-4 shadow-2xl rounded-lg md:m-5">
        <div className="bg-white p-4 rounded-md mt-4">
          <div className="text-4xl text-gray-500 font-black pb-4">Órdenes en la Base de Datos</div>
          <div className="my-1"></div> 
          <div className="bg-gradient-to-r from-slate-400 to-cyan-500 h-px mb-6"></div> 

          {/* Lista de órdenes */}
          <div className="flex flex-col">
            {
              currentOrders.map((order) => (
                
                <div key={order.id} className="flex flex-nowrap items-center justify-between bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white mb-4 rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center w-full">
                      Total de productos: {order.total}
                    
                    <p className="hidden md:block">Código de pedido: {order.code}</p>
                  </div>
                  <Link to={`/admin/detailsOrder`} state={{ orderD: order }} className="bg-white hover:bg-slate-400 text-gray-800 hover:text-white border border-gray-400 hover:border-transparent rounded-md py-1 px-2 mr-2">
                  Detalles
                  </Link>
                  <button onClick={() => handleDelete(order.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md">
                    Borrar
                  </button>
                </div>
              ))}
          </div>
        </div>
            {/* Paginacion */}
            <div className="text-right mt-4">
            <div className="flex justify-center my-6">
              {Array.from({ length: Math.ceil(orders.length / OrdersPerPage) }, (_, index) => (
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
    </>
  );
}