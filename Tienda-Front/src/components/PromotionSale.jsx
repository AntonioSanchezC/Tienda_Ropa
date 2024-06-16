import clienteAxios from "../config/axios";
import { Link } from "react-router-dom";

export default function PromotionSale({promotion, img,}) {

    const { name } = promotion;

    // Verificar si img está definido y tiene la propiedad 'image'
    console.log(img);
  
    // Construir la ruta completa de la imagen utilizando import.meta.env
    const imagePromotion = img && img.image ? `${clienteAxios.defaults.baseURL}/${img.image}` : null;
  


    return (
      <div className='flex justify-center items-center '>
        <Link to={`/PromotionSaleView`} state={{ promotion, imagePromotion }}>
          {imagePromotion && <img src={imagePromotion} alt={name}  className="md:w-screen md:h-64 shadow-md" />}
        </Link>
      </div>
    
      );
}
