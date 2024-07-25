import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  const { getOrders,orders } = useQuisco();

  useEffect(() => {
      getOrders();
  }, []);

  console.log("El valor de orders en Orders es de ", orders);

  return (
    <>
      <h1 className="text-4xl font-black">Órdenes</h1>
      <p className="text-2xl my-10">Administra las órdenes desde aquí</p>

      <div className="mt-8 p-4 shadow-2xl rounded-lg md:m-5">
        <div className="bg-white p-4 rounded-md mt-4">
          <div className="text-4xl text-gray-500 font-black pb-4">Órdenes en la Base de Datos</div>
          <div className="my-1"></div> 
          <div className="bg-gradient-to-r from-slate-400 to-cyan-500 h-px mb-6"></div> 

          {/* Lista de órdenes */}
          <div className="flex flex-col">
            {Array.isArray(orders) &&
              orders.map((order) => (
                
                <div key={order.id} className="flex flex-nowrap items-center justify-between bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white mb-4 rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center w-full">
                      Total de productos: {order.total}
                    
                    <p className="hidden md:block">Código de pedido: {order.code}</p>
                  </div>
                  <Link to={`/admin/detailsOrder`} state={{ orderD: order }} className="bg-white hover:bg-slate-400 text-gray-800 hover:text-white border border-gray-400 hover:border-transparent rounded-md py-1 px-2 mr-2">
                  Detalles Orden
                  </Link>
                  <button onClick={() => handleDelete(order.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md">
                    Borrar Orden
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}