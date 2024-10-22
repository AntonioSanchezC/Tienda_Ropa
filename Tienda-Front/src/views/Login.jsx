import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const [remember, setRemember] = useState(false);
  const [errores, setErrores] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL;
  const { login } = useAuth({
    middleware: "guest",
    url: "/",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      remember,
    };

    login(datos, setErrores);
  };

  return (
    <div className="w-full max-w-md relative p-6 mx-auto font-playfair">
      <div className="absolute top-0 left-0 p-4 z-20">
        <Link to={`/`}>
          <img src={`${baseURL}/icon/backHome.png`} alt="logo icon" className="md:w-[3rem] md:h-[2rem]" />
        </Link>
      </div>
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-contain rounded-lg z-0"
        style={{ backgroundImage: `url(${baseURL}/backgrounds/loginDeco.png)` }}
      ></div>

      <div className="relative rounded-lg space-y-3 p-4 bg-transparent max-w-full z-10 mt-24">
        <h1 className="text-center text-4xl font-black text-black mb-16">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center">
          <div className="flex items-center w-full justify-center md:mb-1">
            <div className="w-24 text-left mr-4">
              <label className="text-slate-800" htmlFor="email">Email:</label>
            </div>
            <input
              type="text"
              id="email"
              className="bg-slate-300 h-6 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none w-1/2"
              name="email"
              placeholder="Correo Electrónico"
              ref={emailRef}
            />
          </div>
          {errores.email && <Alerta>{errores.email}</Alerta>}

          <div className="flex items-center w-full justify-center mt-8 md:mb-1">
            <div className="w-24 text-left mr-4">
              <label className="text-slate-800" htmlFor="password">Contraseña:</label>
            </div>
            <input
              type="password"
              id="password"
              className="bg-slate-300 h-6 p-3 border-b-2 border-gray-400 focus:border-zinc-500 outline-none w-1/2"
              name="password"
              placeholder="Contraseña"
              ref={passwordRef}
            />
          </div>
          {errores.password && <Alerta>{errores.password}</Alerta>}

          <div>
            <input
              type="checkbox"
              checked={remember}
              className="mt-7"
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label>Mantener mi sesión abierta</label>
          </div>

          <input
            type="submit"
            value="Iniciar Sesión"
            className="bg-transparent hover:bg-zinc-700 text-black hover:text-white w-64 mt-5 p-3 uppercase font-bold cursor-pointer h-12"
          />
        </form>
        <nav className="mt-5 ml-8 text-center z-50">
          <Link to="/auth/register">¿No tienes cuenta? Crea tu cuenta</Link>
        </nav>
      </div>
    </div>
  );
}
