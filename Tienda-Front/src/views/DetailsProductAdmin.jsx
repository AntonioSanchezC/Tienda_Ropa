import { useLocation } from 'react-router-dom';
import useQuisco from "../hooks/useQuiosco";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { useAuth } from "../hooks/useAuth";
import '../styles/details.css';

export default function DetailsProductAdmin() {
    const location = useLocation();
    const { product } = location.state || {};
    const {
        categories,
        subCategories,
        subCategoriesC,
        obtenerSubCategoriasPorCategoria, 
        imgProduct,
        idImgProduct,
    } = useQuisco();

    const [errores, setErrores] = useState([]);
    const { updateProduct } = useAuth({
        middleware: 'auth',
        url: '/'
    });

    // Filtro del select de subCategories 
    const [selectSubcategory, setSelectSubcategory] = useState("");
    const [selectCategoryId, setSelectCategoryId] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imgRelated, setImgRelated] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const baseURL = import.meta.env.VITE_API_URL;

    const handleChangeCategoria = (e) => {
        const tipoCategoriaSeleccionada = e.target.value;
        obtenerSubCategoriasPorCategoria(parseInt(tipoCategoriaSeleccionada));
    
        const categoriaSeleccionada = categories.find(
            (category) => category.id === parseInt(tipoCategoriaSeleccionada)
        );
        if (categoriaSeleccionada) {
            setSelectCategoryId(categoriaSeleccionada.id);
            setSelectSubcategory("");
        }
    };

    const handleChangeSubcategory = (e) => {
        const subcategoriaSeleccionada = e.target.value;
        setSelectSubcategory(subcategoriaSeleccionada);
    };

    useEffect(() => {
        if (product && product.sub_categories_id !== undefined) {
            const selectedSubcategoryC = subCategoriesC.find(subCategory => subCategory.id === product.sub_categories_id);
            if (selectedSubcategoryC) {
                setSelectedSubcategoryId(selectedSubcategoryC.id);
                setSelectedSubcategory(selectedSubcategoryC);
            }

            const selectedCategoryC = categories.find(category => category.id === selectedSubcategoryC.parent_category_id);
            setSelectedCategory(selectedCategoryC);

            const imgProductForProducto = imgProduct.find((imgP) => imgP.product_id === product.id);
            const key = imgProductForProducto ? `${product.id}_${imgProductForProducto.img_id}` : '';
            const imgRelated = key && idImgProduct[key];

            setImgRelated(imgRelated);
            if (imgRelated && imgRelated.image) {
                const imgURL = `${baseURL}/${imgRelated.image}`;
                setPreviewImage(imgURL);
            }
        }
    }, [product, subCategoriesC, categories, imgProduct, idImgProduct, baseURL]);

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        open,
    } = useDropzone({
        accept: ['.png', '.jpg', '.jpeg', '.gif'],
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                const objectURL = URL.createObjectURL(file);
                setPreviewImage(objectURL);
            }
        },
        onDropRejected: (fileRejections) => {
            console.log(fileRejections);
        },
    });

    const idRef = useRef();
    const nameRef = useRef();
    const genderRef = useRef();
    const priceRef = useRef();
    const quantityRef = useRef();
    const dispRef = useRef();
    const noveRef = useRef();
    const descriptionRef = useRef();
    const subCateRef = useRef();
    const productCodeRef = useRef();

    useEffect(() => {
        if (product) {
            idRef.current.value = product.id;
            nameRef.current.value = product.name;
            genderRef.current.value = product.gender;
            priceRef.current.value = product.price;
            quantityRef.current.value = product.quantity;
            dispRef.current.checked = product.available === 1;
            noveRef.current.checked = product.novelty === 1;
            descriptionRef.current.value = product.description;
            subCateRef.current.value = product.sub_categories_id;
            productCodeRef.current.value = product.product_code;
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const subcategoriaSeleccionada = subCateRef.current.value;
        const subCategoriaId = subcategoriaSeleccionada || selectedSubcategoryId;

        const datos = {
            id: idRef.current.value,
            name: nameRef.current.value,
            gender: genderRef.current.value,
            price: priceRef.current.value,
            available: dispRef.current.checked ? 1 : 0,
            description: descriptionRef.current.value,
            quantity: quantityRef.current.value,
            sub_categories_id: subCategoriaId,
            novelty: noveRef.current.checked ? 1 : 0,
            product_code: productCodeRef.current.value,
        };
      
        const formData = new FormData();
        formData.append("id", datos.id);
        formData.append("name", datos.name);
        formData.append("gender", datos.gender);
        formData.append("price", datos.price);
        formData.append("available", datos.available);
        formData.append("description", datos.description);
        formData.append("sub_categories_id", datos.sub_categories_id);
        formData.append("novelty", datos.novelty);
        formData.append("quantity", datos.quantity);
        formData.append("product_code", datos.product_code);

        if (acceptedFiles.length > 0) {
            formData.append("file", acceptedFiles[0]);
            formData.append("prevImage", imgRelated?.image);
        } else {
            formData.append("prevImage", previewImage);
        }

        updateProduct(formData, setErrores);
    };

    return (
        <div className='mt-8 p-6 shadow-2xl rounded-lg md:m-5 overflow-hidden'>
            <h2 className="text-4xl text-gray-500 font-black pb-4">Detalles de producto</h2>
            <div className="bg-gradient-to-r from-slate-500 to-cyan-500 h-px md:mt-4"></div>
            <div className="flex flex-col md:flex-row">
                <form 
                    onSubmit={handleSubmit}
                    noValidate
                    encType="multipart/form-data"
                    className="w-full p-2"
                >
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 pr-4 mt-10">
                            <div className="p-3">
                                {product && (
                                    <>
                                        <input type="hidden" name="product" ref={idRef} />
                                        <div className="mb-4">
                                            <label className="text-slate-800" htmlFor="name">Nombre:</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                                name="name"
                                                placeholder="Nombre del producto"
                                                ref={nameRef}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800" htmlFor="gender">Género:</label>
                                            <input
                                                type="text"
                                                id="gender"
                                                className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                                name="gender"
                                                placeholder="Género del producto"
                                                ref={genderRef}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800" htmlFor="price">Precio:</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="price"
                                                className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                                name="price"
                                                placeholder="Precio del producto"
                                                ref={priceRef}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800" htmlFor="quantity">Cantidad:</label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                                name="quantity"
                                                placeholder="Cantidad del producto"
                                                ref={quantityRef}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800">Disponibilidad:</label>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="available"
                                                        value="1"
                                                        ref={dispRef}
                                                    />{" "}
                                                    Disponible
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="available"
                                                        value="0"
                                                        ref={dispRef}
                                                    />{" "}
                                                    No disponible
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800" htmlFor="description">Descripción:</label>
                                            <textarea
                                                id="description"
                                                className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                                name="description"
                                                placeholder="Descripción del producto"
                                                ref={descriptionRef}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800" htmlFor="product_code">Código de Producto:</label>
                                            <input
                                                type="text"
                                                id="product_code"
                                                className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                                name="product_code"
                                                placeholder="Código del producto"
                                                ref={productCodeRef}
                                            />
                                        </div>
                                        <div className="mb-4">
                                        <p>La categoría seleccionada es: {selectedCategory ? selectedCategory.name : 'Cargando...'}</p>
                                       
                                        <select
                                          id="category"
                                          className="mt-2 w-full p-3 bg-gray-50"
                                          name="category"
                                          htmlFor="category"
                                          onChange={handleChangeCategoria}
                        
                                      >
                                        <option value="" disabled selected >
                                        {selectedCategory ? selectedCategory.name : 'Cargando...'}
                                        </option>
                                        {categories.map(category => (
                                          
                                          <option 
                                            key={category.id} 
                                            value={category.id}
                                            
                                          >
                                          { category.name}                  
                                          </option>
                                        ))}
                                    </select>
                       <p>La subcategoría seleccionada es: {selectedSubcategory.name}</p>

                       <select
                         id="subcate"
                         className="mt-2 w-full p-3 bg-gray-50"
                         name="subcate"
                         htmlFor="subcate"
                         ref={subCateRef}
                         onChange={handleChangeSubcategory}
         
                       >
         
     
                       <option value="" disabled selected >
                       {selectedSubcategory ? selectedSubcategory.name : 'Cargando...'}
                       </option>
           
                       {subCategories
                         .filter((sub) => sub.parent_category_id === selectCategoryId)
                         .map((sub) => (
                           <option 
                             key={sub.id} 
                             value={sub.id}
                             >
                             {sub.name}
                           </option>
                         ))}

                     </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-slate-800">Novedad:</label>
                                            <div>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="novelty"
                                                        ref={noveRef}
                                                    />{" "}
                                                    Novedad
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2 pr-4 mt-10">
                            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}>
                                <input {...getInputProps()} />
                                <p>
                                    Arrastra y suelta una imagen aquí, o haz clic para seleccionar una imagen
                                </p>
                                {previewImage && (
                                    <div className="mt-4">
                                        <img src={previewImage} alt="Imagen previa" className="w-full h-auto rounded-lg" />
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={open} className="mt-4 p-3 bg-blue-500 text-white rounded-lg">Seleccionar archivo</button>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            className="p-3 bg-amber-400 text-white uppercase font-bold rounded-lg"
                        >
                            Actualizar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
