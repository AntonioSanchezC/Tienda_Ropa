import React, { useState } from "react";
import useQuiosco from "../hooks/useQuiosco";
import Category from "./Category";
import SubCategory from "./SubCategory";
import { useAuth } from "../hooks/useAuth";

export default function SidebarMostrar() {
  const {
    categories,
    subCategories,
    currentCategory,
    obtenerSubCategoriasPorCategoria,
    handleClickFilteredProducts,
    filterProductsByGender
  } = useQuiosco();

  const [errores, setErrores] = useState([]);
  const { search } = useAuth({
    middleware: 'guest',
    url: '/'
  });


  const handleGenderClick = (gender) => {
    filterProductsByGender(gender);
  };

  return (
    <div className="absolute z-40 md:top-32 right-0 left-0 h-full bg-white w-72 p-4 shadow-md">
      <p className="cursor-pointer" onClick={() => handleGenderClick('M')}>Hombre</p>
      <p className="cursor-pointer" onClick={() => handleGenderClick('F')}>Mujer</p>
      <div className="flex md:w-72">
        <div className="basis-1/2">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => {
                obtenerSubCategoriasPorCategoria(category.id);
                handleClickFilteredProducts({ id: category.id, type: 'category' });
                search();
              }} 
            >
              <Category category={category} />
            </div>
          ))}
        </div>
        <div className="basis-1/2">
          {currentCategory && (
            <div>
              <h2>Subcategorías:</h2>
              {subCategories
                .filter((sub) => sub.parent_category_id === currentCategory.id) // Filtrar subcategorías por tipo
                .map((sub) => (
                  <div 
                    key={sub.id}
                    onClick={() => {
                      handleClickFilteredProducts({ id: sub.id, type: 'subCategory' });
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
