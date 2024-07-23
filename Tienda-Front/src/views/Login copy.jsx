import { createRef, useState, useRef, useEffect } from "react" 
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta";
import { useAuth } from "../hooks/useAuth";
import useQuisco from "../hooks/useQuiosco";
import clienteAxios from "../config/axios";


export default function Login() {    
    
    const emailRef = createRef();
    const passwordRef = createRef();
    const { product,  imgProduct, idImgProduct } = useQuisco();
    const [errores, setErrores] = useState([]);
    const listRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    const {login} = useAuth({
        middleware: 'guest',
        url:'/'
    })

    const handleSubmit = async e => {
        e.preventDefault();

        const datos = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        login(datos, setErrores);
    }

    useEffect(() => {
        const listNode = listRef.current;
        const imgNode = listNode.querySelectorAll("li")[currentIndex];
    
        if (imgNode) {
          imgNode.scrollIntoView({
            behavior: "smooth"
          });
        }
    
      }, [currentIndex]);

    const scrollToImage = (direction) => {
        if (direction === 'prev') {
          setCurrentIndex(curr => {
            const isFirstSlide = currentIndex === 0;
            return isFirstSlide ? 0 : curr - 1;
          })
        } else {
          const isLastSlide = currentIndex === imgProduct.length - 1;
          if (!isLastSlide) {
            setCurrentIndex(curr => curr + 1);
          }
        }
    }

    return (

            <div className="flex flex-row ">
                <div className="basis-1/3 bg-zinc-300 shadow-md rounded-lg md:h-1/3 md:m-7 md:p-4 ">
                    <div className="border-solid border-2 border-slate-200 rounded-lg space-y-3 p-4">
                        <h1 className="font-montserrat text-4xl font-black text-gray-200">Iniciar Sesión</h1>

                        <form 
                            onSubmit={handleSubmit}
                            noValidate
                        >

                        {errores ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>) : null}


                            <div className="mb-4">
                                <label 
                                    className="text-slate-800"
                                    htmlFor="email"
                                >Email:</label>
                                <input 
                                    type="text"
                                    id="email"
                                    className="mt-2 w-full p-3 bg-gray-50"
                                    name="email"
                                    placeholder="Escribe tu Correo Electronico"
                                    ref={emailRef}
                                />
                            </div>
                            <div className="mb-4">
                                <label 
                                    className="text-slate-800"
                                    htmlFor="password"
                                >Contraseña:</label>
                                <input 
                                    type="password"
                                    id="password"
                                    className="mt-2 w-full p-3 bg-gray-50"
                                    name="password"
                                    placeholder="Escribe tu Contraseña"
                                    ref={passwordRef}
                                />
                            </div>

                            <input 
                                type="submit"
                                value="Iniciar Sesión"
                                className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full mt-5 p-0 uppercase font-bold cursor-pointer h-12"
                            />
                        </form>
                    </div>
                    <nav className="mt-5">
                        <Link to="/register">¿No tienes cueta?Crea tu cuenta</Link>
                    </nav>
                    
                </div>

                <div className="w-full relative m-0 ">
                    <div className='absolute top-1/2 transform -translate-y-1/2 left-8 text-5xl font-bold text-green-600 z-10 cursor-pointer' onClick={() => scrollToImage('prev')}>&#10092;</div>
                    <div className='absolute top-1/2 transform -translate-y-1/2 right-8 text-5xl font-bold text-green-600 z-10 cursor-pointer' onClick={() => scrollToImage('next')}>&#10093;</div>
                    <div className="border border-solid border-gray-300 overflow-hidden">
                        <ul ref={listRef}>
                            {product.map((product, index) => {
                                if (product.novelty === 1) {
                                    const imgProductForProducto = imgProduct.find((imgP) => imgP.product_id === product.id);
                                    const key = imgProductForProducto ? `${product.id}_${imgProductForProducto.img_id}` : '';
                                    const imgRelacionated = key && idImgProduct[key];
                                    const imageProduct = imgRelacionated && imgRelacionated.image ? `${clienteAxios.defaults.baseURL}/${imgRelacionated.image}` : null;
                
                                    return (
                                        <li key={index} style={{ display: index === currentIndex ? 'block' : 'none' }}>

                                            <img src={imageProduct} alt={product.name} width="200" height="200" 
                                                 className="w-screen h-screen object-cover shadow-md"
                                            />
                                            
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>
                    </div>
                </div>
            

            </div>

        
    );

}
