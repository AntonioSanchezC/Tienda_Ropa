import {useEffect} from 'react'
import useSWR from 'swr'
import {useNavigate} from 'react-router-dom'
import clienteAxios from "../config/axios";
import useQuiosco from "../hooks/useQuiosco";


export const useAuth = ({middleware, url}) => {

    const token = localStorage.getItem('AUTH_TOKEN')
    const { user, setUser } = useQuiosco();

    const navigate = useNavigate();

    const {data: fetchedUser, error, mutate} = useSWR('/api/user', () =>
        clienteAxios('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error => {
            throw Error(error?.response?.data?.errors)
        })
    )

    const login = async (datos, setErrores) =>{
        try {
            const {data} = await clienteAxios.post('/api/login', datos)
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([])
            await mutate()
            navigate('/');
        } catch (error) {
            setErrores(Object.values(error.response.data.errors))
            
        }
        
    }


    const instanceProduct = async (gender, setErrores) => {
      try {
          console.log("Filtrando productos por género:", gender);
  
          // Realiza una llamada POST a tu backend para filtrar productos por género
          await clienteAxios.post("/api/products/filter", { gender });
  
          setErrores([]);
          await mutate();
          console.log("Filtrado de productos exitoso");
          // navigate('/'); // Si necesitas redirigir después del filtrado, descomenta esta línea
          return null;
      } catch (error) {
          setErrores(["Error al filtrar los productos"]);
          return null;
      }
  };
  

    const insetImg = async (formData, setErrores) => {
        try {
            console.log("Estamos en el hook");
          const response = await clienteAxios.post('/api/img', formData);
            console.log("la respuesta en el hook es ". response);
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
      
    const handleImageUpload = async (file, setErrores) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
      
          const response = await fetch("/api/insertImg", {
            method: "POST", // Utiliza el método POST
            body: formData,
          });
      
          if (response.ok) {
            const data = await response.json();
            return data.imagen;
          } else {
            throw new Error("Error al cargar la imagen");
          }
        } catch (error) {
          setErrores(["Error al cargar la imagen"]);
          return null;
        }
      }

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
                  console.log('Respuesta del servidor:', data); // Agregar esta línea
                  localStorage.setItem('AUTH_TOKEN', data.token); // Cambiar a 'data' en lugar de 'response.data'
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
        console.log("El valor de data en GetSizesAndColors es ", data.message);
        console.log("El valor de data.colors en GetSizesAndColors es ", data.colors);
        return data;
      } catch (error) {
        setErrores(["Error with the product to fetch sizes and colors"]);
      }
    };
    
    const GetProductsByCode = async (productCode, setError, filters = {}) => {
      try {
        console.log("El valor de productCode en GetProductsByCode es ", productCode);
        console.log("El valor de filters en GetProductsByCode es ", filters);
        const { data }  = await clienteAxios.get(`/api/products/${productCode}/sizes-colors-filter`, {
          params: filters,
        });
        console.log("La respuesta data de GetProductsByCode es ", { data });
        console.log("El valor de products tras GetProductsByCode es", data.products);
        console.log("El valor de colors tras GetProductsByCode es", data.colors);
        console.log("El valor de sizes tras GetProductsByCode es", data.sizes);

        return data;
      } catch (error) {
        setError(error.data?.message || 'Error al obtener productos');
        return null;
      }
    };
  
  

  
