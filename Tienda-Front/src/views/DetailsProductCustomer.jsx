import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useQuisco from "../hooks/useQuiosco";
import { useAuth } from "../hooks/useAuth";

export default function DetailsProduct() {
  const location = useLocation();
  const { product, imageProduct } = location.state || {};
  const [showComment, setShowComment] = useState(false);
  const [firtsSearch, setFirtsSearch] = useState(false);

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
      setSizes(data.sizes);
      setColors(data.colors);
      setProducts(data.products);
    };

    fetchComments();
    fetchSizesAndColors();
  }, [productCode, firtsSearch]);



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

  const handleSizeChange = async (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);

    // Fetch updated colors based on the new size
    const data = await GetProductsByCode(productCode, setErrores, { size_id: newSize });
    setColors(data.colors);
    setProducts(data.products);
    setSelectedColor(null); // Reset selected color
  };
  console.log("El valor de products tras handleSizeChange es", products);
  console.log("El valor de colors tras handleSizeChange es", colors);
  console.log("El valor de sizes tras handleSizeChange es", sizes);

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);

    // Fetch updated sizes based on the new color
    const data = await GetProductsByCode(productCode, setErrores, { color_id: newColor });
    setSizes(data.sizes);
    setProducts(data.products);
    setSelectedSize(null); // Reset selected size

    console.log("El valor de products tras handleColorChange es", products);
    console.log("El valor de colors tras handleColorChange es", colors);
    console.log("El valor de sizes tras handleColorChange es", sizes);

  };

  const handleSearch = async (e) => {
    setFirtsSearch(true);

  };




  return (
    <>
      <div className="flex text-zinc-500 p-3 bg-white">
        <div className="w-1/2 p-2">
          <h3 className="text-4xl font-black md:m-12">{product.name}</h3>
          <img src={imageProduct} className='md:w-[33rem] md:h-[40rem] md:ml-28'/>
        </div>
        <div className="w-1/2 p-2 md:mt-24 md:ml-12">
          <div className="p-3">
            <h3 className="text-3xl font-black">{product.name}</h3>
            <p className="mt-5 text-2xl md:ml-2">Precio: ${price.toFixed(2)}</p>
            <p className="mt-5 text-2xl md:ml-2">Descripción: {product.description}</p>
            <div className="mt-5 text-2xl md:ml-2">
              <label htmlFor="size">Tallas disponibles:</label>
              <select id="size" className="ml-2" value={selectedSize || ''} onChange={handleSizeChange}>
                <option value="">Seleccionar Talla</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-5 text-2xl md:ml-2">
              <label htmlFor="color">Colores disponibles:</label>
              <select id="color" className="ml-2" value={selectedColor || ''} onChange={handleColorChange}>
                <option value="">Seleccionar Color</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSearch}>
              Borrar filtrado
          </button>
          </div>
          <div className="mb-4">
            <label className="md:mt-8 md:ml-5 text-2xl" htmlFor="quantity">
              Cantidad:
            </label>
            <input
              type="number"
              step="1"
              min="1"
              id="quantity"
              className="h-6 p-3 text-xl border-b-2 border-slate-100 focus:border-zinc-500 outline-none"
              name="quantity"
              placeholder="Cantidad del producto"
              value={quantityDP}
              onChange={handleChangeQuantity}
            />
          </div>
          <button
            type="button"
            className="md:w-3/5 md:h-28 bg-zinc-600 hover:bg-zinc-800 text-white md:ml-36 md:mt-8 p-3 uppercase font-bold"
            onClick={() => {
              handleQuantityCustomers({ ...products[0], price }, quantityDP);
            }}
          >
            Comprar
          </button>
        </div>
      </div>

      <div className="bg-white p-6">
        <div className='w-full text-center mb-4'>
          <button
            className='bg-gray-800 text-white px-4 py-2 rounded'
            onClick={handleCommentButtonClick}
          >
            {showComment ? 'Ocultar Formulario de Comentarios' : 'Mostrar Formulario de Comentarios'}
          </button>
        </div>

        {showComment && (
          <div className='w-full bg-gray-100 p-4 rounded mb-6'>
            <form onSubmit={handleSubmit} noValidate>
              <div className='flex flex-col'>
                <textarea
                  id="comment"
                  className="bg-white p-3 border border-gray-400 focus:border-zinc-500 outline-none rounded mb-2"
                  name="comment"
                  placeholder="Escribe tu comentario aquí"
                  ref={commentRef}
                />
                <input
                  type="submit"
                  value="Enviar"
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold cursor-pointer p-2"
                />
              </div>
            </form>
          </div>
        )}

        {comments.length > 0 ? (
          <div className="comments-section p-3 bg-gray-100 rounded">
            <h3 className="text-2xl font-bold mb-4">Comentarios</h3>
            {comments.map(comment => (
              <div key={comment.id} className="comment mt-4 p-3 border-b border-gray-200">
                <p><strong>{comment.user.name}:</strong> {comment.content}</p>
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
