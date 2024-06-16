import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function VerificationCode() {
  const [codeParts, setCodeParts] = useState(["", "", "", "", ""]); // Array para almacenar las partes del código
  const [errores, setErrores] = useState([]);
  const { code } = useAuth({
    middleware: "auth",
    url: "/",
  });

  const handleChange = (index, value) => {
    const newCodeParts = [...codeParts];
    newCodeParts[index] = value;
    setCodeParts(newCodeParts);
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
        className="md:w-3/5 md:h-1/2 bg-zinc-300 shadow-md border-solid border-2 border-gray-500 mt-12 px-10 py-7"
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
