import { formatearDinero } from "../helpers";
import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import ResumenProducto from "./ResumenProducto";
import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Resumen() {
  const { cartState, setCartState, order, total, handleSubmitNewOrder, arrivals } = useQuisco();
  const [selectedArrival, setSelectedArrival] = useState("");

  const handleArrivalChange = (e) => {
    setSelectedArrival(e.target.value);
  }

  console.log("El valor de arrivals en Resumen es ", arrivals);
  const { logout } = useAuth({})
  const checkOrder = () => order.length === 0;
  const handleSubmit = e => {
    e.preventDefault();
    handleSubmitNewOrder(selectedArrival);
  }

  const handleBadgeClick = (event) => {
    event.stopPropagation();
    setCartState((prevCartState) => !prevCartState);
  };

  return (
    <aside className="md:w-72 z-40 h-screen absolute overflow-y-scroll bg-gray-400 md:top-32 right-0 p-5 mx-auto">
      <h1 className="text-4xl font-black">
        Mi pedido
      </h1>
      <div
        className="absolute top-5 right-5 cursor-pointer bg-red-500 text-white rounded-full p-2"
        onClick={handleBadgeClick}
      >
        <span className="text-lg font-bold">X</span>
      </div>

      <p className="text-lg my-5">
        Aqui podra ver el resumen y totales
      </p>

      <div className="py-10">
        {order.length === 0 ? (
          <p className="text-center text-2xl">
            No hay elemento de tu pedido aun
          </p>
        ) : (
          order.map(product => (
            <ResumenProducto
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>

      <p className="text-xl mt-10">
        Total:{''}
        {formatearDinero(total)}
      </p>

      <form
        className="w-full"
        onSubmit={handleSubmit}
      >



        <Link to={`/trolley`}>
          <input
            type="submit"
            className= 'bg-indigo-600 hover:bg-indigo-800  px-5 py-2 rounded uppercase font-bold text-white text-center w-full cursor-pointer'
            value="Confirmar Pedido"
          />      
      </Link>
      </form>
    </aside>
  )
}
