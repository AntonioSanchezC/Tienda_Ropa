import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import useQuiosco from "../hooks/useQuiosco";

export default function DetailsProduct() {
    const location = useLocation();
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

    const { GetSizesColorsImages } = useAuth({
        middleware: 'auth',
        url: '/'
    });
    const { handleQuantityCustomers } = useQuiosco();

    const productCode = product.product_code;

    const formatImageUrl = (url) => {
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            return url;
        }
        return `http://localhost/${url}`;
    };

    const [imageProducts, setImageProducts] = useState(
        formatImageUrl(initialImageProduct)
    );

    useEffect(() => {
        const fetchSizesColorsImages = async () => {
            const data = await GetSizesColorsImages(productCode, setErrores);
            console.log("El valor de data en GetSizesColorsImages es ", data);

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

        fetchSizesColorsImages();
    }, [productCode]);

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
        console.log("El valor de imageProducts después de la actualización es ", imageProducts);
    }, [imageProducts]);

    const handleSizeSelect = (sizeId) => {
        setSelectedSize(sizeId);
        setSelectedColor(null);
    };

    const handleColorSelect = (colorId) => {
        setSelectedColor(colorId);
        const selectedProduct = products.find(prod =>
            prod.sizes.some(size => size.id === selectedSize) &&
            prod.colors.some(color => color.id === colorId)
        );
        if (selectedProduct && selectedProduct.imgs && selectedProduct.imgs.length > 0) {
            setImageProducts(formatImageUrl(selectedProduct.imgs[0].image));
        }
        console.log("El valor de selectedProduct en handleColorSelect es ", selectedProduct);
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
            handleQuantityCustomers({ ...selectedProduct, price: parseFloat(product.price), selectedColor, selectedSize }, quantityDP);
        } else {
            setErrores(["No se encontró el producto con la combinación de talla y color seleccionados."]);
        }
    };

    return (
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
                    <p className="mt-5 text-2xl md:ml-2">Precio: ${parseFloat(product.price).toFixed(2)}</p>
                    <p className="mt-5 text-2xl md:ml-2">Descripción: {product.description}</p>
                    <div className="mt-5 text-2xl md:ml-2">
                        <label  className="block font-bold">Tallas disponibles:</label>
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
                    <label className="text-2xl" >
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
                    className="w-full md:w-3/5 md:h-12 bg-zinc-600 hover:bg-zinc-800 text-white mt-3 p-3 uppercase font-bold rounded-md md:m-6"
                    onClick={handleBuyButtonClick}
                >
                    Comprar
                </button>
            </div>
        </div>
    );
}
