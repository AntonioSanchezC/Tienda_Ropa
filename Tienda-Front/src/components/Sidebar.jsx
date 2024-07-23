import React, { useState } from "react";
import useQuiosco from "../hooks/useQuiosco";
import SidebarMostrar from "./SidebarMostrar";

export default function Sidebar() {

  const [showSidebar, setShowSidebar] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { selectGender, setGender } = useQuiosco();


  const handleGenderClick = (gender) => {
    selectGender(gender);
  };

  const toggleSidebar = () => {
    if (showSidebar) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowSidebar(false);
        setIsAnimatingOut(false);
      }, 500); // Ajusta el tiempo según la duración de la animación
    } else {
      setShowSidebar(true);
    }
  };

  return (
    <div className="relative md:bottom-0">
      <div className="flex space-x-2 px-12">
        <p
          className="cursor-pointer text-black hover:bg-gray-700 hover:text-gray-300 m-0 p-0 transition duration-300"
          onClick={() => handleGenderClick("M")}
        >
          Hombre
        </p>
        <p
          className="cursor-pointer text-black hover:bg-gray-700 hover:text-gray-300 m-0 p-0 transition duration-300"
          onClick={() => handleGenderClick("F")}
        >
          Mujer
        </p>
        <button
          className="cursor-pointer text-black hover:bg-gray-700 hover:text-gray-300 m-0 p-0 transition duration-300"
          type="button"
          onClick={toggleSidebar}
        >
          Categorías
        </button>
      </div>

      {showSidebar && (
        <SidebarMostrar
          onClose={() => {
            setIsAnimatingOut(true);
            setTimeout(() => {
              setShowSidebar(false);
              setIsAnimatingOut(false);
            }, 500); // Ajusta el tiempo según la duración de la animación
          }}
          isAnimatingOut={isAnimatingOut}
        />
      )}
    </div>
  );
}
