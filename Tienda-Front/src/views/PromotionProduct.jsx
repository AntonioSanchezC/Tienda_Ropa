import { createRef, useState } from "react" 
import useQuisco from "../hooks/useQuiosco";
import {useAuth} from '../hooks/useAuth';
import Alerta from "../components/Alerta";

export default function PromotionProduct() {

    const { product, promotions } = useQuisco();

    const proRef = createRef();
    const promoRef = createRef();
    const quantityRef = createRef();

    const [errores, setErrores] = useState([]);
    const {promoProduct} = useAuth({
        middleware: 'auth',
        url:'/'
    })

    const handleSubmit = async e => {
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
    <div>
    
        <form
            onSubmit={handleSubmit}
            noValidate
        >

            <div className="mb-4 space-x-8 flex">
            {errores ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>) : null}

                <label 
                    htmlFor="valor"
                    className="w-20  mt-7"
                >Productos:
                
                </label>
                    <select 
                        id="valor"
                        name="valor" 
                        ref={proRef}
                        required
                        className="mt-10 h-8 shrink"
                    >
                        {product.map(pro => (
                            <option 
                                key={pro.id}
                                value={pro.id}
                            >
                                {pro.name} 
                            </option>
                        ))}
                    </select>
            </div>
            <div className="mb-4 space-x-8 flex">
                <label 
                    htmlFor="valor"
                    className="w-20  mt-7"
                >Promición:
                
                </label>
                    <select 
                        id="valor"
                        name="valor" 
                        ref={promoRef}
                        required
                        className="mt-10 h-8 shrink"
                    >
                        {promotions.map(promo => (
                            <option 
                                key={promo.id}
                                value={promo.id}
                            >
                                {promo.name} 
                            </option>
                        ))}
                    </select>
            </div>


            <input type="hidden" name="quantity" value={1} ref={quantityRef} />

            <input 
                type="submit"
                value="Enlazar"
                className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full md:mt-12 p-0 uppercase font-bold cursor-pointer h-16"
            />
        
        
        </form>
    
    </div>
  )
}
