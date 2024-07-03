import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SidebarUser({ userIconRef }) {
  const { logout } = useAuth({ middleware: 'auth' });
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (userIconRef.current) {
      const rect = userIconRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, left: rect.left });
    }
  }, [userIconRef]);

  return (
    <div className="absolute z-50 bg-white md:w-56 shadow-md right-16" >
      <div>
        <div className='py-4 text-gray-600 hover:bg-slate-600 hover:text-white'>
          <Link to="/login" className=' '>
            <p className="cursor-pointer w-full h-full font-bold truncate">Iniciar sesion</p>
          </Link>
        </div>
        <div className='py-4 text-gray-600 hover:bg-slate-600 hover:text-white'>
          <Link to="/register">
            <p className="cursor-pointer w-full h-full font-bold truncate">Registrarse</p>
          </Link>
        </div>
        <div className='py-4 text-gray-600 hover:bg-slate-600 hover:text-white'>
          <Link to="/user">
            <p className="cursor-pointer w-full h-full font-bold truncate">Revisar perfil</p>
          </Link>
        </div>
        <div className='py-4 text-gray-600 hover:bg-red-700 hover:text-white'>
          <p className="cursor-pointer w-full h-full font-bold truncate" onClick={logout}>Cerrar Sesión</p>
        </div>
      </div>
    </div>
  );
}