//////////////////////////User/////////////////////////////////
const register = async (datos, setErrores) => {
  try {
      console.log("Ha llegado a register");
      console.log(datos);
      const { data } = await clienteAxios.post('/api/register', datos);
      console.log({ data });
      localStorage.setItem('AUTH_TOKEN', data.token);
      setErrores([]);
      await mutate();
      console.log("El correo a enviar es: ",datos.email);
      // Enviar correo electrónico al controlador de correo electrónico
      console.log("Return null for successful registration");
      navigate('/auth/verify');
      return null; // Return null for successful registration
  } catch (error) {
      setErrores(Object.values(error.response.data.errors));
      console.log("Return error for unsuccessful");
      return error; // Return error for unsuccessful registration
  }
};
const updateUser= async (user, setErrores) => {
  try {
    console.log("Ha llegado a updateUser ", user);
    const { data } = await clienteAxios.post('/api/updateUser', user);
    console.log({ data });
    localStorage.setItem('AUTH_TOKEN', data.token);
    setErrores([]);
    await mutate();
    console.log("El correo a enviar es: ",datos.email);
    // Enviar correo electrónico al controlador de correo electrónico
    console.log("Return null for successful registration");
    return null; // Return null for successful registration
  } catch (error) {
      setErrores(["Error with the product to delete"]);
      return null;
  }
}

    const deleteUser = async (user, setErrores) => {
      try {
          console.log("El valor de user desde deleteUser", user);
  
          await clienteAxios.post("/api/deleteUser", { user: user });

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
  
//////////////////////////User/////////////////////////////////


    const updateProduct = async (formData, setErrores) => {
      try {
        console.log('LLegado al hook');
        let imagenData; // Definir imagenData fuera del bloque if
        // Verificar si se ha adjuntado un archivo
        if (formData.has('file')) {
          // Subir la imagen solo si se ha adjuntado un archivo
          const response = await clienteAxios.post('/api/saveImage', formData);
          imagenData = response.data; // Asignar la respuesta a imagenData
          console.log('Imagen subida:', imagenData); // Agregar esta línea
          // Actualizar la ruta de la imagen en formData
          formData.set('image', String(imagenData.imagen));
        } 
    
        // Enviar los datos del formulario junto con la ruta de la imagen
        const datosP = {
          id: formData.get('id'),
          name: formData.get('name'),
          price: formData.get('price'), // Convertir a número
          disp: parseInt(formData.get('disp')), // Convertir a número entero
          description: formData.get('description'),
          size: formData.get('size'),
          color: formData.get('color'),
          quantity: formData.get('quantity'),
          subcate: formData.get('subcate'),
          oldrute: formData.get('prevImage'), 
          entity: formData.get('entity'),
          novelty: parseInt(formData.get('novelty')), // Convertir a número entero
          image: formData.get('image'), // Incluir la ruta de la imagen
        };
        console.log('Datos del producto:', datosP); // Agregar esta línea
        const { data } = await clienteAxios.post('/api/updateProduct', datosP);
        console.log('Respuesta del servidor:', data); // Agregar esta línea
        localStorage.setItem('AUTH_TOKEN', data.token); // Cambiar a 'data' en lugar de 'response.data'
        setErrores([]);
        await mutate();
        return null; // Return null for successful registration
    
      } catch (error) {
        console.error("Error al enviar datos:", error);
        setErrores(Object.values(error.response.data.errors));
        return error; // Return error for unsuccessful registration
      }
    };
    

////////////7/////////////////////////////Product/////////////////////////////////////////
const verifyEmail = async (code, setErrores) => {
        try {
          console.log("Ha llegado a verifyEmail ", code);
          const headers = {
            Authorization: `Bearer ${token}`,
          };
        
          const response = await clienteAxios.post('/api/verifyEmail', { code }, { headers });
        
          console.log('Respuesta del servidor:', response);
        
          localStorage.setItem('AUTH_TOKEN', response.data.token);
          setErrores([]);
          await mutate();
        
          console.log("Mensaje desde verifyEmail");
          navigate('/auth/code');
          return null; // Return null for successful registration
        } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrores(Object.values(error.response.data.errors));
          } else {
            console.log("Error:", error);
          }
          console.log("Return error for unsuccessful introduction of code");
          return error; // Return error for unsuccessful registration
        }
      };


      
    const code = async (code, setErrores) => {
        try {
          console.log("Ha llegado a code ", code);
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await clienteAxios.post('/api/code', code , { headers });
        
          console.log('Respuesta del servidor:', response);
        
          localStorage.setItem('AUTH_TOKEN', response.data.token);
          setErrores([]);
          await mutate();
        
          console.log("Mensaje es Code");
          navigate('/');
          return null; // Return null for successful registration
        } catch (error) {
          console.error("Error al enviar datos:", error);
          setErrores(Object.values(error.response.data.errors));
          return error; // Return error for unsuccessful registration
      }
    };
    const insertPromotion = async(formData, setErrores) =>{
        try {              
          console.log('LLegado al hook' );
          // Primero, subir la imagen
          const { data: imagenData } = await clienteAxios.post('/api/saveImage', formData);
             console.log('Imagen subida:', imagenData); // Agregar esta línea

          // Luego, enviar los datos del formulario junto con la ruta de la imagen
          const datosP = {
                          entity:formData.get('entity'),
                          image: imagenData.imagen, 


                          name: formData.get('name'),
                          description: formData.get('description'), // Convertir a número
                          tipe: formData.get('tipe'),// Convertir a número
                          discount: parseInt(formData.get('discount')),// Convertir a número
                          status: parseInt(formData.get('status')),

                        };
              console.log('Datos de la promocion:', datosP); // Agregar esta línea
          const { data } = await clienteAxios.post('/api/insertPromotion', datosP);
              console.log('Respuesta del servidor:', data); // Agregar esta línea
              localStorage.setItem('AUTH_TOKEN', data.token); // Cambiar a 'data' en lugar de 'response.data'
              setErrores([]);
              await mutate();
              return null; // Return null for successful registration

          
        } catch (error) {
          console.error("Error al enviar datos:", error);
          setErrores(Object.values(error.response.data.errors));
          return error; // Return error for unsuccessful registration
      }
    }

    const promoProduct = async(datos, setErrores) =>{
        try {
          console.log("Desde promoProduct en useAuth ", datos);
          const { data } = await clienteAxios.post('/api/promoProducts', datos);

          localStorage.setItem('AUTH_TOKEN', data.token);
          
            setErrores([]);
            await mutate();
            console.log("Return null for successful match");
            return null;

        } catch (error) {
          setErrores(Object.values(error.response.data.errors));
          console.log("Return error for unsuccessful");
          return error; // Return error for unsuccessful registration
      }
    }
    
  //funciones de search
    const search = async() =>{
        try {
          console.log("Ha llegado a search ");
          navigate('/productsList');
          
        } catch (error) {
          console.error("Error al enviar datos:", error);
          setErrores(Object.values(error.response.data.errors));
          return error; // Return error for unsuccessful registration
      }
    };


    
    const searchCount = async (datos, setErrores) => {
      try {
          console.log("Desde searchCount en useAuth ", datos);
          const { data } = await clienteAxios.post('/api/productSearch', datos);
          console.log({ data });
          localStorage.setItem('AUTH_TOKEN', data.token);
          setErrores([]);
          await mutate();
          // Enviar correo electrónico al controlador de correo electrónico
          console.log("Return null for successful registration");
          return null; // Return null for successful registration
      } catch (error) {
          setErrores(Object.values(error.response.data.errors));
          console.log("Return error for unsuccessful");
          return error; // Return error for unsuccessful registration
      }
  };

  const commentInsert = async(datos, setErrores) =>{
    try {
      console.log("Desde commentInsert en useAuth ", datos);

      const {data} = await clienteAxios.post('/api/insertComments', datos)
      console.log("El valor de data en commentInsert es ", data)
      localStorage.setItem('AUTH_TOKEN', data.token);
      
        setErrores([]);
        await mutate();
        console.log("Return null for successful match");
        return null;

    } catch (error) {
      setErrores(Object.values(error.response.data.errors));
      console.log("Return error for unsuccessful");
      return error; // Return error for unsuccessful registration
  }
}


