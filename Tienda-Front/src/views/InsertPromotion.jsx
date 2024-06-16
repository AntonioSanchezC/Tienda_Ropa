import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDropzone } from 'react-dropzone';
import Alerta from "../components/Alerta";

export default function InsertPromotion() {

    const [previewImage, setPreviewImage] = useState(null);
    const [tipe, setTipe] = useState(""); // Estado para almacenar el valor del tipo
    const [status, setStatus] = useState(""); // Estado para almacenar el valor del estado
    
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const {
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
          console.log("El valor de acceptedFiles desde InsertarProductos es ", acceptedFiles[0])
          const file = acceptedFiles[0];
          const objectURL = URL.createObjectURL(file);
          setPreviewImage(objectURL);
          setAcceptedFiles(acceptedFiles); // Actualiza acceptedFiles aquí
        }
      },
      onDropRejected: (fileRejections) => {
        setPreviewImage(null);
        console.log(fileRejections);
      },
    });


    const nameRef = useRef();
    const descriptRef = useRef();
    const discountRef = useRef();
    const entityRef = useRef();

    const [errores, setErrores] = useState([]);
    const { insertPromotion } = useAuth({
      middleware: 'auth',
      url: '/'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Si se ha seleccionado un archivo, enviarlo junto con otros datos
        const formData = new FormData();

            formData.append("name", nameRef.current.value);
            formData.append("description", descriptRef.current.value);
            formData.append("tipe", tipe); // Utilizando el estado tipe directamente
            formData.append("discount", discountRef.current.value);
            formData.append("status", status); // Utilizando el estado estade directamente
            formData.append("file", acceptedFiles[0]);
            formData.append("entity", entityRef.current.value);


            insertPromotion(formData, setErrores);
    };
    const handleClearFields = () => {
        // Limpiar los campos del formulario
        nameRef.current.value = '';
        descriptRef.current.value = '';
        entityRef.current.value = '';
        discountRef.current.value = '';
        const newAcceptedFiles = [...acceptedFiles];
        // Eliminar el primer elemento del array
        newAcceptedFiles.splice(0, 1);
        
        // Actualizar acceptedFiles con el nuevo array vacío
        setAcceptedFiles([]);    
        setPreviewImage(null);
      };

    const setPreviewImageNull = () => {

        // Limpiar la vista previa de la imagen
        setPreviewImage(null);
      };

  return (
    <>
    <h1 className="text-4xl font-black">Promociones de tienda</h1>
    <p>Inserte los datos de la promocion</p>

    <div className=" mt-10 px-5 py-10 flex">
    {errores ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>) : null}
        <form 
            onSubmit={handleSubmit} 
            noValidate 
            encType="multipart/form-data"
        >
        <div className="flex items-start pr-4">
        <div className="w-1/2 pr-4 mx-16">

        <div className="mb-4">
            <label className="text-slate-800" htmlFor="name">
            Nombre:
            </label>
            <input
            type="text"
            id="name"
            className="mt-2 w-full p-3 bg-gray-50"
            name="name"
            placeholder="Tu Nombre"
            ref={nameRef}
            />
        </div>
        
        <div className="mb-4">
            <label className="text-slate-800" htmlFor="description">
            Description:
            </label>
            <input
            type="text"
            id="description"
            className="mt-2 w-full p-3 bg-gray-50"
            name="description"
            placeholder="Descripcion de promocion"
            ref={descriptRef}
            />
        </div>

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
                <button onClick={() => [
                                        setPreviewImageNull(),
                                        removeFile(file),
                                        ]}>
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
          {previewImage && <img src={previewImage} alt="Preview Image" className="md:ml-12 md:w-[20rem] md:h-[25rem]"/>}
      </div>

        </div>
        <div className="w-1/2 pr-4 mx-16">

        <div className="mb-4">
            <label className="text-slate-800">Tipo de la promoción:</label>
            <div>
            <label>
                <input
                type="radio"
                name="tipe"
                value="seasson" 
                onChange={() => setTipe("seasson")} // Actualiza el estado tipe
                />{" "}
                    Temporada
            </label>
            <label>
                <input
                type="radio"
                name="tipe"
                value="sale" 
                onChange={() => setTipe("sale")} // Actualiza el estado tipe
                />{" "}
                    Rebaja
            </label>
            </div>
        </div>
        
        
        <div className="mb-4">
            <label className="text-slate-800" htmlFor="discount">
            ¿Añadir descuento?:
            </label>
            <input
            type="number"
            step="1"
            id="discount"
            className="mt-2 w-full p-3 bg-gray-50"
            name="discount"
            placeholder="Añadir descuento"
            ref={discountRef}
            />
        </div>
                
        <div className="mb-4">
            <label className="text-slate-800">Estado de la promoción:</label>
            <div>
            <label>
                <input
                    type="radio"
                    name="estade"
                    value="1" // Cambia 'true' a '1'
                    onChange={() => setStatus("1")} // Actualiza el estado estade
                    />{" "}
                Activo
            </label>
            <label>
                <input
                    type="radio"
                    name="estade"
                    value="0" // Cambia 'false' a '0'
                    onChange={() => setStatus("0")} // Actualiza el estado estade
                    />{" "}
                Inactivo
            </label>
            </div>
        </div>
        </div>

        <input
        type="hidden"
        name="promotion"
        value="promotion"
        ref={entityRef}

      />
      </div>

        
      <div className="flex">
      <input
        type="submit"
        value="Subir Promocion"
        className="bg-white w-1/2 hover:bg-zinc-700 text-black hover:text-white md:mt-12 p-0 uppercase font-bold cursor-pointer md:h-16"

      />
      <input
        type="button"
        value="Borrar campos"
        onClick={handleClearFields}
        className="bg-red-500 w-1/2 md:h-16 text-white px-4 py-2 md:mt-12 hover:bg-red-600"
      />
    </div>
        
        </form>
    </div>
    </>
  )
}
