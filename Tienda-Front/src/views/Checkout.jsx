import React, { useState } from "react";
import useQuiosco from "../hooks/useQuiosco";
import { formatearDinero } from "../helpers";
import Alerta from "../components/Alerta";

export default function Checkout() {
  const { order, total, arrivals, handleSubmitNewOrder, user } = useQuiosco();
  const [selectedArrival, setSelectedArrival] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [errores, setErrores] = useState([]);

  const handleArrivalChange = (e) => setSelectedArrival(e.target.value);
  const handleCardNumberChange = (e) => setCardNumber(e.target.value);
  const handleCardExpiryChange = (e) => setCardExpiry(e.target.value);
  const handleCardCVCChange = (e) => setCardCVC(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear el objeto orderData
    const orderData = {
      total,
      arrivalId: selectedArrival,
      products: order.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        name: product.name
      })),
      cardNumber,
      cardExpiry,
      cardCVC
    };

    // Llamar a la función handleSubmitNewOrder con orderData
    handleSubmitNewOrder(orderData, setErrores);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-black">Finalizar Compra</h1>
      <p className="text-lg my-5">Revise su pedido y complete sus datos de pago</p>

      <div className="flex">
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold">Resumen del Pedido</h2>
          <div className="bg-white shadow rounded-lg p-4">
            {order.length === 0 ? (
              <p className="text-center text-2xl">No hay elementos en tu pedido aún</p>
            ) : (
              order.map((product) => (
                <div key={product.id} className="mb-4">
                  <p className="text-4xl">{product.name}</p>
                  <p className="text-lg">Cantidad: {product.quantity}</p>
                  <p className="text-lg text-amber-500">Precio: {formatearDinero(product.price)}</p>
                </div>
              ))
            )}
            <p className="text-xl mt-10">Total de precio: {formatearDinero(total)}</p>
          </div>
        </div>

        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold">Detalles de Pago</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4" noValidate>
            {errores.length > 0 && errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}
            <div className="mb-4">
              <label htmlFor="arrival" className="block text-lg font-medium text-gray-700">Punto de Entrega</label>
              <select
                id="arrival"
                className="mt-2 w-full p-3 bg-gray-50"
                name="arrival"
                value={selectedArrival}
                onChange={handleArrivalChange}
              >
                <option value="" disabled>Seleccione el punto de entrega</option>
                {arrivals.map((arrival) => (
                  <option key={arrival.id} value={arrival.id}>{arrival.address}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-lg font-medium text-gray-700">Número de Tarjeta</label>
              <input
                type="text"
                id="cardNumber"
                className="mt-2 w-full p-3 bg-gray-50"
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="cardExpiry" className="block text-lg font-medium text-gray-700">Fecha de Expiración</label>
              <input
                type="text"
                id="cardExpiry"
                className="mt-2 w-full p-3 bg-gray-50"
                value={cardExpiry}
                onChange={handleCardExpiryChange}
                placeholder="MM/YY"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="cardCVC" className="block text-lg font-medium text-gray-700">CVC</label>
              <input
                type="text"
                id="cardCVC"
                className="mt-2 w-full p-3 bg-gray-50"
                value={cardCVC}
                onChange={handleCardCVCChange}
              />
            </div>

            {user && user.email_verified_at ? (
              <div className="mt-5">
                <input
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  value="Confirmar Pedido"
                  disabled={order.length === 0}
                />
              </div>
            ) : (
              <p className="text-red-500 mt-5">Inicie sesión y verifique su correo para confirmar el pedido.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
