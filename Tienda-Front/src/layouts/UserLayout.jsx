import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  const baseURL = import.meta.env.VITE_API_URL;

  return (
    <div className="relative min-h-screen max-h-screen overflow-hidden">
      <img
        src={`${baseURL}/backgrounds/Fondo.png`}
        alt="vegetable background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <main className="relative flex-1 min-h-screen flex items-center justify-center p-3 z-10">
        <Outlet />
      </main>
    </div>
  );
}
