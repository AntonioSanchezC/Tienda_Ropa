import PromotionSeasson from '../views/PromotionSeasson';
import PromotionSale from './PromotionSale';
import useQuisco from '../hooks/useQuiosco';
import { useState, useRef, useEffect } from "react";
import clienteAxios from "../config/axios";
import SearchedGallery from './SearchedGallery';
import { Link } from 'react-router-dom';

export default function InitialA() {
  const { img, promotions, promoProduct, product, imgProduct, idImgProduct } = useQuisco();

  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const noveltyProducts = product.filter((product) => product.novelty === 1);
    noveltyProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const groupedProducts = [];
    for (let i = 0; i < noveltyProducts.length; i += 4) {
      groupedProducts.push(noveltyProducts.slice(i, i + 4));
    }
    setGroups(groupedProducts);
  }, [product]);

  const scrollToImage = (direction) => {
    const numSlides = Math.ceil(groups.length);
    let newIndex = direction === 'prev' ? (currentIndex === 0 ? numSlides - 1 : currentIndex - 1) : (currentIndex === numSlides - 1 ? 0 : currentIndex + 1);
    if (groups[newIndex] && groups[newIndex].length > 0) {
      setCurrentIndex(newIndex);
    } else {
      setCurrentIndex(direction === 'prev' ? groups.length - 1 : 0);
    }
  };

  const filteredPromotionSeasson = promotions.filter(promo => promo.tipe === 'seasson' && promo.status === 1);
  const lastSeasonPromotionSeasson = filteredPromotionSeasson[filteredPromotionSeasson.length - 1];
  const imgPSeasson = lastSeasonPromotionSeasson ? img.find(img => img.id === lastSeasonPromotionSeasson.id_imgs) : null;
  const imagePromotionSeasson = imgPSeasson && imgPSeasson.image ? `${clienteAxios.defaults.baseURL}/${imgPSeasson.image}` : null;

  const filteredPromotionSale = promotions.filter(promo => promo.tipe === 'sale' && promo.status === 1);
  const lastSeasonPromotionSale = filteredPromotionSale[filteredPromotionSale.length - 1];
  const imgPSale = lastSeasonPromotionSale ? img.find(img => img.id === lastSeasonPromotionSale.id_imgs) : null;
  const imagePromotionSale = imgPSale && imgPSale.image ? `${clienteAxios.defaults.baseURL}/${imgPSale.image}` : null;

  return (
    <div className='flex-column'>
      {lastSeasonPromotionSeasson && (
        <div className="relative group flex justify-center">
          <Link to={`/PromotionSeasson`} className="block w-11/12 h-2/3 md:h-4/5 hover:opacity-50 transition-opacity duration-300">
            <img
              src={imagePromotionSeasson}
              alt={lastSeasonPromotionSeasson.name}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      )}
      {lastSeasonPromotionSale && (
        <div className="relative group flex justify-center">
          <Link to={`/PromotionSaleView`} state={{ promotion: lastSeasonPromotionSale }} className="block w-11/12 h-2/3 md:h-4/5">
            <img
              src={imagePromotionSale}
              alt={lastSeasonPromotionSale.name}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      )}
      <SearchedGallery
        products={groups[currentIndex] || []}
        onPrev={() => scrollToImage('prev')}
        onNext={() => scrollToImage('next')}
      />





      <div className="w-full relative m-0 p-6 bg-zinc-300">
          <p className='text-slate-700'>Han llegado</p>
            <div className="ml-18 my-3 bg-zinc-700 h-px w-[92rem]  top-1/2 transform -translate-y-1/2"></div>

            <div className='absolute top-1/2 transform -translate-y-1/2 left-8 text-5xl font-bold text-slate-200 z-10 cursor-pointer' onClick={() => scrollToImage('prev')}>&#10092;</div>
            <div className='absolute top-1/2 transform -translate-y-1/2 right-8 text-5xl font-bold text-slate-200 z-10 cursor-pointer' onClick={() => scrollToImage('next')}>&#10093;</div>
            <div className="border border-solid border-gray-300 overflow-hidden p-7">
              <ul ref={listRef} className='' style={{  transition: 'all 0.5s' }} >
                {groups.map((group, groupIndex) => (
                  <li key={groupIndex} className='' style={{ display: groupIndex === currentIndex ? 'block' : 'none' }}>
                  <div className="flex justify-center ">
                      {group.map((product, index) => {
                        const imgProductForProduct = imgProduct.find((imgP) => imgP.product_id === product.id);
                        const key = imgProductForProduct ? `${product.id}_${imgProductForProduct.img_id}` : '';
                        const imgRelated = key && idImgProduct[key];
                        const imagenProducto = imgRelated && imgRelated.image ? `${clienteAxios.defaults.baseURL}/${imgRelated.image}` : null;

                        return (
                          <div key={index} className="md:mt-2 md:mx-5 ">
                            <img 
                              src={imagenProducto}  
                              alt={product.name}  
                              className=" md:w-[23rem] md:h-[30rem] md:px-2"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
      </div>
    

</div>
    
  );
}
