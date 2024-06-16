import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  const { orders } = useQuisco();
  console.log("El valor de orders en Orders es ", orders);
  return (
    <>
        <h1 className="text-4xl font-black">Ordenes</h1>
        <p className="text-2xl my-10">
          Administra las ordenes desde aqui
        </p>
        <div className="flex flex-col ">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-nowrap mt-3">
         <Link to={`/admin/detailsOrder`}    state={{ orderD: order }}  className="flex flex-nowrap w-4/5 md:top-32  bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white">
          <p className="md:mr-3">Total de productos: {order.total}</p>
          <p className="md:mr-3">Código de pedido: {order.code}</p>

          </Link>
              <button onClick={() => handleDelete(prod.id)} className="bg-red-500 hover:bg-red-700  text-white p-3">
                Borrar Orden
              </button>
          </div>
        ))}
      </div>
    </>
  )
}
