import { createContext, useState, useEffect, useRef, useCallback  } from "react";
import { toast } from "react-toastify"; 
import clienteAxios from "../config/axios";
import personalAxios from "../config/axios";
import _ from 'lodash';



const QuioscoContext = createContext();
const QuioscoProvider = ({children}) =>{


    //Variables que optienen las categorias
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState({});

    const [subCategories, setSubCategories] = useState([]);
    const [subCategoriesC, setSubCategoryC] = useState([]);
    const [subCurrentSubCategory, setSubCurrentSubCategory] = useState({});

    const [modal, setModal] = useState(false);
    
    //Variables que optienen los productos
    const [product, setProduct] = useState([]);
    const [productAll, setProductAll] = useState([]);
    const [genderProducts, setGenderProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({});

    //Variables que optienen los usuarios
    //Consulta de usuarios existentes
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errores, setErrores] = useState([]);
    const [phone, setPhone] = useState([]);

    const [promotions, setPromotion] = useState([]);

    const [img, setImg] = useState([]);
    const [imgComprobant, setImgComprobant] = useState(false);
    // constantes de datos de imagenes de productos
    const [imgProduct, setImgProduct] = useState([]);
    const [idImgProduct, setIdImgProduct] = useState([]);

    // constantes de datos de Promotion_Products
    const [promoProduct, setPromoProduct] = useState([]);

    const [prefixes, setPrefixes] = useState([]);
    const [subPrefijes, setSubPrefijes] = useState({});

    // constantes de datos de warehouses o almacenes
    const [warehouses, setWarehouses] = useState([]);

    // constantes de datos de punto de recogida o arrivals
    const [arrivals, setArrivals] = useState([]);

    // constantes de datos de order
    const [order, setOrder] = useState([]);
    const [total, setTotal] = useState(0);
    const [orders, setOrders] = useState([]);

    const [sendedMail, setSendedMail] = useState(false);
    const [addressRecent, setAddressRecent] = useState("");
    const [addressCode, setAddressCode] = useState("");
    //Variable para mostrar carrito o Resumen
    const [ cartState, setCartState ] = useState(false);

    //Variable para filtrado en barra de busqueda y menu catageorías
    const [ filteredProducts, setFilteredProducts ] = useState([]);
    const [ filteredProductsCount, setFilteredProductsCount ] = useState([]);

    //Variable para Layout
    const [ init, setInit ] = useState(false);

    const [selectedArrival, setSelectedArrival] = useState(1);


    //Declarar datos para la cookie
    const [gender, setGender] = useState(localStorage.getItem('gender') || '');
    const [isGenderResolved, setIsGenderResolved] = useState(false);

    // Guardar gender en localStorage cuando cambie
    // useEffect(() => {
    //     localStorage.setItem('gender', gender);
    // }, [gender]);
    useEffect(() => {
        const storedGender = localStorage.getItem('gender');
        if (storedGender) {
          setGender(storedGender);
          setIsGenderResolved(true);
        } else {
          setIsGenderResolved(true); 
        }
      }, []);
      useEffect(() => {
        if (gender) {
          localStorage.setItem('gender', gender);
        }
      }, [gender]);

    // Funciones auxiliares para manejar cookies
    const setCookie = async (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    };

    const getCookie = async (name) => {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    useEffect(() => {
        // Al montar el componente, intentar obtener el género de la cookie
        const savedGender = getCookie('selectedGender');
        if (savedGender) {
            setGender(savedGender);
        } 
    }, []);

    const selectGender = async (newGender) => {
        setGender(newGender);
        console.log("El valor de gender desde selectGender es ", gender);
        setCookie('selectedGender', newGender, 7); 
    };


    useEffect(() => {
        const newTotal = order.reduce((total, product) => {
            const price = parseFloat(product.price);
            return (price * product.quantity) + total;
        }, 0);
        setTotal(newTotal);
    }, [order]);
    
    

    
    useEffect(() => {
        if (imgProduct.length > 0) {
            const imgMap = imgProduct.reduce((acc, imgP) => {
                const key = `${imgP.product_id}_${imgP.img_id}`;
                acc[key] = img.find(i => i.id === imgP.img_id);
                return acc;
            }, {});
            setIdImgProduct(imgMap);
        }
    }, [imgProduct]);

      

    //Obtener las categorias

    const obtenerCategorias = async () => {
        try {
            if (!categories.length) {
                const { data } = await clienteAxios('/api/categories')
                setCategories(data.data);
            }

        } catch (error) {
            console.log(error);
        }
    };
    

    
    const obtenerSubCategorias = async () => {
        try {
            if (!subCategoriesC.length) {
                const { data } = await clienteAxios('/api/subcategories')
                setSubCategoryC(data.data);
            }
            
        } catch (error) {
            console.log(error);
        }
    };


    
    // Obtener los productos

    const obtenProducts = async () => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {

                const { data } = await clienteAxios.get('/api/productsAdmin', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });

                setProductAll(data.data);
            

        } catch (error) {
            console.log(error);
        }
    };    


            
    //Obtener los teléfonos
    const getPhone = async () => {
        try {

            if (!phone.length) {
                const { data } = await clienteAxios('/api/phone_number')
                setPhone(data.data);
            }

        } catch (error) {
            console.log(error);
        }
    };

    
            
        const getUsers = async () => {
            const token = localStorage.getItem('AUTH_TOKEN');

            try {

                const response = await clienteAxios.get('/api/users', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  const userData = response.data.data;
                  setUsers(userData);
 
                console.log("El valor de response en getUsers es ", response);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

    



        //Obtener los datos de promotion_productos
        const getOrders = async () => {
            try {
                const token = localStorage.getItem('AUTH_TOKEN');

                const response = await clienteAxios.get('/api/ordersRelease', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                const userData = response.data.data; 
                setOrders(userData)

            } catch (error) {
                console.log(error);
            }
        };
    
        

    
    //Obtener los promociones por genero

    const getPromotion = async (gender) => {
        try {
            const { data } = await clienteAxios(`/api/promo/${gender}`);
            setPromotion(data.data);
        } catch (error) {
            console.log(error);
        }
    };

           
    //Obtener los productos por genero
 
    const getProducts = async (gender) => {
        try {
            const { data } = await clienteAxios.get(`/api/products/${gender}`);
            setProduct(data.data);
        } catch (error) {
            console.log(error);
        }
    };


    const throttledGetProducts = useCallback(_.throttle(async (gender) => {
        try {
          const { data } = await clienteAxios.get(`/api/products/${gender}`);
          setProduct(data.data);
        } catch (error) {
          console.log(error);
        }
      }, 1000), []);
      
      const throttledGetPromotion = useCallback(_.throttle(async (gender) => {
        try {
          const { data } = await clienteAxios(`/api/promo/${gender}`);
          setPromotion(data.data);
        } catch (error) {
          console.log(error);
        }
      }, 1000), []);


    //Obtener los datos de promotion_productos
    const getPromoProducts = async () => {
        try {
            const { data } = await clienteAxios('/api/promoProduct')
            setPromoProduct(data.data);

        } catch (error) {
            console.log(error);
        }
    };

    
    useEffect(() => {
        getPromoProducts();
    },[promotions])
    

    
    //Obtener las imagenes de base de datos

    const obtenImg = async () => {
        try {
            const { data } = await clienteAxios('/api/img')
            setImg(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        obtenImg();
    },[gender, imgComprobant]);


    //Obtener las los alamcenes (warehouses) de base de datos
    const getWarehouses = async () => {
        try {
            const { data } = await clienteAxios('/api/warehouses')
            setWarehouses(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    
    


    //Obtener las los alamcenes (warehouses) de base de datos
    const getArrivals = async () => {
        try {
            const { data } = await clienteAxios('/api/arrivals')
            setArrivals(data.data);
        } catch (error) {
            console.log(error);
        }
    };


        
    //Obtener las id de imgProduct(tabla intermedia entre imgs y Productos)

    const obtenImgProduct = async () => {
        try {
            const { data } = await clienteAxios('/api/imgProduct');
            setImgProduct(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        obtenImgProduct();
    }, [product, imgComprobant]);

    //Obtener las prefijos

    const getPrefixes = async () => {
        try {
            const { data } = await clienteAxios('/api/prefixes')
            setPrefixes(data.data);
            setSubPrefijes(data.data[0]);
        } catch (error) {
            console.log(error);
        }
    };
    


    //Obtener las subcategorias

    const obtenerSubCategoriasPorCategoria = async (parentCategorie) => {
        try {
            const { data } = await clienteAxios(`/api/subcategories?parent_category_id===${parentCategorie}`);

            setSubCategories(data.data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleClickModal = () =>{
        setModal(!modal);
    }
    const handleClickCategoria = id => {
        console.log("El valor de id en handleClickCategoria es ", id);
        const category = categories.filter(category => category.id === id)[0]
        setCurrentCategory(category)
    }
    
      
    const handleClickSubCategoria = id => {
        console.log("El valor de id en handleClickSubCategoria es ", id);
        const subCategory = subCategories.filter(sub => sub.id === id)[0]
        setSubCurrentSubCategory(subCategory)
    }
    




    const handleSetProducto = product => {
        setProduct(product)
    }

    const handleQuantityCustomers = async (product, quantityCustomer) => {
        const quantityNumber = parseInt(quantityCustomer, 10);
        const price = parseFloat(product.price);
    
        const productExistIndex = order.findIndex(item => item.id === product.id && item.warehouse_id === product.warehouse_id);
    
        if (productExistIndex !== -1) {
            const updatedOrder = order.map(item => {
                if (item.id === product.id && item.warehouse_id === product.warehouse_id) {
                    return { ...item, quantity: quantityNumber, price };
                }
                return item;
            });
            setOrder(updatedOrder);
            toast.success('Cantidad actualizada');
        } else {
            const newProduct = { ...product, quantity: quantityNumber, price };
            setOrder([...order, newProduct]);
            console.log("El valor de order en handleQuantityCustomers es, ", order);
            toast.success('Producto agregado al pedido');
        }
    };
    
    
    
      
    const handleSubmitNewOrder = async (orderData, setErrores) => {
        console.log("El valor de orderData desde handleSubmitNewOrder es", orderData);
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
          const { data } = await clienteAxios.post('/api/orders', orderData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          toast.success(data.message);
          setTimeout(() => {
            setOrder([]);
            localStorage.removeItem('AUTH_TOKEN');
          }, 1000);
        } catch (error) {
          console.log(error);
          if (error.response && error.response.data.errors) {
            const backendErrors = Object.values(error.response.data.errors).flat();
            setErrores(backendErrors);
          } else {
            setErrores(["Hubo un problema al procesar tu pedido. Inténtalo de nuevo."]);
          }
        }
      };    
      const handleSubmitNewOrderSuccess = async (orderData,transactionId, setErrores) => {
          console.log("El valor de orderData desde handleSubmitNewOrder es", orderData);
          const token = localStorage.getItem('AUTH_TOKEN');
          try {
            const { data } = await clienteAxios.post('/api/ordersSuccess', {
                total: orderData.total,
                arrivalId: orderData.arrivalId,
                products: orderData.products,
                paypal_order_id: transactionId,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
  
           toast.success(data.message);
            setTimeout(() => {
              setOrder([]);
            }, 1000);
          } catch (error) {
            console.log(error);
            if (error.response && error.response.data.errors) {
              const backendErrors = Object.values(error.response.data.errors).flat();
              setErrores(backendErrors);
            } else {
              setErrores(["Hubo un problema al procesar tu pedido. Inténtalo de nuevo."]);
            }
          }
        };
      
    const handleEditarCantidad = id =>{
        const currentProduct = order.filter(product => product.id === id)[0]
        setProduct(currentProduct)
    }


    const handleEliminarProductoPedido = id => {
        const currentOrder = order.filter(product => product.id !== id)
        setOrder(currentOrder)
        toast.success('Eliminado del Pedido')
    }


    const setEmailValue = (value) => {
        setAddressRecent(value);
    };


    const generateNumber = () => {
        setAddressCode(String(Math.floor(10000 + Math.random() * 90000))); // Genera un número de 5 dígitos
    }

    const handleClickEnviarMensaje = async (address, addressCode) => {
        console.log("desde handleClickEnviarMensaje addressCode es: ", address);
        console.log("desde handleClickEnviarMensaje addressCode es: ", addressCode);
        try {
            // Realiza una solicitud al backend para enviar el mensaje
            await clienteAxios.post('/api/send-mail', { email: address, addressCode: addressCode });
    
            // Actualiza el estado indicando que el mensaje se ha solicitado
            setSendedMail(true);
        } catch (error) {
            console.error('Error al solicitar el mensaje:', error);
            // Manejar el error según tus necesidades
        }
    };
    
    const handleClickSendClientMessage = async (formData) => {
        console.log("desde handleClickSendClientMessage inputValue es: ", formData);
        try {
            // Realiza una solicitud al backend para enviar el mensaje
            const { data } = await clienteAxios.post('/api/contact-us', formData);
            toast.success(data.message);
    
            // Actualiza el estado indicando que el mensaje se ha solicitado
            setSendedMail(true);
        } catch (error) {
            console.error('Error al solicitar el mensaje:', error);
            // Manejar el error según tus necesidades
        }
    };



    const handleClickBill = async () => {
        const token = localStorage.getItem('AUTH_TOKEN')
        try {
            console.log('Datos del pedido:', order);
            const { data } = await clienteAxios.post('/api/orders',
            {
                total,
                products: order.map(product => {
                    return{
                        id: product.id,
                        cantidad: product.quantity
                    }
                })
            },
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            toast.success(data.message);
            // Cerrar la sesión del usuario
            setTimeout(() => {
                setOrder([]);
                localStorage.removeItem('AUTH_TOKEN');
                logaut();
            }, 1000);
        } catch (error) {
            console.log(error)
        }
    

    };
    const handleClickFilteredProducts = (filter) => {
        try {
            setFilteredProducts([]); // Limpiar el estado antes de filtrar
    
            console.log('Valor de filter:', filter);
    
            let filtered = [];
    
            if (filter.type === 'category') {
                // Filtrar productos por categoría
                const subCategoriesByCategory = subCategoriesC.filter(sub => sub.parent_category_id === filter.id);
                const subCategoryIds = subCategoriesByCategory.map(sub => sub.id);
    
                filtered = product.filter(prod => subCategoryIds.includes(prod.sub_categories_id));
            } else if (filter.type === 'subCategory') {
                // Filtrar productos por subcategoría
                filtered = product.filter(prod => prod.sub_categories_id === filter.id);
            } else if (filter.type === 'string') {
                const filtLowerCase = filter.value.toLowerCase();
    
                // Filtrar productos por nombre
                filtered = product.filter(prod => prod.name.toLowerCase().includes(filtLowerCase));
    
                if (filtered.length === 0) {
                    const category = categories.find(cat => cat.name.toLowerCase().includes(filtLowerCase));
    
                    if (category) {
                        const subCategoriesByCategory = subCategoriesC.filter(sub => sub.parent_category_id === category.id);
                        const subCategoryIds = subCategoriesByCategory.map(sub => sub.id);
    
                        filtered = product.filter(prod => subCategoryIds.includes(prod.sub_categories_id));
                    }
    
                    if (filtered.length === 0) {
                        const subCategory = subCategoriesC.find(sub => sub.name.toLowerCase().includes(filtLowerCase));
    
                        if (subCategory) {
                            filtered = product.filter(prod => prod.sub_categories_id === subCategory.id);
                        }
                    }
                }
            }
    
            console.log('Productos filtrados:', filtered);
    
            setFilteredProducts(filtered);
    
        } catch (error) {
            console.error('Error al filtrar productos:', error);
        }
    };
    
    
    
    useEffect(() => {

        if(filteredProductsCount.length > 0){

            const searchCount = async (filteredProductsCount) => {
                try {
                    console.log("Desde searchCount en useEffect de provider ", filteredProductsCount);
                    const { data } = await clienteAxios.post('/api/productSearch', filteredProductsCount);
                    console.log({ data });
                    return null; 
                } catch (error) {
                    console.log(Object.values(error.response.data.errors));
                    console.log("Return error for unsuccessful");
                    return error;
                }
            };
        

            searchCount(filteredProducts);
        }
    }, [filteredProductsCount])


    const handleArriveId = (arriveId) => {
        try {

    
            console.log('Productos filtrados:', arriveId);
    
            setSelectedArrival(arriveId);
    
        } catch (error) {
            console.error('Error al filtrar productos:', error);
        }
    };
    
    const handleAgregarPedido = ({categoria_id, ...product}) => {
        if(order.some( pedidoState => pedidoState.id === product.id )) {
            const pedidoActualizado = order.map( pedidoState => pedidoState.id === product.id ? product : pedidoState)
            setOrder(pedidoActualizado)
            toast.success('Guardado Correctamente')
        } else {
            setPedido([...order, product])
            toast.success('Agregado al Pedido')
        }
    }

    
    return (
        <QuioscoContext.Provider
            value={{
                categories,
                currentCategory,
                modal, 
                product,
                order,
                total,
                subCategories,
                subCurrentSubCategory,
                prefixes,
                subPrefijes,
                currentProduct,
                img,
                imgProduct,
                sendedMail,
                addressRecent,
                addressCode,
                idImgProduct,
                subCategoriesC,
                promotions,
                promoProduct,
                cartState,
                setCartState,
                filteredProducts,
                users,
                phone,
                orders,
                warehouses,
                arrivals,
                genderProducts,
                gender,
                setGender,
                selectGender,
                productAll,
                init,
                setInit,
                errores,
                setErrores,
                selectedArrival, 
                setSelectedArrival,
                handleArriveId,
                throttledGetProducts,
                throttledGetPromotion,
                isGenderResolved,
                imgComprobant, 
                setImgComprobant,

                
                handleClickCategoria,
                handleSetProducto,
                handleEditarCantidad,
                handleSubmitNewOrder,
                handleEliminarProductoPedido,
                obtenerSubCategoriasPorCategoria,
                handleClickEnviarMensaje,
                setEmailValue,
                generateNumber,
                handleQuantityCustomers,
                handleClickBill,
                handleClickSubCategoria,
                handleClickFilteredProducts,
                handleClickSendClientMessage,
                obtenProducts,
                getPrefixes,
                getUsers,
                getPhone,
                getOrders,
                getProducts, 
                getPromotion,
                getArrivals,
                getWarehouses,
                handleSubmitNewOrderSuccess,
                obtenerCategorias,
                obtenerSubCategorias,
                handleClickModal,
                handleAgregarPedido

            }}
        >
            {children}
        </QuioscoContext.Provider>

    )
}
export {
    QuioscoProvider
}

export default QuioscoContext
