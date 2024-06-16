import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useQuisco from "../hooks/useQuiosco";
import { ToastContainer } from "react-toastify";

export default function ContactUs() {
    const { handleClickSendClientMessage } = useQuisco();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [submittedValue, setSubmittedValue] = useState('');

    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            firstName,
            lastName,
            email,
            phone,
            message,
        };
        handleClickSendClientMessage(formData);
        setSubmittedValue(formData);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
    };

    return (
        <div className="grid place-content-start md:place-content-center w-full min-h-screen p-4 bg-zinc-300">
            <h1 className="text-4xl font-black mb-10 mr-6">Contactanos</h1>
            <div className=" mt-12 px-10 py-7">
                <p className="mb-4">Rellene el formulario con sus datos</p>
                <p className="mb-4">Y escriba aquello que desee decirnos</p>
                <form onSubmit={handleSubmit} noValidate className="w-full">
                    <div className="flex flex-wrap">
                        <div className="w-1/2 pr-4 mb-4">
                            <label className="text-slate-800 w-full mb-2 block" htmlFor="firstName">Nombre:</label>
                            <input
                                type="text"
                                id="firstName"
                                className="bg-slate-300 w-full h-10 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                name="firstName"
                                placeholder="Tu Nombre"
                                value={firstName}
                                onChange={handleChange(setFirstName)}
                            />
                        </div>
                        <div className="w-1/2 pl-4 mb-4">
                            <label className="text-slate-800 w-full mb-2 block" htmlFor="lastName">Apellido:</label>
                            <input
                                type="text"
                                id="lastName"
                                className="bg-slate-300 w-full h-10 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                name="lastName"
                                placeholder="Tu Apellido"
                                value={lastName}
                                onChange={handleChange(setLastName)}
                            />
                        </div>
                        <div className="w-1/2 pr-4 mb-4">
                            <label className="text-slate-800 w-full mb-2 block" htmlFor="email">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                className="bg-slate-300 w-full h-10 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                name="email"
                                placeholder="Tu Correo Electrónico"
                                value={email}
                                onChange={handleChange(setEmail)}
                            />
                        </div>
                        <div className="w-1/2 pl-4 mb-4">
                            <label className="text-slate-800 w-full mb-2 block" htmlFor="phone">Teléfono:</label>
                            <input
                                type="tel"
                                id="phone"
                                className="bg-slate-300 w-full h-10 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                                name="phone"
                                placeholder="Tu Teléfono"
                                value={phone}
                                onChange={handleChange(setPhone)}
                            />
                        </div>
                    </div>
                    <div className="w-full mb-4">
                        <label className="text-slate-800 w-full mb-2 block" htmlFor="message">Mensaje:</label>
                        <textarea
                            id="message"
                            className="bg-slate-300 w-full h-24 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none"
                            name="message"
                            placeholder="Escribe tu mensaje..."
                            value={message}
                            onChange={handleChange(setMessage)}
                        />
                    </div>
                    <button type="submit" className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full p-3 uppercase font-bold cursor-pointer">
                        Enviar
                    </button>
                </form>
                {submittedValue && (
                    <p className="mt-4">
                        Valor enviado: <strong>{JSON.stringify(submittedValue)}</strong>
                    </p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}
