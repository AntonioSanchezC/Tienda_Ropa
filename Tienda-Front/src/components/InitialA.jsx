import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import useQuisco from "../hooks/useQuiosco";
import SearchedGallery from "./SearchedGallery";
import "../styles/styleInitialA.css";
import ProductInitialA from "./ProductInitialA";

export default function InitialA() {
  const { img, promotions, product, imgProduct, idImgProduct } = useQuisco();
  
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const updateGroups = () => {
      if (!Array.isArray(promotions) || promotions.length === 0) return;
      if (!Array.isArray(product)) return;
  
      const noveltyProducts = product.filter((product) => product.novelty === 1);
      noveltyProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      const itemsPerGroup = window.innerWidth < 768 ? 2 : 4; // 2 para móviles y tablets, 4 para pantallas grandes
      const groupedProducts = [];
      for (let i = 0; i < noveltyProducts.length; i += itemsPerGroup) {
        groupedProducts.push(noveltyProducts.slice(i, i + itemsPerGroup));
      }
  
      setGroups(groupedProducts.slice(0, Math.ceil(8 / itemsPerGroup)));
    };
  
    updateGroups();
  
    // Agregar event listener para manejar cambios de tamaño de pantalla
    window.addEventListener('resize', updateGroups);
  
    return () => {
      window.removeEventListener('resize', updateGroups);
    };
  }, [product, promotions]);
  

  if (!Array.isArray(promotions) || promotions.length === 0) {
    return <div>Loading...</div>;
  }
  const scrollToImage = (direction) => {
    const numSlides = groups.length;
  
    if (direction === "next") {
      if (currentIndex >= numSlides) {
        // Estamos en el último duplicado (al final), restablecer al principio
        listRef.current.style.transition = "none";
        setCurrentIndex(0);
        setTimeout(() => {
          listRef.current.style.transition = "transform 0.5s ease-in-out";
          setCurrentIndex(1);
        }, 10);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  
    if (direction === "prev") {
      if (currentIndex === 0) {
        // Estamos en el primer duplicado (al principio), restablecer al final
        listRef.current.style.transition = "none";
        setCurrentIndex(numSlides);
        setTimeout(() => {
          listRef.current.style.transition = "transform 0.5s ease-in-out";
          setCurrentIndex(numSlides - 1);
        }, 10);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };
  

  const filteredPromotionSeasson = promotions.filter((promo) => promo.tipe === "seasson" && promo.status === 1);
  const lastSeasonPromotionSeasson = filteredPromotionSeasson[filteredPromotionSeasson.length - 1];
  const imgPSeasson = lastSeasonPromotionSeasson ? img.find((img) => img.id === lastSeasonPromotionSeasson.id_imgs) : null;
  const imagePromotionSeasson = imgPSeasson && imgPSeasson.image ? `${clienteAxios.defaults.baseURL}/${imgPSeasson.image}` : null;

  const filteredPromotionSale = promotions.filter((promo) => promo.tipe === "sale" && promo.status === 1);
  const lastSeasonPromotionSale = filteredPromotionSale[filteredPromotionSale.length - 1];
  const imgPSale = lastSeasonPromotionSale ? img.find((img) => img.id === lastSeasonPromotionSale.id_imgs) : null;
  const imagePromotionSale = imgPSale && imgPSale.image ? `${clienteAxios.defaults.baseURL}/${imgPSale.image}` : null;

  return (
    <div className="flex-column  z-10">
      {lastSeasonPromotionSeasson && (
        <div className="relative group flex justify-center">
          <Link to={`/PromotionSeasson`} className="block w-10/12 h-2/3 md:h-[35rem] hover:opacity-50 transition-opacity duration-300">
            <img src={imagePromotionSeasson} alt={lastSeasonPromotionSeasson.name} className="w-full h-full object-cover" />
          </Link>
        </div>
      )}
      {lastSeasonPromotionSale && (
        <div className="relative group flex justify-center">
          <Link to={`/PromotionSaleView`} state={{ promotion: lastSeasonPromotionSale }} className="md:w-full md:h-48 my-24">
            <img src={imagePromotionSale} alt={lastSeasonPromotionSale.name} className="w-full h-full object-cover" />
          </Link>
        </div>
      )}

      <SearchedGallery />

      <div className="md:w-full md:h-[30rem] relative m-0 p-6 bg-zinc-100 mb-12 font-playfair">
        <p className="text-slate-700">Han llegado</p>
        <div className="ml-18 my-3 bg-zinc-700 h-px w-[92rem] top-1/2 transform -translate-y-1/2"></div>

        <div className="absolute top-1/2 transform -translate-y-1/2 left-8 text-5xl font-bold text-slate-200 z-10 cursor-pointer" onClick={() => scrollToImage("prev")}>&#10092;</div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-8 text-5xl font-bold text-slate-200 z-10 cursor-pointer" onClick={() => scrollToImage("next")}>&#10093;</div>
        <div className="overflow-hidden p-7">
        <ul
        ref={listRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${(currentIndex + 1) * 100}%)` }}
      >
        {/* Duplicado del último grupo al principio */}
        {groups[groups.length - 1] && (
          <li className="flex-shrink-0 w-full">
            <div className="flex justify-center mt-[-1rem]">
              {groups[groups.length - 1].map((product, index) => {
                const imgProductForProduct = imgProduct.find((imgP) => imgP.product_id === product.id);
                const key = imgProductForProduct ? `${product.id}_${imgProductForProduct.img_id}` : "";
                const imgRelated = key && idImgProduct[key];
      
                return (
                  <ProductInitialA
                    key={`last-${index}`}
                    product={product}
                    img={imgRelated}  // Pasamos la imagen específica del producto al componente Product
                  />
                );
              })}
            </div>
          </li>
        )}
      
        {/* Grupos originales */}
        {groups.map((group, groupIndex) => (
          <li key={groupIndex} className="flex-shrink-0 w-full">
            <div className="flex justify-center mt-[-1rem]">
              {group.map((product, index) => {
                const imgProductForProduct = imgProduct.find((imgP) => imgP.product_id === product.id);
                const key = imgProductForProduct ? `${product.id}_${imgProductForProduct.img_id}` : "";
                const imgRelated = key && idImgProduct[key];
      
                return (
                  <ProductInitialA 
                    key={`${groupIndex}-${index}`}
                    product={product}
                    img={imgRelated}  // Pasamos la imagen específica del producto al componente Product
                  />
                );
              })}
            </div>
          </li>
        ))}
      
        {/* Duplicado del primer grupo al final */}
        {groups[0] && (
          <li className="flex-shrink-0 w-full">
            <div className="flex justify-center mt-[-1rem]">
              {groups[0].map((product, index) => {
                const imgProductForProduct = imgProduct.find((imgP) => imgP.product_id === product.id);
                const key = imgProductForProduct ? `${product.id}_${imgProductForProduct.img_id}` : "";
                const imgRelated = key && idImgProduct[key];
      
                return (
                  <ProductInitialA
                    key={`first-${index}`}
                    product={product}
                    img={imgRelated}
                  />
                );
              })}
            </div>
          </li>
        )}
      </ul>
      
        </div>
      </div>
    </div>
  );
}
