import React, { useEffect } from "react";
import useQuiosco from "../hooks/useQuiosco";
import Category from "./Category";
import SubCategory from "./SubCategory";
import { useAuth } from "../hooks/useAuth";
import "../styles/sidebar.css"; // Importa tu archivo CSS donde defines las animaciones

export default function SidebarMostrar({ onClose, isAnimatingOut }) {
  const {

  obtenerCategorias,
  obtenerSubCategorias,
    categories,
    subCategories,
    currentCategory,
    obtenerSubCategoriasPorCategoria,
    handleClickFilteredProducts,
  } = useQuiosco();

  const { search } = useAuth({
    middleware: "guest",
    url: "/",
  });
  useEffect(() => {
    obtenerCategorias();
    obtenerSubCategorias();
},[])

  useEffect(() => {
    if (isAnimatingOut) {
      const timeout = setTimeout(() => onClose(), 500); // Ajusta el tiempo según la duración de la animación
      return () => clearTimeout(timeout);
    }
  }, [isAnimatingOut, onClose]);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-1/2 h-screen bg-white shadow-md p-4 overflow-y-auto transition-transform duration-500 ${
        isAnimatingOut ? "sidebar-anim-out" : "sidebar-anim-in"
      }`}
    >
      <button
        type="button"
        className="text-black absolute top-2 left-2 close-button"
        onClick={onClose}
      >
        Cerrar
      </button>
      <div className="flex">
        <div className="w-1/2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="hover:bg-slate-300 p-2 cursor-pointer"
              onClick={() => {
                obtenerSubCategoriasPorCategoria(category.id);
                handleClickFilteredProducts({
                  id: category.id,
                  type: "category",
                });
                search();
              }}
            >
              <Category category={category} />
            </div>
          ))}
        </div>
        <div className="w-1/2">
          {currentCategory && (
            <div>
              <h2>Subcategorías:</h2>
              {subCategories
                .filter(
                  (sub) => sub.parent_category_id === currentCategory.id
                )
                .map((sub) => (
                  <div
                    key={sub.id}
                    className="hover:bg-slate-300 p-2 cursor-pointer"
                    onClick={() => {
                      handleClickFilteredProducts({
                        id: sub.id,
                        type: "subCategory",
                      });
                      search();
                    }}
                  >
                    <SubCategory sub={sub} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
