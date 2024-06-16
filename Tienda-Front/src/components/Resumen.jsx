import { formatearDinero } from "../helpers";
import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import ResumenProducto from "./ResumenProducto";
import { useState } from "react";



export default function Resumen() {

  const {order, total, handleSubmitNewOrder, arrivals} = useQuisco();
  const [selectedArrival, setSelectedArrival] = useState("");

  const handleArrivalChange = (e) => {
    setSelectedArrival(e.target.value);
  }

  console.log("El valor de arrivals en Resumen es ", arrivals);
  const {logout} = useAuth({})
  const checkOrder = () => order.length === 0;
  const handleSubmit = e => {
    e.preventDefault();
    handleSubmitNewOrder(selectedArrival);
  }

  return (
    <aside className="md:w-72 z-40 h-screen absolute overflow-y-scroll bg-indigo-100 md:top-32 right-0 p-5 mx-auto">
    <h1 className="text-4xl font-black">
        Mi pedido
      </h1>
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

      <select
      id="arrival"
      className="mt-2 w-full p-3 bg-gray-50"
      name="arrival"
      htmlFor="arrival"
      value={selectedArrival} 
      onChange={handleArrivalChange} 
    >
      <option value="" disabled selected >
        Seleccione el punto de entrega
      </option>


        {arrivals.map(arrival => (
          
          <option 
            key={arrival.id} 
            value={arrival.id}

          >
            {arrival.address}
          </option>
        ))}
    </select>



          <div className="mt-5">
            <input
              type="submit"
              className={`${checkOrder() ? 'bg-indigo-100' : ' bg-indigo-600 hover:bg-indigo-800 '}px-5 py-2 rounded uppercase font-bold text-white text-center w-full cursor-pointer`}
              value="Confirmar Pedido"
              disabled={checkOrder()}
            />
          </div>
      </form>
    </aside>
  )
}
