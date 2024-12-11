import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import useQuiosco from "../hooks/useQuiosco";

export default function DetailsProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, imageProduct: initialImageProduct } = location.state || {};
    const [showComment, setShowComment] = useState(false);
    const [products, setProducts] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantityDP, setQuantityDP] = useState(1);
    const [comments, setComments] = useState([]);
    const [errores, setErrores] = useState([]);

    const { user, commentInsert, commentGet, GetSizesColorsImages, commentComprobant, setCommentComprobant } = useAuth();
    const { handleQuantityCustomers } = useQuiosco();

    const productCode = product.name;
    const baseURL = import.meta.env.VITE_API_URL;

    const formatImageUrl = (url) => {
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            return url;
        }
        return `${baseURL}/${url}`;
    };

    const [imageProducts, setImageProducts] = useState(formatImageUrl(initialImageProduct));
    const actualProductPrice = product.discountedPrice ?? product.price;  
    // Usa el precio con descuento si está presente
    const [priceProducts, setPriceProducts] = useState(actualProductPrice);
    const [codeProduct, setCodeProduct] = useState(product.product_code);

    

    useEffect(() => {
        if (selectedSize) {
            const filteredColors = products
                .filter(prod => prod.sizes.some(size => size.id === selectedSize))
                .flatMap(prod => prod.colors)
                .filter((color, index, self) => self.findIndex(c => c.id === color.id) === index);
            setColors(filteredColors);
        }
    }, [selectedSize, products]);

    useEffect(() => {
        const fetchComments = async () => {
            const comments = await commentGet(product.id, setErrores);
            setComments(comments);
        };
        fetchComments();
    }, [commentComprobant]);

    const handleSizeSelect = (sizeId) => {
        setSelectedSize(sizeId);
        
        setSelectedColor(null);
        // Filter colors available for the selected size
        const filteredColors = products
            .filter(prod => prod.sizes.some(size => size.id === sizeId))
            .flatMap(prod => prod.colors)
            .filter((color, index, self) => self.findIndex(c => c.id === color.id) === index);
        
        setColors(filteredColors);
        
        // If the previously selected color is not available for the new size, select the first available color
        if (filteredColors.length > 0) {
            const newSelectedColor = filteredColors[0].id; // Set the first available color
            setSelectedColor(newSelectedColor);
            
            // Update image and price based on the new selected color and size
            const selectedProduct = products.find(prod =>
                prod.sizes.some(size => size.id === sizeId) &&
                prod.colors.some(color => color.id === newSelectedColor)
            );
            
            if (selectedProduct && selectedProduct.imgs && selectedProduct.imgs.length > 0) {
                setImageProducts(formatImageUrl(selectedProduct.imgs[0].image));
                setPriceProducts(selectedProduct.discountedPrice ?? selectedProduct.price); // Keep discounted price if available
            }
        }
    };
    
    const handleColorSelect = (colorId) => {

        setSelectedColor(colorId);
        const selectedProduct = products.find(prod =>
            prod.sizes.some(size => size.id === selectedSize) &&
            prod.colors.some(color => color.id === colorId)
        );
        if (selectedProduct && selectedProduct.imgs && selectedProduct.imgs.length > 0) {
            setImageProducts(formatImageUrl(selectedProduct.imgs[0].image));
            setPriceProducts(product.discountedPrice ?? selectedProduct.price);
            setCodeProduct(selectedProduct.product_code??product.product_code);
        }
    };
    
    
    
    const handleChangeQuantity = (event) => {
        setQuantityDP(event.target.value);
    };

    const handleBuyButtonClick = () => {
        const selectedProduct = products.find(prod =>
            prod.sizes.some(size => size.id === selectedSize) &&
            prod.colors.some(color => color.id === selectedColor)
        );
        if (selectedProduct) {
            handleQuantityCustomers({ ...selectedProduct, price: parseFloat(priceProducts), selectedColor, selectedSize }, quantityDP);
        } else {
            setErrores(["No se encontró el producto con la combinación de talla y color seleccionados."]);
        }
    };

    const handleCommentButtonClick = () => {
        setShowComment(!showComment);
    };

    const commentRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datos = {
            user_id: user.id,
            product_id: product.id,
            comment: commentRef.current.value,
        };
        await commentInsert(datos, setErrores);
        setShowComment(false);
        commentRef.current.value = '';
        setCommentComprobant(true);  
    };

        
    useEffect(() => {
        const fetchSizesColorsImages = async () => {
            const data = await GetSizesColorsImages(productCode, setErrores);
            const uniqueSizes = new Set();
            
            data.products.forEach(prod => {
                if (prod.sizes) {
                    prod.sizes.forEach(size => {
                        uniqueSizes.add(size.id);
                    });
                }
            });
            
            const sizesArray = Array.from(uniqueSizes).map(sizeId => {
                return data.products
                    .flatMap(prod => (prod.sizes || [])) // Asegura que 'prod.sizes' no sea undefined
                    .find(size => size.id === sizeId);
            });
            
            setSizes(sizesArray);
            setProducts(data.products);
    
            // Validar que product y sus propiedades estén definidos antes de establecer el tamaño y color
            if (sizesArray.length > 0 && product?.sizes?.length > 0) {
                setSelectedSize(product.sizes[0]?.id); // Toma el ID de la primera talla del producto
            }
    
            if (data.products.length > 0 && product?.colors?.length > 0) {
                setSelectedColor(product.colors[0]?.id); // Toma el ID del primer color del primer producto
            }
        };
    
        // Solo ejecutar fetchSizesColorsImages si productCode está definido
        if (productCode) {
            fetchSizesColorsImages();
        }
    }, [productCode, product]); // Incluye 'product' como dependencia en el useEffect
    
    return (
        <>
            <div className="flex text-zinc-500 p-3 bg-white font-playfair">
                <div className="w-1/2 p-2">
                    <h3 className="text-4xl font-black md:m-12">{product.name}</h3>
                    <div className="relative w-full h-[40rem] max-w-[33rem] mx-auto">
                        <img
                            src={imageProducts}
                            className="w-full h-full object-cover object-top"
                            alt={product.name}
                        />
                    </div>
                </div>
                <div className="md:w-1/2 p-2 md:mt-24 md:ml-12">
                    <div className="p-3">
                        <h3 className="text-3xl font-black">{product.name}</h3>
                        <p className="mt-5 text-2xl md:ml-2">Precio: {parseFloat(priceProducts).toFixed(2)} €</p>
                        <p className="mt-5 text-2xl md:ml-2">Descripción: {product.description}</p>
                        <p className="mt-5 text-2xl md:ml-2">Codigo producto: {codeProduct}</p>
                        <div className="mt-5 text-2xl md:ml-2">
                            <label className="block font-bold">Tallas disponibles:</label>
                            <div className="flex space-x-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size.id}
                                        id={`size-${size.id}`}
                                        className={`px-4 py-2 border-2 ${selectedSize === size.id ? 'border-black' : 'border-gray-300'}`}
                                        onClick={() => handleSizeSelect(size.id)}
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-5 text-2xl md:ml-2">
                            <label className="block font-bold">Colores disponibles:</label>
                            <div className="flex space-x-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.id}
                                        id={`color-${color.id}`}
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
                        <label className="text-2xl">Cantidad:</label>
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
                        className="w-full md:w-3/5 md:h-12 bg-zinc-600 hover:bg-zinc-800 text-white mt-3 p-3 uppercase font-bold rounded-md md:m-6"
                        onClick={handleBuyButtonClick}
                    >
                        Añadir a la cesta
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
                    user ? (
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
                    ) : (
                        <div className='w-full bg-gray-100 p-4 rounded mb-6 max-w-3xl mx-auto text-center'>
                            <p className="text-red-600">Por favor, inicia sesión para dejar un comentario.</p>
                        </div>
                    )
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

            <button
                onClick={() => navigate(-1)}
                className="p-2 mt-4 inline-block bg-gray-800 text-white rounded px-4 py-2"
            >
                Volver atrás
            </button>
        </>
    );
}
