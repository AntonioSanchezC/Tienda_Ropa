import { Outlet } from 'react-router-dom';
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import Sidebar from '../components/Sidebar';
import Resumen from '../components/Resumen';
import useQuisco from '../hooks/useQuiosco';
import ModalProducto from '../components/ModalProducto';
import Head from '../components/Head';
import { useAuth } from "../hooks/useAuth";
import '../styles/style.css';
import Footer from '../components/Footer';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement('#root')

export default function Layout() {
  const { user, error } = useAuth({ middleware: 'auth' });
  const { modal, users, genderProducts } = useQuisco();
console.log("El valor de products desde Layout es ", genderProducts);
  return (
    <>
      <div > 
        <Head className=" z-20" />
        <div >
          <div >
            <Outlet className="z-10 "/>
          </div>

          <div className="flex-grow">

          </div>
        </div>

        <Footer/>
      </div>
      <ToastContainer />
    </>
  )
}
