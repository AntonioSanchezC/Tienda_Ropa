import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

export default function AdminSidebar() {
  const { logout } = useAuth({ middleware: 'auth' });

  return (
    <aside className="md:w-72 h-screen overflow-y-scroll p-2 shadow-2xl rounded-lg md:m-5">
      <nav className="flex flex-col">
        <Link 
          to="/admin/Orders" 
          className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-slate-500 hover:to-cyan-500 hover:text-white"
        >
          <i className="fas fa-home mr-2"></i>Ordenes
        </Link>
        <Link 
          to="/admin/products" 
          className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-slate-500 hover:to-cyan-500 hover:text-white"
        >
          <i className="fas fa-file-alt mr-2"></i>Productos
        </Link>
        <Link 
          to="/admin/users" 
          className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-slate-500 hover:to-cyan-500 hover:text-white"
        >
          <i className="fas fa-users mr-2"></i>Usuarios
        </Link>
        <Link 
          to="/admin/insertproduct" 
          className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-slate-500 hover:to-cyan-500 hover:text-white"
        >
          <i className="fas fa-store mr-2"></i>Insertar Producto
        </Link>
        <Link 
          to="/admin/promotion" 
          className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-slate-500 hover:to-cyan-500 hover:text-white"
        >
          <i className="fas fa-tags mr-2"></i>Insertar Promocion
        </Link>
        <Link 
          to="/admin/promoProduct" 
          className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-slate-500 hover:to-cyan-500 hover:text-white"
        >
          <i className="fas fa-exchange-alt mr-2"></i>Enlazar Promocion
        </Link>
      </nav>
      <div>
        <button
          type="button"
          className="block text-red-500 w-full py-2.5 px-4 my-2 rounded truncate transition duration-200 hover:bg-gradient-to-r hover:from-red-500 hover:to-slate-400 hover:text-white"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
