import { Outlet, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import useQuisco from '../hooks/useQuiosco';
import Head from '../components/Head';
import { useAuth } from "../hooks/useAuth";
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import ModalProducto from '../components/ModalProducto';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "60rem", // Fixed width
    height: "25rem", // Fixed height
    padding: "2rem" // Padding for better spacing inside the modal
  },
};

Modal.setAppElement('#root');

export default function Layout() {
  const { user, error } = useAuth({ middleware: 'auth' });
  const { gender, modal, getProducts, getPromotion, throttledGetProducts, throttledGetPromotion, isGenderResolved, product, modalActivate } = useQuisco();
  const navigate = useNavigate();
  const [resolvedGender, setResolvedGender] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genderValue = await gender;
        setResolvedGender(genderValue);
        console.log("El valor de gender es ", genderValue);
        if (isGenderResolved) {
          if (!genderValue) {
            navigate('/public/ini');
          } else {
            await getProducts(genderValue);
            await getPromotion(genderValue);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [gender, navigate, modalActivate]);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [location.pathname]);



  if (resolvedGender === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div> 
        <Head className="z-20" />
        <div>
          <div>
            <Outlet />
          </div>
          <div className="flex-grow"></div>
        </div>
        <Footer />
      </div>
      <ToastContainer />

      {modal && (
        <Modal isOpen={modal} style={customStyles}>
          <ModalProducto />
        </Modal>
      )}
    </>
  );
}
