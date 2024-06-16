import Sidebar from './Sidebar';
import { useAuth } from "../hooks/useAuth";
import { createRef, useState } from "react" 
import useQuisco from '../hooks/useQuiosco';
import Resumen from './Resumen';
import { Link } from 'react-router-dom';
import SidebarUser from './SidebarUser';

export default function Head() {
  // Para cerrar sesión
  const { logout, user } = useAuth({ middleware: 'auth' }); 

  // Para función de buscador
  const searchRef = createRef();
  const { setCartState, order, cartState, handleClickFilteredProducts } = useQuisco();
  const quantityOrder = order.length;
  const baseURL = 'http://localhost'; 

  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutButton, setShowLogoutButton] = useState(false); // Estado para controlar la visibilidad del botón de cerrar sesión

  const [errores, setErrores] = useState([]);
  const { search } = useAuth({
    middleware: 'guest',
    url:'/'
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const searchTerm = searchRef.current.value;
    handleClickFilteredProducts({ value: searchTerm, type: 'string' });
    search();
  };

  // Función para manejar el clic en el icono de usuario y mostrar/ocultar el botón de cerrar sesión
  const handleUserIconClick = () => {
    setShowLogoutButton(!showLogoutButton);
  };

  //Carrito icono, funcion que muestra y oculta
  const handleCartClick = () => {
    history.push('/your-cart-url'); // Reemplazar con la URL deseada
  };

  const handleBadgeClick = (event) => {
    event.stopPropagation(); // Evita que se active el handleCartClick
    setCartState((prevCartState) => !prevCartState);
  };

  const handleSearchButtonClick = () => {
    setShowSearch(!showSearch); // Cambiar el estado de visibilidad del formulario de búsqueda
  };

  return (
    <div className=' md:w-full h-32 bg-black flex justify-between items-center m-0'>
      <Sidebar/>

      <div className='absolute left-1/2  transform -translate-x-1/2  rounded-full overflow-hidden' >
        <Link to={`/`}>
          <img src={`${baseURL}/icon/Logo.png`} alt="logo icon" className='md:w-36 md:h-28'/>
        </Link>
      </div>

      {showLogoutButton && ( 
        <SidebarUser/>
      )}
      <div className="flex justify-between mx-24">
        <div className='w-9 h-9 mx-6 relative' onClick={handleUserIconClick}>
          <img src={`${baseURL}/icon/User.png`} alt="user icon" />
        </div>
        <div className='w-8 h-8 mx-6 relative' onClick={handleCartClick}>
          <Link to={`/trolley`}>
          <img src={`${baseURL}/icon/carritoNoir.png`} alt="cart icon" className="cursor-pointer" />
          </Link>

          {quantityOrder > 0 && (
            <div 
              className="absolute transform translate-x-3 translate-y-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded-full text-xs"
              style={{
                width: '1rem',
                height: '1.5rem',
                borderRadius: '1.5rem 1.5rem 1.5rem 0',
                clipPath: 'polygon(50% 0%, 75% 15%, 100% 30%, 100% 100%, 0% 100%, 0 30%, 25% 15%)',

              }}
              onClick={handleBadgeClick}
            >
              {quantityOrder}
            </div>
          )}
      </div>
        <div className='w-9 h-9 mx-6 relative' onClick={handleSearchButtonClick}>
          <img src={`${baseURL}/icon/Lupa.png`} alt="search icon" />
        </div>

        {showSearch && (
          <div className='text-white'>
            <form onSubmit={handleSubmit} noValidate>
              <div className='flex'>
                <div className='mx-4'>
                  <input 
                    type="text"
                    id="search"
                    className="bg-slate-300 h-6 p-3  border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                    name="search"
                    placeholder="Search"
                    ref={searchRef}
                  />
                </div>
                <div className='mx-4'>
                  <input 
                    type="submit"
                    value="Search"
                    className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full rounded-lg text-xs font-bold cursor-pointer p-2 md:h-8"
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {cartState && <Resumen />}
      </div>
    </div>
  );
}
