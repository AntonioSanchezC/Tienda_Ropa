import { createRef, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import { useAuth } from '../hooks/useAuth';
import useQuisco from "../hooks/useQuiosco";
import '../styles/errorStyle.css';


export default function Register() {
    const { getPrefixes, setEmailValue, prefixes } = useQuisco();
    useEffect(() => {
        getPrefixes();
    }, [])

    const baseURL = import.meta.env.VITE_API_URL;

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
    const { register } = useAuth({
        middleware: 'guest',
        url: '/'
    })

    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const genderValue = selectedGender ? selectedGender.value : '';

    const handleSubmit = async e => {
        e.preventDefault();

        const datos = {
            name: nameRef.current.value,
            lastName: lastNameRef.current.value,
            gender: genderValue,
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
        <div className="relative md:place-content-center  z-50 max-h-full">

            <div
                className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-contain rounded-lg z-0"
                style={{ backgroundImage: `url(${baseURL}/backgrounds/RegisterDeco.png)` }}
            ></div>
        <div className="relative grid place-content-start  w-full md:mb-12 font-playfair ">

            <div className="relative w-full">
                <div className="relative bg-transparent mt-12 px-10 py-7 z-10 ">

                    <h1 className="text-4xl font-black mb-20">Registro</h1>
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="absolute top-20 right-12 p-4 z-20">
                            <Link to={`/`}>
                                <img src={`${baseURL}/icon/backHome.png`} alt="logo icon" className="md:w-[3rem] md:h-[2rem]" />
                            </Link>
                        </div>
                        <div className="flex items-start max-h-full">

                            <div className="w-1/2 pr-4 mx-2 ">
                                <div className="mb-1 space-x-12 relative">
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
                                    {errores.name && <Alerta>{errores.name}</Alerta>}
                                </div>

                                <div className="mb-1 space-x-12 relative">
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
                                    {errores.lastName && <Alerta>{errores.lastName}</Alerta>}
                                </div>

                                <div className="mb-1 space-x-9  relative">
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
                                    {errores.address && <Alerta>{errores.address}</Alerta>}

                                </div>

                                <div className="mb-1 space-x-10  relative">
                                    <label
                                        htmlFor="valor"
                                        className="w-20 mt-7"
                                    >Prefijo País:
                                    </label>
                                    <select
                                        id="valor"
                                        name="valor"
                                        ref={prefRef}
                                        required
                                        className="mt-2 h-8 shrink"
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
                                    {errores.value && <Alerta>{errores.value}</Alerta>}

                                </div>
                                <div className="mb-1 space-x-9  relative">
                                    <label className="text-slate-800 w-20 mt-4" htmlFor="telf">Teléfono :</label>
                                    <input
                                        type="text"
                                        id="telf"
                                        className="bg-slate-300 h-6 p-3 mt-4 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                        name="telf"
                                        placeholder="Teléfono Móvil (Formato internacional, ej: +123 4567890123)"
                                        ref={telfRef}
                                        required
                                    />
                                    {errores.telf && <Alerta>{errores.telf}</Alerta>}

                                </div>
                            </div>

                            <div className="absolute h-3/5 bg-zinc-800 w-px left-1/2 transform -translate-x-1/2 "></div>

                            <div className="w-1/2 pl-4 ml-4">
                                <div className="mb-2 space-x-16  relative">
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
                                    {errores.email && <Alerta className = "error-email" >{errores.email}</Alerta>}

                                </div>

                                <div className="mb-2">
                                    <label className="text-slate-800 mb-2">Sexo:</label>
                                    <div className="flex ">
                                        <div className="mx-4">
                                            <label className="flex items-center space-x-2">
                                                <input type="radio" name="gender" value="F" ref={genderRef} />
                                                <span>Femenino</span>
                                            </label>
                                        </div>
                                        <div className="mx-4">
                                            <label className="flex items-center space-x-2">
                                                <input type="radio" name="gender" value="M" ref={genderRef} />
                                                <span>Masculino</span>
                                            </label>
                                        </div>
                                    </div>
                                    {errores.gender && <Alerta>{errores.gender}</Alerta>}

                                </div>
                                <div className="relative mb-2 space-x-6  ">
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
                                    {errores.password && <Alerta>{errores.password}</Alerta>}

                                </div>

                                <div className="mb-2 space-x-8 relative">
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
                                    {errores.password_confirmation && <Alerta>{errores.password_confirmation}</Alerta>}

                                </div>

                                <input
                                    type="submit"
                                    value="Crear Cuenta"
                                    className="bg-transparent hover:bg-zinc-700 text-black hover:text-white w-full md:mt-12 p-0 uppercase font-bold cursor-pointer h-16"
                                />
                            </div>
                        </div>
                    </form>
                    <nav className="mt-0 ml-20">
                        <Link to="/auth/login">
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </nav>
                </div>
            </div>
        </div>


        </div>
    )
}
