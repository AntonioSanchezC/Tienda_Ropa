import { createRef, useState, useEffect } from "react";
import useQuisco from "../hooks/useQuiosco";
import { useAuth } from '../hooks/useAuth';
import Alerta from "../components/Alerta";

export default function PromotionProduct() {
  const { gender, selectGender, getPromotion, promotions,  productAllSex, GetProductsSex } = useQuisco();


  const handleGenderClick = (gender) => {
    selectGender(gender);
  };

  useEffect(() => {
    GetProductsSex(gender);
    getPromotion(gender);
  }, [gender]);

  const proRef = createRef();
  const promoRef = createRef();
  const quantityRef = createRef();

  const [errores, setErrores] = useState([]);
  const { promoProduct } = useAuth({
    middleware: 'auth',
    url: '/'
  });

  const [selectedProduct, setSelectedProduct] = useState("");  // Estado para el producto seleccionado
  const [selectedPromo, setSelectedPromo] = useState("");  // Estado para la promoción seleccionada

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir los valores a enteros (integer)
    const id_product = parseInt(proRef.current.value);
    const id_promo = parseInt(promoRef.current.value);
    const quantityN = parseInt(quantityRef.current.value);

    // Verificar si la conversión fue exitosa
    if (isNaN(id_product) || isNaN(id_promo)) {
      // Manejar el error si los valores no son enteros válidos
      console.error('Error: Los valores de id_product o id_promo no son enteros válidos');
      return;
    }

    // Crear el objeto datos con los valores convertidos
    const datos = {
      promotion_id: id_promo,
      product_id: id_product,
      quantity: quantityN,
    };

    console.log("Valores de datos desde el formulario PromotionProduct ", datos);

    promoProduct(datos, setErrores);
  };

  return (
    <div className="bg-slate-300">
      <div className="flex justify-center items-center space-x-4 my-8 text-2xl">
        <p
          className="cursor-pointer text-black hover:bg-gray-700 hover:text-gray-300 hover:shadow-xl m-0 p-0 transition duration-300 underline decoration-black decoration-2 underline-offset-4"
          onClick={() => handleGenderClick("M")}
        >
          Hombre
        </p>
        <div className="w-px h-6 bg-gray-500"></div>
        <p
          className="cursor-pointer text-black hover:bg-gray-700 hover:text-gray-300 hover:shadow-xl m-0 p-0 transition duration-300 underline decoration-black decoration-2 underline-offset-4"
          onClick={() => handleGenderClick("F")}
        >
          Mujer
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex">
          <div className="flex-1 mb-4 space-x-8">
            {errores ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>) : null}
            <div className="flex-1 mb-4 space-x-8">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="valor"
                  className="w-20 mt-7 font-playfair text-xl"
                >Productos:
                </label>
                <select
                  id="valor"
                  name="valor"
                  ref={proRef}
                  value={selectedProduct}  
                  onChange={(e) => setSelectedProduct(e.target.value)}  
                  required
                  className="h-8 w-2/3 border-b border-gray-500 bg-transparent text-center focus:outline-none focus:border-b-2 focus:border-slate-500"
                >
                  <option value="" disabled>Elegir genero para cargar</option>

                  {productAllSex.map(pro => (
                    <option
                      key={pro.id}
                      value={pro.id}
                    >
                      {pro.name}
                      {pro.product_code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 mb-4 space-x-8">
            <div className="flex flex-col items-center">
              <label
                htmlFor="valor"
                className="w-20 mt-7 font-playfair text-xl"
              >Promición:
              </label>
              <select
                id="valor"
                name="valor"
                ref={promoRef}
                value={selectedPromo} 
                onChange={(e) => setSelectedPromo(e.target.value)}  
                required
                className="h-8 w-2/3 border-b border-gray-500 bg-transparent text-center focus:outline-none focus:border-b-2 focus:border-slate-500"
              >
                <option value="" disabled>Elegir genero para cargar</option>

                {promotions.map(promo => (
                  <option
                    key={promo.id}
                    value={promo.id}
                    className="bg-transparent text-black"
                  >
                    {promo.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <input type="hidden" name="quantity" value={1} ref={quantityRef} />

        <input
          type="submit"
          value="Enlazar"
          className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full md:mt-12 p-0 uppercase font-bold cursor-pointer h-16"
        />
      </form>
    </div>
  );
}
