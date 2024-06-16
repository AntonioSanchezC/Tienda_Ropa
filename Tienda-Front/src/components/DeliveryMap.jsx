import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import clienteAxios from '../config/axios';

const DeliveryMap = ({ orderId }) => {
    const [warehouses, setWarehouses] = useState([]);
    const [arrival, setArrival] = useState(null);

    useEffect(() => {
        // Función para obtener los datos de las entregas
        const fetchDeliveryData = async () => {
            try {
                const token = localStorage.getItem('AUTH_TOKEN');
                const response = await clienteAxios.get(`/api/orders/${orderId}/deliveries`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const deliveries = response.data.data;

                const warehouseCoords = deliveries.map(delivery => ({
                    id: delivery.warehouse.id,
                    lat: delivery.warehouse.latitude,
                    lng: delivery.warehouse.longitude,
                }));

                setWarehouses(warehouseCoords);

                if (deliveries.length > 0) {
                    setArrival({
                        lat: deliveries[0].arrival.latitude,
                        lng: deliveries[0].arrival.longitude,
                    });
                }
            } catch (error) {
                console.error('Error fetching delivery data:', error);
            }
        };

        fetchDeliveryData();
    }, [orderId]);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {warehouses.map(warehouse => (
                <Marker key={warehouse.id} position={[warehouse.lat, warehouse.lng]}>
                    {/* Opcional: Popup para más información sobre el almacén */}
                </Marker>
            ))}
            {arrival && (
                <Marker position={[arrival.lat, arrival.lng]} icon={L.icon({ iconUrl: './public/icon/point.png' })}>
                    {/* Opcional: Popup para más información sobre el punto de llegada */}
                </Marker>
            )}
            {arrival && warehouses.length > 0 && (
                <Polyline positions={warehouses.map(w => [w.lat, w.lng]).concat([[arrival.lat, arrival.lng]])} />
            )}
        </MapContainer>
    );
};

export default DeliveryMap;

ChatGPT
