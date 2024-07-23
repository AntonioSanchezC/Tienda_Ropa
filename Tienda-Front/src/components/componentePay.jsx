import clienteAxios from "../config/axios";


const ComponentePay = ({ orderData }) => {
  // Aquí puedes realizar las comprobaciones necesarias
  console.log("Datos recibidos en ComponentePay:", orderData);


    const handleSubmit = async (orderData) => {
        console.log("El valor de orderData desde handleSubmit es", orderData);
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
          const { data } = await clienteAxios.post('/api/ordersSuccess', {
            total: orderData.total,
            arrivalId: orderData.arrivalId,
            products: orderData.products,
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Order captured successfully:', data.validated);

        } catch (error) {
          console.log(error);
          if (error.response && error.response.data.errors) {
            const backendErrors = Object.values(error.response.data.errors).flat();
            setErrores(backendErrors);
          } else {
            setErrores(["Hubo un problema al procesar tu pedido. Inténtalo de nuevo."]);
          }
        }
      
  }

  return (
    <div>
      <h2>Datos del Pedido</h2>
      <button onClick={() => handleSubmit(orderData)}>
      Presiona papuuuuu
      </button>
    </div>
  );
};

export default ComponentePay;
