import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onSuccess, onError }) => {
    const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

    return (
        <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
            <PayPalButtons
                style={{ layout: 'horizontal' }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(function (details) {
                        // Lógica después de que se apruebe el pago
                        onSuccess(details);
                        window.location.href = 'http://localhost:5174/pago-exitoso'; // URL de redirección para pago exitoso
                    });
                }}
                onCancel={() => {
                    // Lógica después de que se cancele el pago
                    window.location.href = 'http://localhost:5174/pago-cancelado'; // URL de redirección para pago cancelado
                }}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
