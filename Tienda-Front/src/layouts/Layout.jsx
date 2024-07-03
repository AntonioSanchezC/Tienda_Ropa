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
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'


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
  const {  gender, getProducts, getPromotion } = useQuisco();
  const navigate = useNavigate();

  useEffect(() => {
    if(!gender){
      navigate('/auth/ini')
    }else{
      
      if (gender) {
          getProducts(gender);
          getPromotion(gender);
      }
    }
  }, [gender]);
  
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
