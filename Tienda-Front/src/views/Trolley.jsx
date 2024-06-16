import { formatearDinero } from "../helpers";
import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import TrolleyProducts from "../components/TrolleyProducts";
import { useState } from "react";
import { Link } from "react-router-dom";
import TrolleyList from "../components/TrolleyList";

export default function Trolley() {
  const { order, total, handleSubmitNewOrder, arrivals } = useQuisco();
  console.log("El valor de total en Trolley es ", total);
  console.log("El valor de order en Trolley es ", order);
  const [selectedArrival, setSelectedArrival] = useState("");

  const handleArrivalChange = (e) => {
    setSelectedArrival(e.target.value);
  };

  const { logout } = useAuth({});
  const checkOrder = () => order.length === 0;
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitNewOrder(selectedArrival);
  };

  return (
    <aside className="h-screen overflow-y-scroll p-5 mx-auto md:top-32 right-0">
      <h1 className="text-4xl font-black">Bolsa de la compra</h1>
      <p className="text-lg my-5">Aquí podrá ver el resumen y totales</p>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-4 p-5">
          <div className="py-10 ">
            {order.length === 0 ? (
                <p className="text-center text-2xl">No hay elemento de tu pedido aún</p>
            ) : (
              order.map((product) => (
                <TrolleyProducts key={product.id} product={product} />
              ))
            )}
          </div>


        </div>

        <div className="md:w-1/2 md:pl-4">
          <form className="w-full bg-zinc-200 shadow-md rounded p-8" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center mb-6">Lista de Precios</h1>
          <div  className=" p-16">
            {order.length === 0 ? (
              <p className="text-center text-2xl">No hay elemento de tu pedido aún</p>
            ) : (
              order.map((product) => (
                <TrolleyList key={product.id} product={product} />
              ))
            )}
            <p className="text-xl mt-10 text-right">
              Total: <span className="font-bold">{formatearDinero(total)}</span>
            </p>
          </div>
          <div className="mt-5 text-center">
            <Link to="/checkout">
              <button className="bg-zinc-600 hover:bg-zinc-800 px-5 py-2 rounded uppercase font-bold text-white w-full md:w-1/2 md:mx-auto">
                Proceder al Pago
              </button>
            </Link>
          </div>
        </form>
        </div>

      </div>
    </aside>
  );
}
