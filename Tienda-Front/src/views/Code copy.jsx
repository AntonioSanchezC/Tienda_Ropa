import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function VerificationCode() {
  const [codeParts, setCodeParts] = useState(["", "", "", "", ""]); // Array para almacenar las partes del código
  const [errores, setErrores] = useState([]);
  const { code } = useAuth({
    middleware: "auth",
    url: "/",
  });

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1); // Asegúrate de que solo se ingrese un carácter por campo
    }
    const newCodeParts = [...codeParts];
    newCodeParts[index] = value;
    setCodeParts(newCodeParts);
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text");
    if (pasteData.length === 5) {
      const newCodeParts = pasteData.split("").map(char => char.slice(0, 1));
      setCodeParts(newCodeParts);
      e.preventDefault(); // Previene que el valor pegado sea ingresado en el primer campo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Unir las partes del código en una cadena
    const codeValue = codeParts.join("");

    const data = {
      code: codeValue,
    };
    code(data, setErrores);
  };

  return (
    <div className="md:m-12 flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="md:w-2/5 md:h-3/5 bg-zinc-300 shadow-md border-solid border-2 border-gray-500 mt-12 px-10 py-7"
      >
        <div>
          <label className="space-x-8 text-xl text-slate-800" htmlFor="code">
            Ingrese el código numérico enviado al correo electrónico:
          </label>
          <div className="flex space-x-2 mt-5">
            {codeParts.map((part, index) => (
              <input
                key={index}
                type="text"
                className="w-1/4 p-3 bg-gray-50"
                maxLength="1"
                value={part}
                onChange={(e) => handleChange(index, e.target.value)}
                onPaste={index === 0 ? handlePaste : null} // Solo el primer campo escucha el evento onPaste
                required
              />
            ))}
          </div>
        </div>
        <input
          type="submit"
          value="Comprobar código"
          className="bg-white hover:bg-zinc-700 text-black hover:text-white w-full md:mt-12 p-0 uppercase font-bold cursor-pointer h-16"
        />
      </form>
    </div>
  );
}
