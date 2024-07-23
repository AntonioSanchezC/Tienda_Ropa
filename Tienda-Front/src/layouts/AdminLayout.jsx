import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminSidebar from '../components/AdminSidebar';
import { ToastContainer } from 'react-toastify';

export default function AdminLayout() {
  useAuth({ middleware: 'admin' });

  return (
    <div className="md:flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 p-3 overflow-y-auto">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
