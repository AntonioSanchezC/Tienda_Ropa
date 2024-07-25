import React, { useState, useEffect } from "react";
import useQuiosco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { formatearDinero } from "../helpers";
import PayPalPayment from "../components/PayPalPayment";
import Alerta from "../components/Alerta";

export default function Checkout() {
  const { order, total, getArrivals, arrivals, handleSubmitNewOrder } = useQuiosco();
  useEffect(() => {
    getArrivals();
  }, []);
  const { user } = useAuth({ middleware: 'auth' }); 

  const [arrivalId, setarrivalId] = useState();
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [errores, setErrores] = useState([]);

  const handleArrivalChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    setarrivalId(selectedValue);
  };

  const handleCardNumberChange = (e) => setCardNumber(e.target.value);
  const handleCardExpiryChange = (e) => setCardExpiry(e.target.value);
  const handleCardCVCChange = (e) => setCardCVC(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      total,
      arrivalId: arrivalId,
      products: order.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        name: product.name,
        price: product.price,
        color: product.selectedColor,
        size: product.selectedSize,
        product_code: product.product_code,
      })),
      cardNumber,
      cardExpiry,
      cardCVC
    };
    handleSubmitNewOrder(orderData, setErrores);
  };

  return (
    <div className="container mx-auto p-12 font-playfair">
      <h1 className="text-4xl font-black">Finalizar Compra</h1>
      <p className="text-lg my-5">Revise su pedido y complete sus datos de pago</p>

      <div className="flex">
        <div className="w-full md:w-1/2 p-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Resumen del Pedido</h2>
          <div className="bg-gray-200 shadow-md border-solid border-2 border-gray-700 rounded-lg p-6">
            {order.length === 0 ? (
              <p className="text-center text-xl">No hay elementos en tu pedido aún</p>
            ) : (
              <>
                <table className="w-full text-left mb-4">
                  <thead>
                    <tr>
                      <th className="border-b-2 border-gray-400 py-2">Producto</th>
                      <th className="border-b-2 border-gray-400 py-2">Cantidad</th>
                      <th className="border-b-2 border-gray-400 py-2">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200">
                        <td className="py-2 text-lg">{product.name}</td>
                        <td className="py-2 text-lg">{product.quantity}</td>
                        <td className="py-2 text-lg text-blue-500">{formatearDinero(product.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right mt-4">
                  <p className="text-xl font-semibold">Total: <span className="text-blue-500">{formatearDinero(total)}</span></p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="md:w-1/2 mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-200 shadow-md border-solid border-2 border-gray-700 rounded-lg p-8 md:p-12" noValidate>
            <h2 className="text-2xl font-bold mb-6 text-center">Detalles de Pago</h2>
            {errores.length > 0 && errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}

            <div className="mb-4 flex items-center">
              <label htmlFor="arrivalId" className="w-1/3 text-lg font-medium text-gray-700">Punto de Entrega</label>
              <select
                id="arrivalId"
                name="arrivalId"
                className="w-2/3 bg-gray-100 h-12 p-3 border-b-2 border-gray-400 focus:border-blue-500 outline-none"
                value={arrivalId}
                onChange={handleArrivalChange}
                autoComplete="off"
              >
                <option value="">Seleccione el punto de entrega</option>
                {arrivals.map((arrival) => (
                  <option key={arrival.id} value={arrival.id}>{arrival.address}</option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex items-center">
              <label htmlFor="cardNumber" className="w-1/3 text-lg font-medium text-gray-700">Número de Tarjeta</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                autoComplete="cc-number"
                className="w-2/3 bg-gray-100 h-12 p-3 border-b-2 border-gray-400 focus:border-blue-500 outline-none"
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label htmlFor="cardExpiry" className="w-1/3 text-lg font-medium text-gray-700">Fecha de Expiración</label>
              <input
                type="text"
                id="cardExpiry"
                name="cardExpiry"
                autoComplete="cc-exp"
                className="w-2/3 bg-gray-100 h-12 p-3 border-b-2 border-gray-400 focus:border-blue-500 outline-none"
                value={cardExpiry}
                onChange={handleCardExpiryChange}
                placeholder="MM/YY"
              />
            </div>

            <div className="mb-4 flex items-center">
              <label htmlFor="cardCVC" className="w-1/3 text-lg font-medium text-gray-700">CVC</label>
              <input
                type="text"
                id="cardCVC"
                name="cardCVC"
                autoComplete="cc-csc"
                className="w-2/3 bg-gray-100 h-12 p-3 border-b-2 border-gray-400 focus:border-blue-500 outline-none"
                value={cardCVC}
                onChange={handleCardCVCChange}
              />
            </div>

            {user && user.email_verified_at ? (
              <div className="mt-5 text-center">
                <input
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded cursor-pointer mb-8"
                  value="Confirmar Pedido"
                  disabled={order.length === 0}
                />
                <PayPalPayment 
                  orderData={{ 
                    total, 
                    arrivalId,
                    products: order.map((product) => ({
                      id: product.id,
                      quantity: product.quantity,
                      name: product.name,
                      price: product.price,
                      color: product.selectedColor,
                      size: product.selectedSize,
                      product_code: product.product_code,
                    })),
                  }} 
                />
              </div>
            ) : (
              <p className="text-red-500 mt-5 text-center">Inicie sesión y verifique su correo para confirmar el pedido.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
