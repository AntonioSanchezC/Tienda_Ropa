import { Link } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'



export default function AdminSidebar() {
  const {logout} = useAuth({middleware: 'auth'});

  return (
    <aside className="md:w-72 h-screen">


        <nav className='flex flex-col p-4'>
            <Link to="/admin/Orders" className='font-bold text-lg'>Ordenes</Link>
            <Link to="/admin/products" className='font-bold text-lg'>Productos</Link>
            <Link to="/admin/users" className='font-bold text-lg'>Usuarios</Link>
            <Link to="/admin/insertproduct" className='font-bold text-lg'>Insertar Producto</Link>
            <Link to="/admin/promotion" className='font-bold text-lg'>Insertar Promocion</Link>
            <Link to="/admin/promoProduct" className='font-bold text-lg'>Enlazar Promocion</Link>
        </nav>

        <div>
            <button
                type="button"
                className='text-center bg-red-500 w-full p-3 font-bold text-white truncate'
                onClick={logout}
            
            >
                Cerrar Sesión
            </button>
        </div>
    </aside>
  )
}
