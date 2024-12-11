import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState,useEffect } from "react";

import { Link } from "react-router-dom";

export default function AdminUsers() {
  const { getUsers,getPhone,users, phone } = useQuisco();
  const [currentPage, setCurrentPage] = useState(1);

  const UsersPerPage = 8;


  const indexOfLastOrder = currentPage * UsersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - UsersPerPage;
  const currentUsers = users.slice(indexOfFirstOrder, indexOfLastOrder);


  useEffect(() => {
      getUsers();
      getPhone();
  }, []);
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
      <div className="mt-8 p-4 shadow-2xl rounded-lg md:m-5">
        <div className="bg-white p-4 rounded-md mt-4">
          <div className="text-4xl text-gray-500 font-black pb-4">Usuarios en la Base de Datos</div>
          <div className="my-1"></div>
          <div className="bg-gradient-to-r from-slate-400 to-cyan-500 h-px mb-6"></div> 

          <div className="flex flex-col">
            {
              currentUsers.map((user) => (
                <div key={user.id} className="flex flex-nowrap items-center justify-between bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white mb-4 rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center w-full">
                  <p className="hidden md:block">Dirección: {user.name}</p>
                  <p className="hidden md:block">Dirección: {user.address}</p>
                  </div>
                  <Link to={`/admin/detailsUsers`} state={{ user: user }} className="bg-white hover:bg-slate-400 text-gray-800 hover:text-white border border-gray-400 hover:border-transparent rounded-md py-1 px-2 mr-2">
                  Detalles
                  </Link>
                  <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md">
                    Borrar
                  </button>
                </div>
              ))}
          </div>

            {/* Paginacion */}
            <div className="text-right mt-4">
            <div className="flex justify-center my-6">
              {Array.from({ length: Math.ceil(users.length / UsersPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-2 px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
