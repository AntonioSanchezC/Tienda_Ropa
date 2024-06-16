import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import clienteAxios from 'axios';

const PayPalPayment = ({ orderData, onPaymentSuccess }) => {

  const captureOrder = async (paymentID, payerID) => {
    try {
      const response = await clienteAxios.post('http://localhost/api/capture-order', {
        paymentID,
        payerID,
        total: orderData.total,
        products: orderData.products,
        arrivalId: orderData.arrivalId
      });
      console.log('Order captured successfully:', response.data.message);
      console.log('Order.paymentId captured successfully:', response.data.paymentId);
      console.log('Order.payerId captured successfully:', response.data.payerId);
      console.log('Order.total captured successfully:', response.data.total);
      console.log('Order.products captured successfully:', response.data.products);
      console.log('Order.arrivalId captured successfully:', response.data.arrivalId);
      onPaymentSuccess(response.data); // Llama al callback onPaymentSuccess si es necesario
    } catch (error) {
      if (error.response) {
        console.error('Error in response:', error.response.data);
      } else {
        console.error('Error capturing order:', error.message);
      }
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "AZFdIK3fHvxMgCVr91s9ldQVcTDi_8W7A8dizMdec2vv9Vwy-QmyjxElqKQqT5eYLYVvEZtnowFDrQYV" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (orderData.total / 100).toFixed(2),
              },
            }],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            const paymentID = details.id;
            console.log("Detalles de la orden de PayPal capturados:", details);
            console.log("Detalles de paymentID de PayPal:", paymentID);

            // Llama a la función para capturar la orden en tu backend usando Axios
            await captureOrder(paymentID, details.payer.payer_id); // Nota: usa details.payer.payer_id para obtener el payerID
          } catch (error) {
            console.error('Error en la captura de la orden:', error);
          }
        }}
        onError={(err) => {
          console.error(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
