import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import { useAuth } from '../hooks/useAuth';
import { useDropzone } from "react-dropzone";

export default function SubirImagen() {
  const [previewImage, setPreviewImage] = useState(null);

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
  const { insertImg } = useAuth({
    middleware: 'auth',
    url: '/'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si hay una imagen seleccionada
    if (acceptedFiles.length === 0) {
      setErrores(['Debes seleccionar una imagen']);
      return;
    }

    const file = acceptedFiles[0];

    // Crea un objeto FormData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Realiza la solicitud al servidor para subir la imagen
      await clienteAxios.post('/api/subir-imagen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // La imagen se ha subido exitosamente
      // Puedes realizar acciones adicionales si es necesario

      // Limpia los errores
      setErrores([]);

      // Puedes redirigir al usuario a otra página o realizar otras acciones
    } catch (error) {
      // Maneja los errores de la solicitud al servidor
      console.error('Error al subir la imagen:', error);
      setErrores(['Error al subir la imagen. Por favor, inténtalo de nuevo.']);
    }
  };

  const [errores, setErrores] = useState([]);

  return (
    <>
      <h1 className="text-4xl font-black">Crear tu Cuenta</h1>
      <p>Crea tu cuenta llenando el formulario</p>

      <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
        <form onSubmit={handleSubmit} noValidate>
          {errores ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>) : null}
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
            {previewImage && <img src={previewImage} alt="Vista previa" />}
          </div>
          <input
            type="submit"
            value="Subir Imagen"
            className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-0 uppercase font-bold cursor-pointer"
          />
        </form>
      </div>

      <nav className="mt-5">
        <Link to="/auth/login">¿Ya tienes cueta? Inicia sesión</Link>
      </nav>
    </>
  );
}
