import { createRef, useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import useQuiosco from '../hooks/useQuiosco';
import Resumen from './Resumen';
import { Link } from 'react-router-dom';
import SidebarUser from './SidebarUser';
import '../styles/style.css';

export default function Head() {

  const { logout, user } = useAuth({ middleware: 'auth' });
  const searchRef = createRef();
  const { setCartState, order, cartState, handleClickFilteredProducts } = useQuiosco();
  const quantityOrder = order.length;
  const baseURL =  import.meta.env.VITE_API_URL;
  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const userIconRef = useRef(null);

  const { search } = useAuth({
    middleware: 'guest',
    url: '/'
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const searchTerm = searchRef.current.value;
    handleClickFilteredProducts({ value: searchTerm, type: 'string' });
    search();
  };

  const handleUserIconClick = () => {
    if (showLogoutButton) {
      setIsHiding(true);
      setTimeout(() => {
        setShowLogoutButton(false);
        setIsHiding(false);
      }, 300); // Tiempo en milisegundos para la animación de salida
    } else {
      setShowLogoutButton(true);
    }
  };

  const handleBadgeClick = (event) => {
    event.stopPropagation();
    setCartState((prevCartState) => !prevCartState);
  };

  const handleSearchButtonClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="relative z-20 md:h-1/5 font-playfair shadow-lg">
      <div className="relative md:w-full md:h-[5rem] bg-white flex justify-between items-center z-30">
        <div className="flex items-center md:h-1/5 left-0">
          <Link to={`/`}>
            <img src={`${baseURL}/icon/Logo.png`} alt="logo icon" className="md:w-[15rem] md:h-[13rem]" />
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-6 mr-6 px-12">
          <div className="relative">
            <Sidebar />
          </div>
          <div ref={userIconRef} className="w-12 h-12 relative cursor-pointer" onClick={handleUserIconClick}>
            <img 
              src={user && user.imgs && user.imgs.image ? `${baseURL}/${user.imgs.image}` : `${baseURL}/icon/userIcon.png`} 
              alt="user icon" 
              className="w-12 h-12 object-cover rounded-full" 
            />
          </div>
          <div className="w-12 h-12 relative">
            <Link to={`/trolley`}>
              <img src={`${baseURL}/icon/bag.png`} alt="cart icon" className="cursor-pointer" />
            </Link>
            {quantityOrder > 0 && (
              <div
                className="absolute cursor-pointer transform translate-x-3 translate-y-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded-full text-xs"
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
          <div className="w-12 h-12 relative cursor-pointer" onClick={handleSearchButtonClick}>
            <img src={`${baseURL}/icon/Lupa.png`} alt="search icon" />
          </div>
        </div>
      </div>

      <div className={`absolute left-0 right-0 text-white transition-transform duration-300 ${showSearch ? 'translate-y-full' : '-translate-y-full'}`}>
        <form onSubmit={handleSubmit} noValidate className="w-full">
          <div className="flex justify-center m-0">
            <div className="w-3/4 mx-2 flex">
              <input
                type="text"
                id="search"
                className="flex-grow bg-slate-300 h-15 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none mx-2"
                name="search"
                placeholder="Search"
                ref={searchRef}
              />
              <input
                type="submit"
                value="Search"
                className="bg-white hover:bg-zinc-700 text-black hover:text-white w-24 rounded-lg text-xs font-bold cursor-pointer p-2 md:h-10 mx-2"
              />
            </div>
          </div>
        </form>
      </div>

      {cartState && <Resumen />}

      {(showLogoutButton || isHiding) && (
        <SidebarUser userIconRef={userIconRef} showLogoutButton={showLogoutButton && !isHiding} />
      )}
    </div>
  );
}
