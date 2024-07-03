import {Outlet} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';
import {useEffect} from 'react'
import AdminSidebar from '../components/AdminSidebar';
import UsuariosCRUD from '../views/AdminUsers';
import useQuisco from '../hooks/useQuiosco';
import {useNavigate} from 'react-router-dom'


export default function AdminLayout() {

    useAuth({middleware: 'admin'});
    const { user,obtenProducts, getUsers, getOrders, getPhone } = useQuisco();
    const navigate = useNavigate();

    useEffect(() => {

      if (!user || user.length === 0) {
        navigate('/auth/ini');
      }else{
        obtenProducts();
        getUsers();
        getOrders();
        getPhone();

      }
    });
      


  return (
    <div className="md:flex">
        <AdminSidebar />

        <main className="flex-1 h-screen overflow-y-scroll p-3">
        <Outlet />
        </main>
    </div>
  )
}
