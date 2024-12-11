import clienteAxios from "../config/axios";
import { Link } from "react-router-dom";
import useQuisco from "../hooks/useQuiosco";

export default function Product({ product, img }) {

    const { name, price, discountedPrice } = product;
    const { handleClickModal } = useQuisco();

    const parsedPrice = parseFloat(price);
    const parsedDiscountedPrice = discountedPrice !== undefined ? parseFloat(discountedPrice) : undefined;

    const imageProduct = img && img.image ? `${clienteAxios.defaults.baseURL}/${img.image}` : null;

    return (
        <div className="mx-8">
            <Link to={`/details`} state={{ product: { ...product, price: parsedDiscountedPrice !== undefined ? parsedDiscountedPrice : parsedPrice }, imageProduct }}>
                {imageProduct && <img src={imageProduct} alt={name} className="md:w-[19rem] md:h-[23rem] sm:w-[19rem] sm:h-[23rem]  xs:w-[19rem] xs:h-[18rem] md:px-2" />}
            </Link>
        </div>
    );
}
