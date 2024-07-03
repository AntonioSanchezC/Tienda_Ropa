import useQuisco from "../hooks/useQuiosco";
import {useAuth} from '../hooks/useAuth';
import {useState} from "react" 

export default function Email() {
    const { handleClickEnviarMensaje, mensajeEnviado, addressRecent, addressCode, generateNumber,handleClickCode } = useQuisco();

    const [errores, setErrores] = useState([]);
    const {verifyEmail} = useAuth()


    const generateNumberAndSend = async (address) => {
        // Genera un número aleatorio de dirección
        const newAddressCode = String(Math.floor(10000 + Math.random() * 90000)); // Genera un número de 5 dígitos

        // Llama a la función para enviar el mensaje, pasando la dirección y el código generado
        handleClickEnviarMensaje(address, newAddressCode);
        verifyEmail(newAddressCode, setErrores); 
    };

    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
                    generateNumberAndSend(addressRecent); // Llamar a la función dentro del manejador de evento onSubmit
                }}
                noValidate
            >
                <input 
                    type="submit"
                    value="Enviar un mensaje"
                    className="bg-white w-full hover:bg-zinc-700 text-black hover:text-white md:mt-12 p-0 uppercase font-bold cursor-pointer md:h-16"
                    />
            
                {mensajeEnviado && (
                    <div>
                        <p className="text-slate-800">Mensaje enviado con éxito. ¡Gracias!</p>
                    </div>
                )}
            </form>
    
        </>
    );
}