import useQuisco from "../hooks/useQuiosco";
import { formatearDinero } from "../helpers";
export default function TrolleyList({product}) {

    const {handleEditarCantidad, handleEliminarProductoPedido} = useQuisco();
    const {id, name, price, quantity} = product
    const baseURL = 'http://localhost'; 

    return (
        <div className="space-y-1 p-5">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">{name}</p>
            <div className="flex-grow border-b-8 border-dotted border-gray-300 mx-2"></div>
            <p className="text-lg font-bold">{formatearDinero(price)}</p>
          </div>
    
          <div className="flex justify-between gap-2 pb-4">


          </div>
        </div>
      );
    }