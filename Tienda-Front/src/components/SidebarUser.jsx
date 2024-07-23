import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SidebarUser({ userIconRef, showLogoutButton }) {
  const { logout } = useAuth({ middleware: 'auth' });
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (userIconRef.current) {
      const rect = userIconRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, left: rect.left });
    }
  }, [userIconRef]);

  return (
    <div
      className={`absolute z-20 bg-white md:w-56 shadow-md right-32 font-playfair transition-transform duration-300 ${
        showLogoutButton ? 'slide-down' : 'slide-up'
      }`}
    >
      <div>
        <div className="py-4 text-gray-600 hover:bg-slate-600 hover:text-white">
          <Link to="/auth/login" className="flex items-center justify-center w-full h-full">
            <p className="cursor-pointer font-bold truncate">Iniciar sesión</p>
          </Link>
        </div>
        <div className="py-4 text-gray-600 hover:bg-slate-600 hover:text-white">
          <Link to="/auth/register" className="flex items-center justify-center w-full h-full">
            <p className="cursor-pointer font-bold truncate">Registrarse</p>
          </Link>
        </div>
        <div className="py-4 text-gray-600 hover:bg-slate-600 hover:text-white">
          <Link to="/user" className="flex items-center justify-center w-full h-full">
            <p className="cursor-pointer font-bold truncate">Revisar perfil</p>
          </Link>
        </div>
        <div className="py-4 text-gray-600 hover:bg-red-700 hover:text-white">
          <div className="flex items-center justify-center w-full h-full">
            <p className="cursor-pointer font-bold truncate" onClick={logout}>Cerrar Sesión</p>
          </div>
        </div>
      </div>
    </div>
  );
}
