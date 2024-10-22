export default function Alert({ children }) {
  return (
    <div className="text-red-600 text-sm mt-1 z-20">
      {children}
    </div>
  );
}
