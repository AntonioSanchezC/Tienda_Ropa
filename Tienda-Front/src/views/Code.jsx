import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function VerificationCode() {
  const [codeParts, setCodeParts] = useState(["", "", "", "", ""]);
  const [errores, setErrores] = useState([]);
  const { code } = useAuth({
    middleware: "auth",
    url: "/",
  });

  const baseURL = import.meta.env.VITE_API_URL;

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
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
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeValue = codeParts.join("");
    const data = {
      code: codeValue,
    };
    code(data, setErrores);
  };

  return (
    <div className="relative min-h-screen">
      <div 
      className="absolute inset-0 w-10/12 h-full bg-no-repeat bg-center bg-contain rounded-lg z-0 "
      style={{ backgroundImage: `url(${baseURL}/backgrounds/CodeDeco.png)` }}>
      </div>
      <div className="relative z-10 flex justify-center items-center min-h-screen font-playfair ">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-lg bg-transparent mt-12 px-10 py-7 rounded-lg"
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
                  className="w-1/6 p-3 bg-slate-200 text-center"
                  maxLength="1"
                  value={part}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onPaste={index === 0 ? handlePaste : null}
                  required
                />
              ))}
            </div>
          </div>
          <input
            type="submit"
            value="Comprobar código"
            className="bg-transparent hover:bg-zinc-700 text-black hover:text-white w-full mt-8 p-3 uppercase font-bold cursor-pointer h-12"
          />
        </form>
      </div>
    </div>
  );
}
