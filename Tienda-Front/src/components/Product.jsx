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
        <div className="shadow bg-zinc-300 mx-8 my-12">
            <Link to={`/details`} state={{ product: { ...product, price: parsedDiscountedPrice !== undefined ? parsedDiscountedPrice : parsedPrice }, imageProduct }}>
                {imageProduct && <img src={imageProduct} alt={name} className="md:w-[20rem] md:h-[15rem] m-0 p-0" />}
            </Link>
            <h3 className="text-xs font-bold">{name}</h3>
            {parsedDiscountedPrice !== undefined ? (
                <div className="product-pricing">
                    <p className="original-price text-xs text-red-500 line-through">${parsedPrice.toFixed(2)}</p>
                    <p className="discounted-price text-xs font-black text-black">${parsedDiscountedPrice.toFixed(2)}</p>
                </div>
            ) : (
                <p className="text-xs font-black text-black">${parsedPrice.toFixed(2)}</p>
            )}
        </div>
    );
}