const commentGet = async(product_id, setErrores) =>{
  try {
    console.log("Desde commentGet en useAuth ", product_id);
    const {data} = await clienteAxios.get(`/api/comments/${product_id}`);
    console.log("El valor de data en commentGet es ", data.comments);
    
    setErrores([]);
    return data.comments; // Return comments data

  } catch (error) {
    setErrores(Object.values(error.response.data.errors));
    console.log("Return error for unsuccessful");
    return error; // Return error for unsuccessful registration
  }
}




  const logout = async () => {
    try {
        await clienteAxios.post('/api/logout', null, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        localStorage.removeItem('AUTH_TOKEN');
        await mutate(undefined);
        window.location.reload(); // Forzar recarga de la página
    } catch (error) {
        throw Error(error?.response?.data?.errors);
    }
};



useEffect(() => {
  if (fetchedUser) {
      setUser(fetchedUser);
  }
}, [fetchedUser, setUser]);

useEffect(() => {
  if (middleware === 'guest' && user) {


      if (user.email_verified_at) {
          if (user.admin === 1) {
              navigate('/admin/Orders');
          } 
      }
  }

  if (middleware === 'admin' && user && !user.admin) {
      navigate('/');
  }
}, [user, error, middleware, navigate]);




    return{
      instanceProduct,
        login, 
        register, 
        logout,
        user,
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
        GetProductsByCode
      
    }
}