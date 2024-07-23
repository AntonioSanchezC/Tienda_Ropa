import { createRef, useState , useContext, useEffect} from "react" 
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import {useAuth} from '../hooks/useAuth';
import useQuisco from "../hooks/useQuiosco";
 
    export default function Register() {

        const {getPrefixes, setEmailValue, prefixes  } = useQuisco();
        useEffect(() => {
            getPrefixes();
        },[])


        
        const nameRef = createRef();
        const lastNameRef = createRef();
        const genderRef = createRef(null);
        const direRef = createRef();
        const prefRef = createRef();
        const telfRef = createRef();
        const emailRef = createRef();
        const passwordRef = createRef();
        const passwordConfirmtionRef = createRef();


        const [errores, setErrores] = useState([]);
        const {register} = useAuth({
            middleware: 'guest',
            url:'/'
        })
    
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const genderValue = selectedGender ? selectedGender.value : '';


        const handleSubmit = async e => {
            e.preventDefault();

            const datos = {
                name: nameRef.current.value,
                lastName: lastNameRef.current.value,
                gender:  genderValue,
                address: direRef.current.value,
                value: prefRef.current.value,
                telf: telfRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                password_confirmation: passwordConfirmtionRef.current.value
            }

            // Llama a la función de registro dentro de una función async
            const registerUser = async () => {
                await register(datos, setErrores);
                setEmailValue(datos.email);

            };

            // Espera un breve período de tiempo antes de llamar a la función de registro
            setTimeout(registerUser, 100); // Espera 100 milisegundos (ajusta según sea necesario)
        };


    return ( 
        <div className="grid place-content-start md:place-content-center w-full md:mb-12">

            <div className="bg-zinc-300 shadow-md border-solid border-2 border-gray-700 mt-12 px-10 py-7 ">
            <h1 className="text-4xl font-black mb-10 mr-6">Registro</h1>
                <form
                    onSubmit={handleSubmit}
                    noValidate
                >  
                    <div className="flex items-start">
                        {errores ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>) : null}

                        <div className="w-1/2 pr-4 mx-16">
                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    className="text-slate-800 w-20 mt-7"
                                    htmlFor="name"
                                    >Nombre:
                                </label>
                                <input 
                                    type="text"
                                    id="name"
                                    className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                    name="name"
                                    placeholder="Tu Nombre"
                                    ref={nameRef}

                                />
                            </div>
                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    className="text-slate-800 w-20 mt-7"
                                    htmlFor="apellido"
                                    >Apellido:
                                </label>
                                <input 
                                    type="text"
                                    id="apellido"
                                    className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                    name="apellido"
                                    placeholder="Tu Apellido"
                                    ref={lastNameRef}

                                />
                            </div>
                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    className="text-slate-800 w-20 mt-7"
                                    htmlFor="direccion"
                                    >Direccion:
                                </label>
                                <input 
                                    type="text"
                                    id="direccion"
                                    className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                    name="direccion"
                                    placeholder="Tu Direccion"
                                    ref={direRef}

                                />
                            </div>

                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    htmlFor="valor"
                                    className="w-20  mt-7"
                                >Prefijo País:
                                
                                </label>
                                    <select 
                                        id="valor"
                                        name="valor" 
                                        ref={prefRef}
                                        required
                                        className="mt-10 h-8 shrink"
                                    >
                                        {prefixes.map(prefix => (
                                            <option 
                                                key={prefix.id}
                                                value={prefix.value} 
                                                
                                            >
                                                {prefix.number} 
                                            </option>
                                        ))}
                                    </select>
                            </div>
                            <div className="mb-4 space-x-8 flex">
                                <label className="text-slate-800 w-20 mt-7" htmlFor="telf">Teléfono :</label>
                                <input
                                        type="text"
                                        id="telf"
                                        className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                        name="telf"
                                        placeholder="Teléfono Móvil (Formato internacional, ej: +123 4567890123)"
                                        ref={telfRef}
                                        required
                                />
                            </div>
                        </div>

                        <div className="absolute h-2/5 bg-zinc-800 w-px left-1/2 transform -translate-x-1/2 "></div> 
                        
                        <div className="w-1/2 pl-4 mx-16">
                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    className="text-slate-800 w-28 mt-7"
                                    htmlFor="email"
                                    >Email:
                                </label>
                                <input 
                                    type="text"
                                    id="email"
                                    className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                    name="email"
                                    placeholder="Escribe tu Correo Electronico"
                                    ref={emailRef}

                                />
                            </div>
                            <div className="mb-4">
                              <label className="text-slate-800">Sexo desigando:</label>
                              <div>
                                <label>
                                  <input type="radio" name="gender" value="F" ref={genderRef} />{" "} Femenino
                                </label>
                                <label>
                                  <input type="radio" name="gender" value="M" ref={genderRef} />{" "} Masculino
                                </label>
                              </div>
                            </div>
                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    className="text-slate-800 w-28 mt-7"
                                    htmlFor="password"
                                    >Contraseña:
                                </label>
                                <input 
                                    type="password"
                                    id="password"
                                    className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                    name="password"
                                    placeholder="Escribe tu Contraseña"
                                    ref={passwordRef}

                                />
                            </div>
                            <div className="mb-4 space-x-8 flex">
                                <label 
                                    className="text-slate-800 w-18 mt-7"
                                    htmlFor="password_confirmation"
                                    >Repite tu Contraseña:
                                </label>
                                <input 
                                    type="password"
                                    id="password_confirmation"
                                    className="bg-slate-300 h-6 p-3 mt-7 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                    name="password_confirmation"
                                    placeholder="Repite tu Contraseña"
                                    ref={passwordConfirmtionRef}

                                />
                            </div>

                            <input 
                                type="submit"
                                value="Crear Cuenta"
                                className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full md:mt-12 p-0 uppercase font-bold cursor-pointer h-16"
                            />
                            </div>                     
                    </div>

                </form>

                <nav className="mt-5">
                        <Link to="/auth/login">
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </nav>
                </div>
        </div>
        )
}