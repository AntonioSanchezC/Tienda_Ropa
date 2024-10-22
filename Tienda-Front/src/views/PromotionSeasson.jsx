import clienteAxios from "../config/axios";
import { useRef, useState } from "react";
import useQuisco from '../hooks/useQuiosco';
import Product from "../components/Product";

export default function PromotionSeasson() {
  const { img, promotions, promoProduct, imgProduct, idImgProduct, product } = useQuisco();
  console.log("El valor de promotion desde PromotionSeasson es ", promotions);
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar promociones de tipo 'seasson' y con estado 1
  const filteredPromotionSeasson = promotions.filter(promo => promo.tipe === 'seasson' && promo.status === 1);
  const lastSeasonPromotionSeasson = filteredPromotionSeasson[filteredPromotionSeasson.length - 1];

  // Verifica que `product` sea un arreglo
  const validProducts = Array.isArray(product) ? product : [];

  // Obtener productos relacionados con la promoción 'seasson'
  const seassonProductIds = promoProduct
    .filter(item => filteredPromotionSeasson.some(promo => promo.id === item.promotion_id))
    .map(item => item.product_id);
  const promotionProduct = validProducts.filter(prod => seassonProductIds.includes(prod.id));
  console.log("El valor de promotionProduct desde PromotionSeasson es ", promotionProduct);

  const imgProductKeys = Object.keys(idImgProduct);
  const filteredKeys = imgProductKeys.filter(key => {
    const productId = key.split('_')[0];
    return promotionProduct.some(product => product.id === parseInt(productId));
  });

  const filteredIdImgProduct = filteredKeys.reduce((acc, key) => {
    acc[key] = idImgProduct[key];
    return acc;
  }, {});
  console.log("El valor de filteredIdImgProduct desde PromotionSeasson es ", filteredIdImgProduct);

  // Obtener la imagen de la última promoción de tipo 'seasson'
  const imgP = img.find(img => img.id === lastSeasonPromotionSeasson.id_imgs);
  const imagePromotion = imgP && imgP.image ? `${clienteAxios.defaults.baseURL}/${imgP.image}` : null;

  return (
    <div className='w-full h-full flex justify-center items-center md:p-9'>
      <div className=" w-full m-0">
        <div className="border border-solid border-gray-300 overflow-hidden">
          <ul ref={listRef} className="flex flex-wrap">
            <li className={`page flex-shrink-0 w-full`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {promotionProduct.map((item, index) => {
                  if (item) {
                    const imgProductForProduct = imgProduct.find((imgP) => imgP.product_id === item.id);
                    const key = imgProductForProduct ? `${item.id}_${imgProductForProduct.img_id}` : '';
                    const imgRelacionated = key && filteredIdImgProduct[key];

                    return (
                      <div key={index} className="w-5/6 h-full flex items-center justify-center bg-gray-100 mx-0">
                        <Product key={key} product={item} img={imgRelacionated} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
