import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuiosco from '../hooks/useQuiosco';
import { useAuth } from "../hooks/useAuth";
import clienteAxios from '../config/axios';

const UserInfo = ({ onShowOrders, showOrders }) => {
  const { loading, error, user, setUser } = useQuiosco();
  console.log("El valor de user es ", user);
  const { logout } = useAuth({ middleware: 'auth' }); 
   const navigate = useNavigate();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    gender: '',
    address: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        gender: user.gender || '',
        address: user.address || '',
        email: user.email || '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Redireccionar si el usuario es administrador
      if (user.admin === 1) {
        navigate('/admin/Orders');
      }
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!user) return;
    const token = localStorage.getItem('AUTH_TOKEN');
    try {
      const response = await clienteAxios.put(`/api/user/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Datos actualizados exitosamente');
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Hubo un problema al actualizar los datos');
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const token = localStorage.getItem('AUTH_TOKEN');
    try {
      await clienteAxios.put(`/api/user/${user.id}/password`, {
        password: formData.password,
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Contraseña actualizada exitosamente');
      setIsChangingPassword(false);
      setFormData({ ...formData, password: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Hubo un problema al cambiar la contraseña');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const token = localStorage.getItem('AUTH_TOKEN');
    try {
      await clienteAxios.delete(`/api/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Cuenta borrada exitosamente');
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Hubo un problema al borrar la cuenta');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full p-8">
      {user ? (
        <div className="flex space-x-4">
          <div className="w-1/2 shadow-lg p-5 pl-8 bg-slate-100">
            <h1 className="text-2xl font-bold mb-2">Hola</h1>
            <p className='md:mb-8'>{user.email}</p>
            <p className={`w-full font-bold truncate mt-4 cursor-pointer text-gray-500 hover:text-black`} onClick={onShowOrders}>
              {showOrders ? 'Ocultar Pedidos' : 'Mostrar Pedidos'}
            </p>
            <p className="text-gray-500 hover:text-black cursor-pointer w-full font-bold truncate mt-4" onClick={handleDeleteAccount}>
              Borrar cuenta
            </p>
            <p className="text-gray-500 hover:text-black cursor-pointer w-full font-bold truncate mt-4" onClick={() => setIsChangingPassword(!isChangingPassword)}>
              {isChangingPassword ? 'Cancelar Cambio de Contraseña' : 'Cambiar Contraseña'}
            </p>
            <p className="text-gray-500 hover:text-black cursor-pointer w-full font-bold truncate mt-4" onClick={logout}>
              Cerrar Sesión
            </p>
          </div>
          <div className="w-1/2 shadow-lg p-5 pl-8 bg-slate-100">
            <h1 className="text-2xl font-bold mb-4">Datos del Usuario</h1>
            <div className="space-y-2">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-gray-700">Nombre:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700">Apellido:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700">Dirección:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700">Género:</label>
                    <div className="flex space-x-4">
                      <label className="block text-gray-700">
                        <input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleInputChange} className="mr-2" />
                        Femenino
                      </label>
                      <label className="block text-gray-700">
                        <input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleInputChange} className="mr-2" />
                        Masculino
                      </label>
                    </div>
                  </div>
                  <button type="button" onClick={handleUpdateUser} className="mt-4 bg-green-500 text-white p-2 rounded">
                    Guardar Cambios
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="mt-4 ml-4 bg-gray-500 text-white p-2 rounded">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>Apellido:</strong> {user.lastName}</p>
                  <p><strong>Dirección:</strong> {user.address}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Género:</strong> {user.gender === 'F' ? 'Femenino' : 'Masculino'}</p>
                  <p><strong>Verificado:</strong> {user.email_verified_at ? 'Sí' : 'No'}</p>
                  <button type="button" onClick={() => setIsEditing(true)} className="mt-4 bg-blue-500 text-white p-2 rounded">
                    Editar
                  </button>
                </>
              )}
              {isChangingPassword && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">Cambiar Contraseña</h2>
                  <div>
                    <label className="block text-gray-700">Contraseña Actual:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700">Nueva Contraseña:</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700">Confirmar Nueva Contraseña:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full border border-gray-300 p-2" />
                  </div>
                  <button type="button" onClick={handleChangePassword} className="mt-4 bg-green-500 text-white p-2 rounded">
                    Guardar Contraseña
                  </button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} className="mt-4 ml-4 bg-gray-500 text-white p-2 rounded">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>No hay datos de usuario disponibles</p>
      )}
    </div>
  );
};

export default UserInfo;
