import { useState, useEffect } from "react";
import useQuisco from "../hooks/useQuiosco";
import { formatearDinero } from "../helpers";
import clienteAxios from "../config/axios";

export default function ModalProducto() {
  const { product, handleClickModal, handleAgregarPedido, order, handleClickModalActivated } = useQuisco();
  console.log("El valor de product en el modal es ", product);
  const [quantity, setQuantity] = useState(1);
  const [edition, setEdition] = useState(false);

  useEffect(() => {
    if (order.some(pedidoState => pedidoState.id === product.id)) {
      const productEdicion = order.filter(pedidoState => pedidoState.id === product.id)[0];
      setQuantity(productEdicion.quantity);
      setEdition(true);
    }
  }, [order, product.id]);

  const imageProduct = product.imgs && product.imgs.length > 0 ? `${clienteAxios.defaults.baseURL}/${product.imgs[0].image}` : null;

  return (
    <div className=" md:flex gap-10 p-5 max-w-3xl mx-auto bg-white rounded-lg shadow-lg z-50">
      <div className="md:w-1/3">
        <img 
          alt={`Imagen producto ${product.name}`}
          src={imageProduct || `${clienteAxios.defaults.baseURL}/img/${product.imagen}`}
          className="w-full h-48 md:h-64 object-cover rounded"
        />
      </div>
      
      <div className="md:w-2/3">
        <div className="flex justify-end">
          <button onClick={() => {
                handleClickModal();

                handleClickModalActivated();

          }}
          
          

          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h1 className="text-3xl font-bold mt-5">
          {product.name}
        </h1>

        <p className="mt-5 font-black text-5xl text-amber-500">
          {formatearDinero(product.price)}
        </p>

        <div className="flex gap-4 mt-5">
          <button
            type="button"
            onClick={() => {
              if (quantity <= 1) return;
              setQuantity(quantity - 1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <p className="text-3xl">{quantity}</p>

          <button
            type="button"
            onClick={() => {
              if (quantity >= 5) return;
              setQuantity(quantity + 1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-800 px-5 py-2 mt-5 text-white font-bold uppercase rounded"
          onClick={() => {
            handleAgregarPedido({ ...product, quantity });
            handleClickModal();
            handleClickModalActivated();
          }}
        >
          {edition ? 'Guardar Cambios' : 'Añadir al Pedido'}
        </button>
      </div>
    </div>
  );
}
