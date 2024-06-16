import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const { users, phone } = useQuisco();
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

      <div className="flex flex-col ">
      {Array.isArray(users) && users.map((user) => (
        <div key={user.id} className="flex flex-nowrap mt-3">
        <Link to={`/admin/detailsUsers`}   state={{ user: user }} className="flex flex-nowrap w-4/5 md:top-32  bg-white p-4 shadow-md hover:bg-slate-400 hover:text-white">
          <p className="md:mr-3">{user.name}</p>
          <p className="md:mr-3">{user.lastName}</p>
            <p>Dirección: {user.address}</p>
          </Link>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-700  text-white p-3">
                Borrar usuario
              </button>
          </div>
        ))}
      </div>
    </>
  )
}
