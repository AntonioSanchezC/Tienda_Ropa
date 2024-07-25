import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState,useEffect } from "react";

import { Link } from "react-router-dom";

export default function AdminUsers() {
  const { getUsers,getPhone,users, phone } = useQuisco();


  useEffect(() => {
      getUsers();
      getPhone();
  }, []);
  console.log("El valor de users en AdminUsers es ", users);
  const [errores, setErrores] = useState([]);
  const { deleteUser } = useAuth({
    url: '/'
  });

  const handleDelete = async(userId) => {
    try {
      await deleteUser(userId, setErrores);
    } catch (error) {
      setErrores([error.message]);
    }
  }

  return (
    <>
      <h1 className="text-4xl font-black">Usuarios en la Base de Datos</h1>

      <div className="mt-8 p-4 shadow-2xl rounded-lg md:m-5">
        <div className="bg-white p-4 rounded-md mt-4">
          <div className="text-4xl text-gray-500 font-black pb-4">Usuarios en la Base de Datos</div>
          <div className="my-1"></div>
          <div className="bg-gradient-to-r from-slate-400 to-cyan-500 h-px mb-6"></div> 

          <div className="flex flex-col">
            {Array.isArray(users) &&
              users.map((user) => (
                <div key={user.id} className="flex flex-nowrap items-center justify-between bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white mb-4 rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center w-full">
                    <p className="hidden md:block">Dirección: {user.address}</p>
                  </div>
                  <Link to={`/admin/detailsUsers`} state={{ user: user }} className="bg-white hover:bg-slate-400 text-gray-800 hover:text-white border border-gray-400 hover:border-transparent rounded-md py-1 px-2 mr-2">
                  Detalles usuario
                  </Link>
                  <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md">
                    Borrar usuario
                  </button>
                </div>
              ))}
          </div>

          <div className="text-right mt-4">
            <Link to="/admin/transactions" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded">
              Ver más
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
