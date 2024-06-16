import useQuisco from "../hooks/useQuiosco";

    export default function SubCategory({ sub }) {
        const { handleClickSubCategoria, subCurrentSubCategory } = useQuisco();
        const { id, name } = sub;
        console.log("sub en SubCategory es", sub);

        const resaltarCategoriaActual = () =>
        subCurrentSubCategory.id === id ? "bg-green-500" : "bg-white";
      
        const handleClick = () => {
          console.log("subCategoría clickeada:", sub);
          handleClickSubCategoria(id);
        };
      

        console.log("Los datos de sub ",subCurrentSubCategory);
    return (
        <div
          className={`${resaltarCategoriaActual()} 
          flex items-center gap-4  w-full p-3  cursor-pointer`}
        >
          <button
            className="text-lg font-bold cursor-pointer truncate"
            onClick={handleClick}
          >
            {name}
          </button>
        </div>
      );
    }
    