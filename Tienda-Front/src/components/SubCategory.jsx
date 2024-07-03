import useQuisco from "../hooks/useQuiosco";

    export default function SubCategory({ sub }) {
        const { handleClickSubCategoria, subCurrentSubCategory } = useQuisco();
        const { id, name } = sub;

      
        const handleClick = () => {
          handleClickSubCategoria(id);
        };
      

        console.log("Los datos de sub ",subCurrentSubCategory);
    return (
        <div
          className='flex items-center gap-4  w-full p-3  cursor-pointer'
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
    