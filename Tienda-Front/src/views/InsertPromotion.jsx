import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDropzone } from 'react-dropzone';
import Alerta from "../components/Alerta";
import '../styles/details.css'; // Estilo importado

export default function InsertPromotion() {
    const [previewImage, setPreviewImage] = useState(null);
    const [tipe, setTipe] = useState("");
    const [status, setStatus] = useState("");
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const { getRootProps, getInputProps, isDragActive, open, removeFile } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
          },        
          maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                const objectURL = URL.createObjectURL(file);
                setPreviewImage(objectURL);
                setAcceptedFiles(acceptedFiles);
            }
        },
        onDropRejected: (fileRejections) => {
            setPreviewImage(null);
        },
    });

    const nameRef = useRef();
    const genderRef = useRef(null);
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

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("description", descriptRef.current.value);
        formData.append("gender", document.querySelector('input[name="gender"]:checked').value);
        formData.append("tipe", tipe);
        formData.append("discount", discountRef.current.value);
        formData.append("status", status);
        formData.append("file", acceptedFiles[0]);
        formData.append("entity", entityRef.current.value);

        insertPromotion(formData, setErrores);
    };

    const handleClearFields = () => {
        nameRef.current.value = '';
        descriptRef.current.value = '';
        entityRef.current.value = '';
        discountRef.current.value = '';
        setAcceptedFiles([]);
        setPreviewImage(null);
    };

    const setPreviewImageNull = () => {
        setPreviewImage(null);
    };

    return (
        <>
            <div className='mt-8 p-6 shadow-2xl rounded-lg md:m-5 overflow-hidden'>
                <h2 className="text-4xl text-gray-500 font-black pb-4">Promociones de tienda</h2>
                <div className="bg-gradient-to-r from-slate-500 to-cyan-500 h-px md:mt-4"></div>
                <div className="flex flex-col md:flex-row">
                    <form onSubmit={handleSubmit} noValidate encType="multipart/form-data" className="w-full p-2">
                        <div className="flex items-start pr-4">
                            <div className="w-1/2 pr-4 mx-16">
                                <div className="mb-4">
                                    <label className="text-slate-800" htmlFor="name">Nombre:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                        name="name"
                                        placeholder="Tu Nombre"
                                        ref={nameRef}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="text-slate-800">Sexo desigando:</label>
                                    <div className="mt-2">
                                        <label className="inline-flex items-center">
                                            <input type="radio" name="gender" value="F" ref={genderRef} />
                                            <span className="ml-2">Femenino</span>
                                        </label>
                                        <label className="inline-flex items-center ml-4">
                                            <input type="radio" name="gender" value="M" ref={genderRef} />
                                            <span className="ml-2">Masculino</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-slate-800" htmlFor="description">Descripción:</label>
                                    <input
                                        type="text"
                                        id="description"
                                        className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                        name="description"
                                        placeholder="Descripción de promoción"
                                        ref={descriptRef}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="text-slate-800" htmlFor="image">Añadir Imagen:</label>
                                    <div {...getRootProps()} className="dropzone mt-2">
                                        <input type="file" name="file" {...getInputProps()} />
                                        {acceptedFiles.length > 0 ? (
                                            acceptedFiles.map((file) => (
                                                <div key={file.name} className="flex items-center mt-2">
                                                    <p className="flex-1">Archivo seleccionado: {file.name}</p>
                                                    <button onClick={() => [setPreviewImageNull(), removeFile(file)]} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2">Eliminar archivo</button>
                                                </div>
                                            ))
                                        ) : isDragActive ? (
                                            <p className="mt-2">Suelta los archivos aquí...</p>
                                        ) : (
                                            <p className="mt-2">Arrastra y suelta archivos aquí o haz clic para subir.</p>
                                        )}
                                    </div>
                                    {previewImage && <img src={previewImage} alt="Preview Image" className="mt-4 w-full h-auto rounded-lg" />}
                                </div>
                            </div>
                            <div className="w-1/2 pr-4 mx-16">
                                <div className="mb-4">
                                    <label className="text-slate-800">Tipo de la promoción:</label>
                                    <div className="mt-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="tipe"
                                                value="seasson"
                                                onChange={() => setTipe("seasson")}
                                                ref={genderRef}
                                            />
                                            <span className="ml-2">Temporada</span>
                                        </label>
                                        <label className="inline-flex items-center ml-4">
                                            <input
                                                type="radio"
                                                name="tipe"
                                                value="sale"
                                                onChange={() => setTipe("sale")}
                                                ref={genderRef}
                                            />
                                            <span className="ml-2">Rebaja</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-slate-800" htmlFor="discount">¿Añadir descuento?</label>
                                    <input
                                        type="number"
                                        step="1"
                                        id="discount"
                                        className="mt-2 w-full p-3 bg-gray-50 rounded-lg"
                                        name="discount"
                                        placeholder="Añadir descuento"
                                        ref={discountRef}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="text-slate-800">Estado de la promoción:</label>
                                    <div className="mt-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="1"
                                                onChange={() => setStatus("1")}
                                                ref={genderRef}
                                            />
                                            <span className="ml-2">Activo</span>
                                        </label>
                                        <label className="inline-flex items-center ml-4">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="0"
                                                onChange={() => setStatus("0")}
                                                ref={genderRef}
                                            />
                                            <span className="ml-2">Inactivo</span>
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
            </div>
            {errores.length > 0 && (
                <div className="mt-4">
                    {errores.map((error, index) => (
                        <Alerta key={index}>{error}</Alerta>
                    ))}
                </div>
            )}
        </>
    );
}
