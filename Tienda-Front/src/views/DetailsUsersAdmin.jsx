import { Link, useLocation } from 'react-router-dom';
import useQuisco from "../hooks/useQuiosco"
import clienteAxios from '../config/axios';
import { useState, useRef, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { useAuth } from "../hooks/useAuth";

export default function DetailsUsersAdmin() {
    const location = useLocation();
    const { user } = location.state || {};
    console.log("El valor de user en DetailsUsersAdmin es ", user);

    if (!user) {
        return <div>Error: No se encontró el usuario.</div>;
    }

    const { getPrefixes, getPhone,setEmailValue, prefixes, phone } = useQuisco();

    useEffect(() => {
        getPrefixes();
        getPhone();
    },[])


    const idRef = useRef();
    const nameRef = useRef();
    const lastNameRef = useRef();
    const genderRef = useRef();
    const direRef = useRef();
    const prefRef = useRef();
    const telfRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmtionRef = useRef();

    const [errores, setErrores] = useState([]);
    const { updateUser } = useAuth({
      middleware: 'auth',
      url: '/'
    });
    const handleSubmit = async e => {
        e.preventDefault();

        const datos = {
            id: user.id,
            name: nameRef.current.value,
            lastName: lastNameRef.current.value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            address: direRef.current.value,
            value: prefRef.current.value,
            telf: telfRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmtionRef.current.value
        }

            await updateUser(datos, setErrores);
            setEmailValue(datos.email);


      };
    const [selectPhone, setSelectPhone] = useState({}); 
    const [selectPrefix, setSelectPrefix] = useState({}); 

    useEffect(() => {
        if (phone && phone.length > 0) {
            // Buscar el número de teléfono asociado al user_id del usuario actual
            const selectedPhone = phone.find(item => item.user_id === user.id);
            console.log("El valor de selectedPhone en DetailsUsersAdmin es ", selectedPhone);

            // Si se encuentra un número de teléfono, establecerlo en selectPhone
            if (selectedPhone) {
                setSelectPhone(selectedPhone);
            } else {
                // Si no se encuentra ningún número de teléfono asociado al user_id del usuario actual, establecer un objeto vacío
                setSelectPhone({});
            }
        }
        if (prefixes && prefixes.length > 0) {
            // Buscar el número de teléfono asociado al user_id del usuario actual
            const selectedPrefix = prefixes.find(prefix => prefix.id === selectPhone.prefix_id);
    
            // Si se encuentra un número de teléfono, establecerlo en selectPhone
            if (selectedPrefix) {
                setSelectPrefix(selectedPrefix);
            } else {
                // Si no se encuentra ningún número de teléfono asociado al user_id del usuario actual, establecer un objeto vacío
                setSelectPrefix({});
            }
        }
    }, [user, phone]);
    
  

  return (
    <>
    <h1 className="text-4xl font-black mb-10 mr-6">Datos de Registro</h1>
    <div className="flex">

        <form
            onSubmit={handleSubmit}
            noValidate
            encType="multipart/form-data"
            className="w-full p-2 "

        >  
            <div >
                <input
                type="hidden"
                name="product"
                defaultValue={user.id}
                ref={idRef}

                />
            </div>

                <div className="flex items-start pr-4">
                <div className="w-1/2 pr-4 mt-10">


                        <div >
                            <div >
                                <label className="text-slate-800" htmlFor="name">
                                    Nombre:
                                </label>
                                <input 
                                    defaultValue={user.name}
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Tu Nombre"
                                    className="mt-2 w-full p-3 bg-gray-50"
                                    ref={nameRef}

                                />
                            </div>
                            <div >
                                <label 
                                    className="text-slate-800"
                                    htmlFor="apellido"
                                    >Apellido:
                                </label>
                                <input 
                                defaultValue={user.lastName}
                                className="mt-2 w-full p-3 bg-gray-50"
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    placeholder="Tu Apellido"
                                    ref={lastNameRef}

                                />
                            </div>
                            <div >
                                <label 
                                    className="text-slate-800"
                                    htmlFor="direccion"
                                    >Direccion:
                                </label>
                                <input 
                                
                                defaultValue={user.address}
                                className="mt-2 w-full p-3 bg-gray-50"
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    placeholder="Tu Direccion"
                                    ref={direRef}

                                />
                            </div>

                            <p>El prefijo actual es : {selectPrefix.number}</p>

                            <div >
                                <label 
                                    htmlFor="valor"
                                >Prefijo País:
                                
                                
                                </label>

                                    <select 
                                        id="valor"
                                        name="valor" 
                                        ref={prefRef}
                                        required
                                    >
                                    <option
                                        key={selectPrefix.id}
                                        value={selectPrefix.value}
                                        >
                                        {selectPrefix.number}
                                    </option>
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
                            </div>

                            </div>
                            <div className="w-1/2 pr-4 mt-10">

                            <div >
                                <label  className="text-slate-800" htmlFor="telf">Teléfono :</label>
                                <input
                                defaultValue={selectPhone.number}
                                className="mt-2 w-full p-3 bg-gray-50"

                                        type="text"
                                        id="telf"
                                        name="telf"
                                        placeholder="Teléfono Móvil (Formato internacional, ej: +123 4567890123)"
                                        ref={telfRef}
                                        required
                                />
                            </div>

                        
                        <div>
                        <div className="mb-4">
                          <label className="text-slate-800">Sexo desigando:</label>
                          <div>
                            <div>
                                <label>
                                    <input type="radio" name="gender" value="F" defaultChecked={user.gender === 'F'} /> Femenino
                                </label>
                                <label>
                                    <input type="radio" name="gender" value="M" defaultChecked={user.gender === 'M'} /> Masculino
                                </label>
                            </div>
                          </div>
                        </div>
                            <div >
                                <label 
                                    className="text-slate-800"
                                    htmlFor="email"
                                    >Email:
                                </label>
                                <input 
                                defaultValue={user.email}
                                className="mt-2 w-full p-3 bg-gray-50"

                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Escribe tu Correo Electronico"
                                    ref={emailRef}

                                />
                            </div>
                            <div >
                                <label 
                                    className="text-slate-800"
                                    htmlFor="password"
                                    >Contraseña:
                                </label>
                                <input 
                                defaultValue={user.password}
                                className="mt-2 w-full p-3 bg-gray-50"

                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Escribe tu Contraseña"
                                    ref={passwordRef}

                                />
                            </div>
                            <div >
                                <label 
                                    className="text-slate-800"
                                    htmlFor="password_confirmation"
                                    >Repite tu Contraseña:
                                </label>
                                <input 
                                defaultValue={user.password}
                                className="mt-2 w-full p-3 bg-gray-50"

                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    placeholder="Repite tu Contraseña"
                                    ref={passwordConfirmtionRef}

                                />
                            </div>
                        </div>
                    </div>


                </div>            
                        <input 
                            type="submit"
                            value="Actualizar Cuenta"
                            className="bg-white w-full hover:bg-zinc-700 text-black hover:text-white md:mt-12 p-0 uppercase font-bold cursor-pointer md:h-16"
                        />         

            </form>
        </div>

    </>
)
}
