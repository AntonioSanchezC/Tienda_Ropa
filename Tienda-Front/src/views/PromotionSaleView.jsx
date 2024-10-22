import { useLocation } from 'react-router-dom';
import useQuisco from '../hooks/useQuiosco';
import Product from '../components/Product';
import { useRef } from "react";

export default function PromotionSaleView() {
  const location = useLocation();
  const listRef = useRef();
  const { promotion } = location.state;
  const { promoProduct, product, imgProduct, idImgProduct } = useQuisco();

  // Verifica que `product` sea un arreglo
  const validProducts = Array.isArray(product) ? product : [];

  // Filtrar los productos asociados a la promoción actual
  const promotionProducts = promoProduct
    .filter(pp => pp.promotion_id === promotion.id)
    .map(pp => {
      const productDetails = validProducts.find(p => p.id === pp.product_id);
      if (productDetails) {
        const discount = parseFloat(promotion.discount) / 100;
        const discountedPrice = productDetails.price - (productDetails.price * discount);
        console.log("El valor de discountedPrice en PromotionSaleView es de ", discountedPrice);
        return { ...productDetails, discountedPrice };
      }
      return null;
    })
    .filter(p => p !== null);

  return (
    <div className='w-full h-full flex justify-center items-center md:p-9'>
      <div className=" w-full m-0">
        <div className="border border-solid border-gray-300 overflow-hidden">
          <ul ref={listRef} className="flex flex-wrap">
            <li className={`page flex-shrink-0 w-full`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {promotionProducts.map((item, index) => {
                  console.log("El valor de item en PromotionSaleView es de ", item);
                  const imgProductForProduct = imgProduct.find(imgP => imgP.product_id === item.id);
                  const key = imgProductForProduct ? `${item.id}_${imgProductForProduct.img_id}` : '';
                  const imgRelacionated = key && idImgProduct[key];
                  return (
                    <div key={index} className="w-5/6 h-full flex items-center justify-center bg-gray-100 mx-0">
                      <Product product={item} img={imgRelacionated} />
                    </div>
                  );
                })}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
