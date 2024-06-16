import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";

export default function DetailsProduct() {
  const location = useLocation();
  const { product, imageProduct } = location.state || {};
  const [showComment, setShowComment] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);

  const { handleQuantityCustomers, user } = useQuisco();
  const [quantityDP, setQuantityDP] = useState(1);
  const [comments, setComments] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [errores, setErrores] = useState([]);

  const { commentInsert, commentGet, GetSizesAndColors, GetProductsByCode } = useAuth({
    middleware: 'auth',
    url: '/'
  });

  const handleChangeQuantity = (event) => {
    setQuantityDP(event.target.value);
  };

  const price = parseFloat(product.price);

  const handleCommentButtonClick = () => {
    setShowComment(!showComment);
  };

  const productCode = product.product_code;

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await commentGet(product.id, setErrores);
      setComments(comments);
    };

    const fetchSizesAndColors = async () => {
      const data = await GetSizesAndColors(productCode, selectedSize, selectedColor, setErrores);

      // Extract unique sizes
      const uniqueSizes = new Set();
      data.products.forEach(product => {
        product.sizes.forEach(size => {
          uniqueSizes.add(size.id);
        });
      });

      const sizesArray = Array.from(uniqueSizes).map(sizeId => {
        return data.products.flatMap(product => product.sizes).find(size => size.id === sizeId);
      });

      setSizes(sizesArray);
      setProducts(data.products);
    };

    fetchComments();
    fetchSizesAndColors();
  }, [productCode, firstSearch]);

  useEffect(() => {
    if (selectedSize) {
      // Filter colors based on the selected size
      const filteredColors = products
        .filter(prod => prod.sizes.some(size => size.id === selectedSize))
        .flatMap(prod => prod.colors)
        .filter((color, index, self) => self.findIndex(c => c.id === color.id) === index); // Remove duplicates
      setColors(filteredColors);
    }
  }, [selectedSize, products]);

  const commentRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = {
      user_id: user.id,
      product_id: product.id,
      comment: commentRef.current.value,
    };
    commentInsert(datos, setErrores);
  };

  const handleSizeSelect = (sizeId) => {
    setSelectedSize(sizeId);
    setSelectedColor(null);
  };

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
  };

  return (
    <>
      <div className="flex text-zinc-500 p-3 bg-white">
        <div className="w-1/2 p-2">
          <h3 className="text-4xl font-black md:m-12">{product.name}</h3>
          <div className="relative w-full h-[40rem] max-w-[33rem] mx-auto">
            <img 
              src={imageProduct} 
              className="w-full h-full object-cover object-top" 
              alt={product.name}
            />
          </div>
        </div>
        <div className="md:w-1/2 p-2 md:mt-24 md:ml-12">
          <div className="p-3">
            <h3 className="text-3xl font-black">{product.name}</h3>
            <p className="mt-5 text-2xl md:ml-2">Precio: ${price.toFixed(2)}</p>
            <p className="mt-5 text-2xl md:ml-2">Descripción: {product.description}</p>
            <div className="mt-5 text-2xl md:ml-2">
              <label htmlFor="size" className="block font-bold">Tallas disponibles:</label>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button 
                    key={size.id}
                    className={`px-4 py-2 border-2 ${selectedSize === size.id ? 'border-black' : 'border-gray-300'}`}
                    onClick={() => handleSizeSelect(size.id)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 text-2xl md:ml-2">
              <label htmlFor="color" className="block font-bold">Colores disponibles:</label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button 
                    key={color.id}
                    className={`w-8 h-8 border-2 ${selectedColor === color.id ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.code_color }}
                    onClick={() => handleColorSelect(color.id)}
                  >
                    {selectedColor === color.id && <span className="text-white">✓</span>}
                  </button>
                ))}
              </div>
            </div>

          </div>
          <div className="mb-4 flex items-center space-x-2">
            <label className="text-2xl" htmlFor="quantity">
              Cantidad:
            </label>
            <input
              type="number"
              step="1"
              min="1"
              id="quantity"
              className="h-10 p-2 text-xl border-b-2 border-slate-100 focus:border-zinc-500 outline-none w-20"
              name="quantity"
              placeholder="Cantidad"
              value={quantityDP}
              onChange={handleChangeQuantity}
            />
          </div>
          <button
            type="button"
            className="w-full md:w-3/5 md:h-12 bg-zinc-600 hover:bg-zinc-800 text-white md:ml-36 md:mt-8 p-3 uppercase font-bold rounded"
            onClick={() => {
              handleQuantityCustomers({ ...product, price, selectedColor, selectedSize }, quantityDP);
            }}
          >
            Comprar
          </button>
        </div>
      </div>

      <div className="bg-white p-6">
        <div className='w-full text-center mb-4'>
          <span
            className='text-zinc-600 underline cursor-pointer'
            onClick={handleCommentButtonClick}
          >
            {showComment ? 'Cerrar marco de reseña' : 'Crear Reseñas'}
          </span>
        </div>

        {showComment && (
          <div className='w-full bg-gray-100 p-4 rounded mb-6 max-w-3xl mx-auto'>
            <form onSubmit={handleSubmit} noValidate>
              <div className='flex flex-col'>
                <textarea
                  id="comment"
                  className="bg-white p-3 border border-gray-400 focus:border-zinc-500 outline-none rounded mb-2"
                  name="comment"
                  placeholder="Escribe tu comentario aquí"
                  ref={commentRef}
                  rows="4"
                />
                <input
                  type="submit"
                  value="Enviar"
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold cursor-pointer py-3 px-6 mx-auto"
                />
              </div>
            </form>
          </div>
        )}

        {comments.length > 0 ? (
          <div className="comments-section p-3 bg-gray-100 rounded max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Reseñas</h3>
            {comments.map(comment => (
              <div key={comment.id} className="comment mt-4 p-3 border-b border-gray-200 grid grid-cols-2 gap-4">
                <p className="font-bold">{comment.user.name}</p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay comentarios aún.</p>
        )}
      </div>

      <Link to={`/productsList`} className="p-2 mt-4 inline-block bg-gray-800 text-white rounded px-4 py-2">
        Volver atrás
      </Link>
    </>
  );
}
