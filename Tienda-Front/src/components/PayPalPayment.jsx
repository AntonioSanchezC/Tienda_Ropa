import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import clienteAxios from '../config/axios';
import useQuiosco from "../hooks/useQuiosco";

const PayPalPayment = ({ orderData }) => {
  const [paypalOrderData, setPaypalOrderData] = useState(orderData);
  const [isOrderApproved, setIsOrderApproved] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const { handleSubmitNewOrderSuccess } = useQuiosco();
  const [errores, setErrores] = useState([]);


  const captureOrder = async (orderData) => {
    const token = localStorage.getItem('AUTH_TOKEN');
    console.log("Datos de orderData desde captureOrder:", orderData);

    try {
      const response = await clienteAxios.post('/api/ordersSuccess', {
        total: orderData.total,
        arrivalId: orderData.arrivalId,
        products: orderData.products,
        paypal_order_id: transactionId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Order captured successfully:', response.data.validated);
    } catch (error) {
      if (error.response) {
        console.error('Error in response:', error.response.data);
      } else {
        console.error('Error capturing order:', error.message);
      }
    }
  };


  useEffect(() => {
    setPaypalOrderData(orderData);
    console.log("useEffect actualizó paypalOrderData:", orderData);
  }, [orderData]);

  useEffect(() => {
    if(isOrderApproved === true ){
      handleSubmitNewOrderSuccess(paypalOrderData,transactionId, setErrores);
      setIsOrderApproved(false);
    };
  }, [transactionId]);




  
  return (
    <PayPalScriptProvider options={{ "client-id": "AZFdIK3fHvxMgCVr91s9ldQVcTDi_8W7A8dizMdec2vv9Vwy-QmyjxElqKQqT5eYLYVvEZtnowFDrQYV" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          console.log("Creando orden con total:", (paypalOrderData.total / 100).toFixed(2));
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (paypalOrderData.total / 100).toFixed(2), // Verifica si esta conversión es correcta
              },
            }],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("Detalles de la orden de PayPal capturados:", details);
            setTransactionId(details.id); // Captura y almacena el ID de la transacción
            setIsOrderApproved(true); // Marca la orden como aprobada
          } catch (error) {
            console.error('Error en la captura de la orden:', error);
          }
        }}
        onError={(err) => {
          console.error('Error en PayPal Buttons:', err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
