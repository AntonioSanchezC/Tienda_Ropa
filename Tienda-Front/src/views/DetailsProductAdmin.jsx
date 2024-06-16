import { Link, useLocation } from 'react-router-dom';
import useQuisco from "../hooks/useQuiosco"
import clienteAxios from '../config/axios';
import { useState, useRef, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { useAuth } from "../hooks/useAuth";

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
    const [selectSubcategory, setSelectSubcategory] = useState("");// Constante que almacena el tipo de la subcategoria
    const [selectCategoryId, setSelectCategoryId] = useState(""); // Nueva constante que almacena el id de la categoria
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(""); // Estado para el ID de la subcategoría seleccionada
    const [selectedSubcategory, setSelectedSubcategory] = useState({}); // Estado para la subcategoría seleccionada
    const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la subcategoría seleccionada
    const [imgRelated, setImgRelated] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const baseURL = 'http://localhost'; 


    //handleChangeCategoria va a alamacenar el tipo de categoria y va a enviar a handleChangeSubcategoria
    const handleChangeCategoria = (e) => {
  
      const tipoCategoriaSeleccionada = e.target.value;
      obtenerSubCategoriasPorCategoria(parseInt(tipoCategoriaSeleccionada));
    
      const categoriaSeleccionada = categories.find(
        (category) => category.id === parseInt(tipoCategoriaSeleccionada)
      );
      if (categoriaSeleccionada) {
        setSelectCategoryId(categoriaSeleccionada.id);
        setSelectSubcategory(""); // Reiniciar la subcategoría cuando cambie la categoría
      }
    
    
    
    
      
    };
    // handleChangeSubcategoria va a mostrar en el select el resultado dado en setSelectedSubcategory
    const handleChangeSubcategory = (e) => {
      const subcategoriaSeleccionada = e.target.value;
      setSelectSubcategory(subcategoriaSeleccionada);
    
    };





    useEffect(() => {
      if (product && product.sub_categories_id !== undefined) {
      // Buscar la subcategoría correspondiente a product.sub_categories_id
      const selectedSubcategoryC = subCategoriesC.find(subCategory => subCategory.id === product.sub_categories_id);
      // Si se encuentra la subcategoría, establecer el estado selectedSubcategoryId



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
          // Establecer la URL de la imagen relacionada en previewImage si existe
    if (imgRelated && imgRelated.image) {
      const imgURL = `${baseURL}/${imgRelated.image}`;
      setPreviewImage(imgURL);
    }
    }

    }, [product, subCategoriesC]);

    const {
      acceptedFiles,
      getRootProps,
      getInputProps,
      isDragActive,
      open,
      removeFile,
    } = useDropzone({
      accept: ['.png', '.jpg', '.jpeg', '.gif'],
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        // Muestra la primera imagen en la vista previa
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          const objectURL = URL.createObjectURL(file);
          setPreviewImage(objectURL);
        } 
      },
      onDropRejected: (fileRejections) => {
        // Maneja rechazos de archivos aquí
        console.log(fileRejections);
      },
    });
    console.log("El valor de previewImage en DetailsProductAdmin es ", previewImage);
    const idRef = useRef();
    const nameRef = useRef();
    const priceRef = useRef();
    const quantityRef = useRef();
    const dispRef = useRef();
    const noveRef = useRef();
    const descriptionRef = useRef();
    const sizeRef = useRef();
    const colorRef = useRef();
    const subCateRef = useRef();
    const entityRef = useRef();


    const handleSubmit = async (e) => {
      e.preventDefault();
  
  // Obtener el ID de la subcategoría actual
  const subcategoriaSeleccionada = subCateRef.current.value;
  const subCategoriaId = subcategoriaSeleccionada || selectedSubcategoryId;

  const datos = {
    id: idRef.current.value,
    name: nameRef.current.value,
    price: priceRef.current.value,
    disp: dispRef.current.checked ? 0 : 1,
    description: descriptionRef.current.value,
    size: sizeRef.current.value,
    color: colorRef.current.value,
    quantity: quantityRef.current.value,
    subcate: subCategoriaId,
    nove: noveRef.current.checked ? 0 : 1,
    entity: entityRef.current.value,
  };
  
      // Si se ha seleccionado un archivo, enviarlo junto con otros datos
      const formData = new FormData();
      formData.append("id", datos.id);
      formData.append("name", datos.name);
      formData.append("price", datos.price);
      formData.append("disp", datos.disp);
      formData.append("description", datos.description);
      formData.append("subcate", datos.subcate);
      formData.append("novelty", datos.nove);
      formData.append("size", datos.size);
      formData.append("color", datos.color);
      formData.append("quantity", datos.quantity);
      formData.append("entity", datos.entity);

      if (acceptedFiles.length > 0) {
        formData.append("file", acceptedFiles[0]);
        formData.append("prevImage", imgRelated.image);

      } else {
        // Si no hay un archivo nuevo, enviar la ruta de la imagen previa para eliminarla
        formData.append("prevImage", previewImage);
      }
      
      console.log("name:", formData.get("name"));
      console.log("price:", formData.get("price"));
      console.log("disp:", formData.get("disp"));
      console.log("description:", formData.get("description"));
      console.log("subcate:", formData.get("subcate"));
      console.log("novelty:", formData.get("novelty"));
      console.log("size:", formData.get("size"));
      console.log("color:", formData.get("color"));
      console.log("quantity:", formData.get("quantity"));
      console.log("file:", formData.get("file"));
      console.log("prevImage:", formData.get("prevImage"));
      console.log("entity:", formData.get("entity"));

      updateProduct(formData, setErrores);

    };


    return (
        <>
        <h3 className="text-5xl font-black md:mt-8">Detalles de producto</h3>

          <div className="flex">

            <form 
              onSubmit={handleSubmit}
              noValidate
              encType="multipart/form-data"
              className="w-full p-2 "
              
              >
            <div className="flex items-start pr-4">
            <div className="w-1/2 pr-4 mt-10">

              <div className=" p-3  ">
                {product && (
                  <>
                  <div className="mb-4">
                  <input
                    type="hidden"
                    name="product"
                    defaultValue={product.id}
                    ref={idRef}
      
                  />

                    <label className="text-slate-800" htmlFor="name">
                      Nombre:
                    </label>
                    <input
                    defaultValue={product.name}
                      type="text"
                      id="name"
                      className="mt-2 w-full p-3 bg-gray-50"
                      name="name"
                      placeholder="Tu Nombre"
                      ref={nameRef}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-slate-800" htmlFor="price">
                      Precio:
                    </label>
                    <input
                    defaultValue={product.price}
                      type="number"
                      step="0.01"
                      id="price"
                      className="mt-2 w-full p-3 bg-gray-50"
                      name="price"
                      placeholder="Precio del producto"
                      ref={priceRef}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-slate-800" htmlFor="quantity">
                      Cantidad:
                    </label>
                    <input
                    defaultValue={product.quantity}
                      type="quantity"
                      step="0.01"
                      id="price"
                      className="mt-2 w-full p-3 bg-gray-50"
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
                        name="disp"
                        value="1" // Cambia 'true' a '1'
                        defaultChecked={product.available === 1} // Si el producto está disponible, marca el checkbox
                        ref={dispRef}
                      />{" "}
                      Disponible
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="disp"
                        value="0" // Cambia 'false' a '0'
                        defaultChecked={product.available === 0} // Si el producto está disponible, marca el checkbox
                        ref={dispRef}
                      />{" "}
                      No disponible
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-800">¿Es una novedad?:</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="nove"
                        value="1" // Cambia 'true' a '1'
                        defaultChecked={product.novelty === 1} // Si el producto está disponible, marca el checkbox
                        ref={noveRef}
                      />{" "}
                      Novedad
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="nove"
                        value="0" // Cambia 'false' a '0'
                        defaultChecked={product.novelty === 0} // Si el producto no está disponible, marca el checkbox
                        ref={noveRef}
                      />{" "}
                      No es novedad
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-800" htmlFor="description">
                    Descripción:
                  </label>
                  <input
                  defaultValue={product.description}
                    type="text"
                    id="description"
                    className="mt-2 w-full p-3 bg-gray-50"
                    name="description"
                    placeholder="Descripción de producto"
                    ref={descriptionRef}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-slate-800" htmlFor="size">
                    Talla:
                  </label>
                  <input
                  defaultValue={product.size}
                    type="text"
                    id="size"
                    className="mt-2 w-full p-3 bg-gray-50"
                    name="size"
                    placeholder="Talla de producto"
                    ref={sizeRef}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-slate-800" htmlFor="color">
                    Color:
                  </label>
                  <input
                  defaultValue={product.color}
                    type="text"
                    id="color"
                    className="mt-2 w-full p-3 bg-gray-50"
                    name="color"
                    placeholder="Color de producto"
                    ref={colorRef}
                  />
                </div>


                  </>
                )}
              </div>
              </div>

              <div className="w-1/2 pr-4 mt-14">

              <p>La categoría seleccionada es: {selectedCategory ? selectedCategory.name : 'Cargando...'}</p>
                <select
                  id="category"
                  className="mt-2 w-full p-3 bg-gray-50"
                  name="category"
                  htmlFor="category"
                  onChange={handleChangeCategoria}

              >
                <option value="" disabled selected >
                  Seleccione una categoría
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
                Seleccione una subcategoría
              </option>
  
              {subCategories
                .filter((sub) => sub.parent_category_id === selectCategoryId)
                .map((sub, index) => (
                  <option 
                    key={sub.id} 
                    value={sub.id}
                    >
                    {sub.name}

                  </option>
                ))}
            </select>
  
  

            <div className="mb-4">
            <label className="text-slate-800" htmlFor="image">
              Añadir Imagen:
            </label>
            <div {...getRootProps()} className="dropzone">
              <input type="file" name="file" {...getInputProps()} />
                {acceptedFiles.length > 0 ? (
                  acceptedFiles.map((file) => (
                    <div key={file.name}>
                      <p>Archivo seleccionado: {file.name}</p>
                      <button onClick={() => removeFile(file)}>
                        Eliminar archivo
                      </button>
                    </div>
                  ))
                ) : isDragActive ? (
                  <p>Suelta los archivos aquí...</p>
                ) : (
                  <p>Arrastra y suelta archivos aquí o haz clic para subir.</p>
                )}
              </div>
              {previewImage && <img src={previewImage} alt="Vista previa" className="md:ml-12 md:w-[20rem] md:h-[25rem]" />}
              </div>
            </div>

            <input
              type="hidden"
              name="product"
              value="product"
              ref={entityRef}

            />
      


            </div>

              <input
              type="submit"
              value="Actualizar Producto"
              className="bg-white w-full hover:bg-zinc-700 text-black hover:text-white md:mt-12 p-0 uppercase font-bold cursor-pointer md:h-16"
              />
            </form>
          </div>
          <Link to={`/admin/products`} className=" p-2 ">
            Volver a la página inicial
          </Link>
        </>
    )
}
