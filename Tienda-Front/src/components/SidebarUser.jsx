import Sidebar from './Sidebar';
import { useAuth } from "../hooks/useAuth";
import { createRef, useState } from "react" 
import useQuisco from '../hooks/useQuiosco';
import Resumen from './Resumen';
import { Link } from 'react-router-dom';
export default function SidebarUser() {

    const { logout } = useAuth({ middleware: 'auth' }); 


    
    return (
        <div className="text-center absolute z-50 md:top-32 right-48 bg-white md:w-56 shadow-md">
            <div >

            <div className='py-4 text-gray-600  hover:bg-slate-600 hover:text-white'>
                <Link to="/auth/login" className=' '>
                    <p                 

                    className="  cursor-pointer w-full h-full font-bold  truncate "
                    >
                        Iniciar sesion
                    </p>
                </Link>
            </div>
            <div className='py-4 text-gray-600  hover:bg-slate-600 hover:text-white'>
                <Link to="/register">
                    <p 
                    className=" cursor-pointer w-full h-full font-bold  truncate "
                    >
                        Registrarse
                    </p>
                </Link>
            </div>
            <div className='py-4 text-gray-600  hover:bg-slate-600 hover:text-white'>
                <Link to="/user">
                    <p 
                    className="  cursor-pointer w-full h-full font-bold  truncate "
                    >
                        Revisar perfil
                    </p>
                </Link>
            </div>
            <div className='py-4 text-gray-600  hover:bg-red-700 hover:text-white'>
                <p
                className="   cursor-pointer w-full h-full font-bold  truncate "
                onClick={logout}
                >
                    Cerrar Sesión
                </p>
            </div>

            </div>
    
          </div>
      );
    
    
}
