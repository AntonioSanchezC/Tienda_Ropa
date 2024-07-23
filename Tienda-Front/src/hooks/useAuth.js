import useSWR from 'swr'
import {useNavigate} from 'react-router-dom'
import clienteAxios from "../config/axios";
import useQuiosco from "../hooks/useQuiosco";
import { toast } from "react-toastify"; 
import { useState, useEffect, } from "react";


export const useAuth = () => {

    const {  gender,setGender, setUser, imgComprobant, setImgComprobant } = useQuiosco();

    const token = localStorage.getItem('AUTH_TOKEN')
    const navigate = useNavigate();
    
    const [commentComprobant, setCommentComprobant] = useState(false);

  // Obtener la información del usuario usando SWR
  const { data: user,authUser , error, mutate } = useSWR(token ? '/api/user' : null, () =>
    clienteAxios('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.data)
    .catch(error => {
      throw Error(error?.response?.data?.errors);
    })
  );


    

    const login = async (datos, setErrores) =>{
        try {
            const {data} = await clienteAxios.post('/api/login', datos)
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([])
            await mutate()
            // Guardar el usuario en el estado o en un contexto global
            const user = data.user;

            // Redirigir según el rol del usuario
            if (user.admin === 1) {
                navigate('/admin/Orders');
            } else {
                setGender(user.gender);
                navigate('/');
            }

        } catch (error) {
          setErrores(Object.values(error?.response?.data?.errors));            
        }
        
    }



    const instanceProduct = async (gender, setErrores) => {
      try {
  
          // Realiza una llamada POST al backend para filtrar productos por género
          await clienteAxios.post("/api/products/filter", { gender });
  
          setErrores([]);
          await mutate();
          // navigate('/'); 
          return null;
      } catch (error) {
          setErrores(["Error al filtrar los productos"]);
          return null;
      }
  };
  

    const insetImg = async (formData, setErrores) => {
        try {
          const response = await clienteAxios.post('/api/img', formData);
          if (response.data && response.data.imagen) {
            return { imagen: response.data.imagen };
          } else {
            throw new Error("Error al cargar la imagen");
          }
        } catch (error) {
          setErrores(["Error al cargar la imagen"]);
          return null;
        }
      };
      


////////////7/////////////////////////////Product/////////////////////////////////////////
const insetProduct = async (formData, setErrores) => 
  {
       try {
         console.log('LLegado al hook' );
         // Primero, subir la imagen
         const { data: imagenData } = await clienteAxios.post('/api/saveImage', formData);
            console.log('Imagen subida:', imagenData); // Agregar esta línea

           // Luego, enviar los datos del formulario junto con la ruta de la imagen
           const datosP = {
                           name: formData.get('name'),
                           gender: formData.get('gender'),
                           price: formData.get('price'), // Convertir a número
                           disp: parseInt(formData.get('disp')), // Convertir a número entero
                           description: formData.get('description'),
                           size: formData.get('size'),
                           color: formData.get('color'),
                           code_color: formData.get('code_color'),
                           quantity: formData.get('quantity'), 
                           subcate: formData.get('subcate'), 
                           image: String(imagenData.imagen), // Usar la respuesta de la subida de imagen
                           entity:formData.get('entity'),
                           novelty:parseInt(formData.get('novelty')), // Convertir a número entero
                           warehouses: formData.get('warehouses'), 
                         };
               console.log('Datos del producto:', datosP); 
           const { data } = await clienteAxios.post('/api/insertProduct', datosP);
           toast.success(data.message);
           setImgComprobant(!imgComprobant);
               console.log('Respuesta del servidor:', data); // Agregar esta línea
               setErrores([]);
               await mutate();
               return null; // Return null for successful registration

           } catch (error) {
               console.error("Error al enviar datos:", error);
               setErrores(Object.values(error.response.data.errors));
               return error; // Return error for unsuccessful registration
           }
   };



   const deleteProduct = async (prod, setErrores) => {
    try {
        console.log("El valor de prod desde deleteProduct", prod);

       await clienteAxios.post("/api/deleteProduct", { prod: prod });

        setErrores([]);
        await mutate();
        console.log("Return null for successful delete");
        window.location.reload();
        return null;
    } catch (error) {
        setErrores(["Error with the product to delete"]);
        return null;
    }
}

    const GetSizesAndColors = async (productCode, setErrores) => {
      try {
        const { data } = await clienteAxios.get(`/api/products/${productCode}/sizes-colors`);
        return data;
      } catch (error) {
        setErrores(["Error with the product to fetch sizes and colors"]);
      }
    };
    
    const GetProductsByCode = async (productCode, setError, filters = {}) => {
      try {
        const { data }  = await clienteAxios.get(`/api/products/${productCode}/sizes-colors-filter`, {
          params: filters,
        });

        return data;
      } catch (error) {
        setError(error.data?.message || 'Error al obtener productos');
        return null;
      }
    };
  
  

  
  //////////////////////////User/////////////////////////////////
  const register = async (datos, setErrores) => {
      try {
          const { data } = await clienteAxios.post('/api/register', datos);
          localStorage.setItem('AUTH_TOKEN', data.token);
          setErrores([]);
          await mutate();
          navigate('/auth/verify');
          return null; // Return null for successful registration
      } catch (error) {
          setErrores(Object.values(error?.response?.data?.errors));
          return error; // Return error for unsuccessful registration
      }
  };
  const updateUser= async (user, setErrores) => {
      try {
        const { data } = await clienteAxios.post('/api/updateUser', user);
        localStorage.setItem('AUTH_TOKEN', data.token);
        setErrores([]);
        return null; 
      } catch (error) {
          setErrores(["Error with the product to delete"]);
          return null;
      }
  }

    const deleteUser = async (user, setErrores) => {
      try {
  
          await clienteAxios.post("/api/deleteUser", { user: user });

          setErrores([]);
          window.location.reload();
          return null;
      } catch (error) {
          setErrores(["Error with the product to delete"]);
          return null;
      }
  }
  
//////////////////////////User/////////////////////////////////


    const updateProduct = async (formData, setErrores) => {
      try {
        let imagenData; // Definir imagenData fuera del bloque if
        // Verificar si se ha adjuntado un archivo
        if (formData.has('file')) {
          // Subir la imagen solo si se ha adjuntado un archivo
          const response = await clienteAxios.post('/api/saveImage', formData);
          imagenData = response.data; // Asignar la respuesta a imagenData
          // Actualizar la ruta de la imagen en formData
          formData.set('image', String(imagenData.imagen));
        } 
    
        // Enviar los datos del formulario junto con la ruta de la imagen
        const datosP = {
          id: formData.get('id'),
          name: formData.get('name'),
          price: formData.get('price'), 
          disp: parseInt(formData.get('disp')), 
          description: formData.get('description'),
          size: formData.get('size'),
          color: formData.get('color'),
          quantity: formData.get('quantity'),
          subcate: formData.get('subcate'),
          oldrute: formData.get('prevImage'), 
          entity: formData.get('entity'),
          novelty: parseInt(formData.get('novelty')), 
          image: formData.get('image'), 
        };
        const { data } = await clienteAxios.post('/api/updateProduct', datosP);
        setErrores([]);
        await mutate();
        return null; 
    
      } catch (error) {
        setErrores(Object.values(error.response.data.errors));
        return error; 
      }
    };
    

////////////7/////////////////////////////Product/////////////////////////////////////////
const verifyEmail = async (code, setErrores) => {
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
        
          const response = await clienteAxios.post('/api/verifyEmail', { code }, { headers });
        
        
          localStorage.setItem('AUTH_TOKEN', response.data.token);
          setErrores([]);
        
          navigate('/auth/code');
          return null; // Return null for successful registration
        } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrores(Object.values(error.response.data.errors));
          } else {
            console.log("Error:", error);
          }
          return error;
        }
      };


      
    const code = async (code, setErrores) => {
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await clienteAxios.post('/api/code', code , { headers });
          setErrores([]);
        
          navigate('/auth/login');
          return null; 
        } catch (error) {
          setErrores(Object.values(error.response.data.errors));
          return error; 
      }
    };
    const insertPromotion = async(formData, setErrores) =>{
        try {              
          // Primero, subir la imagen
          const { data: imagenData } = await clienteAxios.post('/api/saveImage', formData);

          // Luego, enviar los datos del formulario junto con la ruta de la imagen
          const datosP = {
                          entity:formData.get('entity'),
                          image: imagenData.imagen, 


                          name: formData.get('name'),
                          gender: formData.get('gender'),
                          description: formData.get('description'), // Convertir a número
                          tipe: formData.get('tipe'),// Convertir a número
                          discount: parseInt(formData.get('discount')),// Convertir a número
                          status: parseInt(formData.get('status')),

                        };
          const { data } = await clienteAxios.post('/api/insertPromotion', datosP);
          toast.success(data.message);

              setErrores([]);
              return null; // Return null for successful registration

          
        } catch (error) {
          setErrores(Object.values(error.response?.data?.errors));
          return error; // Return error for unsuccessful registration
      }
    }

    const promoProduct = async(datos, setErrores) =>{
        try {
          const { data } = await clienteAxios.post('/api/promoProducts', datos);
          toast.success(data.message);

          localStorage.setItem('AUTH_TOKEN', data.token);
          
            setErrores([]);
            return null;

        } catch (error) {
          setErrores(Object.values(error.response.data.errors));
          return error; // Return error for unsuccessful registration
      }
    }
    
  //funciones de search
    const search = async() =>{
        try {
          navigate('/productsList');
          
        } catch (error) {
          console.error("Error al enviar datos:", error);
          return error; // Return error for unsuccessful registration
      }
    };


    
    const searchCount = async (datos, setErrores) => {
      try {
          const { data } = await clienteAxios.post('/api/productSearch', datos);
          localStorage.setItem('AUTH_TOKEN', data.token);
          setErrores([]);
          return null; // Return null for successful registration
      } catch (error) {
          setErrores(Object.values(error.response.data.errors));
          return error; // Return error for unsuccessful registration
      }
  };

  const commentInsert = async(datos, setErrores) =>{
    try {

      const {data} = await clienteAxios.post('/api/insertComments', datos)
      setCommentComprobant(!commentComprobant);
      toast.success(data.message);
        setErrores([]);
        return null;

    } catch (error) {
      setErrores(Object.values(error.response.data.errors));
      return error; // Return error for unsuccessful registration
  }
}


const commentGet = async(product_id, setErrores) =>{
  try {
    const {data} = await clienteAxios.get(`/api/comments/${product_id}`);
    
    setErrores([]);
    return data.comments; // Return comments data

  } catch (error) {
    setErrores(Object.values(error.response.data.errors));
    return error; // Return error for unsuccessful registration
  }
}



const logout = async () => {
  try {
    const token = localStorage.getItem('AUTH_TOKEN');
    await clienteAxios.post('/api/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    localStorage.removeItem('AUTH_TOKEN');
    await mutate(undefined);
    navigate('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw Error(error?.response?.data?.errors);
  }
};





    return{
      instanceProduct,
        login, 
        register, 
        logout,
        user: authUser || user,
        error,
        insetImg,
        insetProduct,
        verifyEmail,
        code,
        search,
        insertPromotion,
        promoProduct,
        searchCount,
        deleteProduct,
        updateProduct,
        deleteUser,
        updateUser,
        commentInsert,
        commentGet,
        GetSizesAndColors,
        GetProductsByCode,
        commentComprobant, 
        setCommentComprobant
      
    }
}