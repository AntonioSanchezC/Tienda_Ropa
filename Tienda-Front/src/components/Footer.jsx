import React from 'react';
import { Link } from 'react-router-dom';
import UbiCenter from './UbiCenter';

export default function Footer() {
  const baseURL = import.meta.env.VITE_API_URL; 

  return (
    <footer className="bg-zinc-100 text-zinc-500 font-playfair p-12 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center text-center">
          {/* Sección de cuenta */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 px-2 text-left">
            <h5 className="font-bold mb-2">Mi cuenta</h5>
            <ul className="list-none">
              <li className="mb-2">
                <Link to="/" className="text-zinc-500 hover:text-zinc-700 hover:underline">Iniciar sesión</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-zinc-500 hover:text-zinc-700 hover:underline">Registrarme</Link>
              </li>
              <li className="mb-2">
                <Link to="/aboutUs" className="text-zinc-500 hover:text-zinc-700 hover:underline">Direcciones de envío</Link>
              </li>
              <li className="mb-2">
                <Link to="/aboutUs" className="text-zinc-500 hover:text-zinc-700 hover:underline">Historial de pedidos</Link>
              </li>
            </ul>
          </div>

          {/* Sección de enlaces */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 px-2 text-left">
            <h5 className="font-bold mb-2">Empresa</h5>
            <ul className="list-none">
              <li className="mb-2">
                <Link to="/" className="text-zinc-500 hover:text-zinc-700 hover:underline">Quienes somos</Link>
              </li>
              <li className="mb-2">
                <Link to="/auth/contactUs" className="text-zinc-500 hover:text-zinc-700 hover:underline">Contáctanos</Link>
              </li>
              <li className="mb-2">
                <Link to="/aboutUs" className="text-zinc-500 hover:text-zinc-700 hover:underline">Acerca de nosotros</Link>
              </li>
            </ul>
          </div>

          {/* Sección de métodos de pago */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 px-2 text-center">
            <h5 className="font-bold mb-2">Métodos de pagos</h5>
            <ul className="list-none">
              <li className="mb-2">
                <img src={`${baseURL}/icon/modoSeguro.png`} alt="modo seguro icon" className=" w-12 h-12 mx-auto" />
              </li>
              <li className="mb-2">
                <img src={`${baseURL}/icon/paypal.png`} alt="paypal icon" className=" w-20 h-12 mx-auto" />
              </li>
            </ul>
          </div>

          {/* Sección de información legal */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 px-2 text-left">
            <h5 className="font-bold mb-2">Legal</h5>
            <ul className="list-none">
              <li className="mb-2">
                <Link to="/terms" className="text-zinc-500 hover:text-zinc-700 hover:underline">Términos y condiciones</Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-zinc-500 hover:text-zinc-700 hover:underline">Política de privacidad</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center mt-12 text-left z-10">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 px-4 text-center z-10">
            <h5 className="font-bold mb-2 text-xl">Nuestra ubicación</h5>
            <UbiCenter />
          </div>
          <div className="w-full md:w-1/2 mb-6 md:mb-0 px-4">
            <h5 className="font-bold mb-2 text-xl md:mb-7">Dirección</h5>
            <p className="text-zinc-600 text-lg md:mb-2">c\ Poeta Rafael Alberti, nº 8</p>
            <p className="text-zinc-600 text-lg md:mb-2">Puerto Santa María, España</p>
            <p className="text-zinc-600 text-lg md:mb-2">Teléfono: +34 956 24 31 28</p>
            <p className="text-zinc-600 text-lg">Email: www.ies-mardecadiz.com/</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
