import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clienteAxios from '../config/axios';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const pointIconUrlGo = '/icon/Go.png';
const pointIconUrlArrive = '/icon/Arrive.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function DetailsOrder() {
  
  const location = useLocation();
  const { orderD } = location.state || {};
  const { user, products } = orderD;
  console.log('El valor de orderD dentro del DetailsOrder es : ', orderD);
  const [deliveries, setDeliveries] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);  // Estado para controlar la visibilidad del mapa

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');

    const fetchDeliveries = async () => {
      try {
        const response = await clienteAxios.get(`/api/orders/${orderD.id}/deliveries`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
        });
        console.log('Response data: ', response.data);
        setDeliveries(response.data.deliveries); // Asegúrate de acceder correctamente a los datos
        console.log('Message : ', response.data.message);
        console.log('El valor de deliveries dentro del controlador es : ', response.data.deliveries);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, [orderD.id]);

  if (!user) {
    return <div>No user data available</div>;
  }

  const customIconGo = new L.Icon({
    iconUrl: pointIconUrlGo,
    iconSize: [18, 18],  
    iconAnchor: [12, 12],  
    popupAnchor: [0, -10],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  const customIconArrive = new L.Icon({
    iconUrl: pointIconUrlArrive,
    iconSize: [18, 18],  
    iconAnchor: [12, 12],  
    popupAnchor: [0, -10],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  return (
    <div className="md:m-5">
      <h3 className="text-4xl font-black md:my-6">Detalles de pedido</h3>
      <div className="">
        <h2 className="font-bold text-2xl  md:mt-3">Detalles de usuario</h2>
        <div className="md:ml-3">
          <p>Name: {user.name}</p>
          <p>Last Name: {user.lastName}</p>
          <p>Address: {user.address}</p>
          <p>Email: {user.email}</p>
        </div>

        <h2 className="font-bold text-2xl  md:mt-3">Datos de pedido</h2>
        <div className="md:ml-3">
          <p>Order Code: {orderD.code}</p>
          <p>Total: {orderD.total}</p>
          <p>Status: {orderD.status}</p>
          <p>Created At: {orderD.created_at}</p>
          <p>Updated At: {orderD.updated_at}</p>
        </div>

        <h2 className="font-bold text-2xl  md:mt-3">Lista de productos</h2>
        <ul className="md:ml-3">
          {products.map(product => (
            <li key={product.id} className="mb-2">
              <p>Product Name: {product.name} - Quantity: {product.quantity} - Price: {product.price}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Párrafo que muestra el mapa al hacer clic */}
      <p 
        className="text-blue-500 cursor-pointer mt-5" 
        onClick={() => setMapVisible(!mapVisible)}
      >
        {mapVisible ? 'Ocultar mapa' : 'Mostrar mapa de entregas'}
      </p>

      {mapVisible && deliveries.length > 0 && (
        <div className="flex flex-col md:flex-row mt-5">
          <div className="w-full md:w-1/2">
            <MapContainer 
              center={[deliveries[0].warehouse.latitude, deliveries[0].warehouse.longitude]} 
              zoom={13} 
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {deliveries.map(delivery => (
                <React.Fragment key={delivery.id}>
                  <Marker 
                    position={[delivery.warehouse.latitude, delivery.warehouse.longitude]}
                    icon={customIconGo} // Usar el icono personalizado para el punto de partida
                  >
                    <Popup>
                      {delivery.warehouse.address}
                    </Popup>
                  </Marker>
                  <Marker 
                    position={[delivery.arrival.latitude, delivery.arrival.longitude]}
                    icon={customIconArrive} // Usar el icono personalizado para el punto de entrega
                  >
                    <Popup>
                      {delivery.arrival.address}
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [delivery.warehouse.latitude, delivery.warehouse.longitude],
                      [delivery.arrival.latitude, delivery.arrival.longitude]
                    ]}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
          <div className="w-full md:w-1/2 md:pl-5">
            <h2 className="font-bold text-2xl">Detalles de Entregas</h2>
            {deliveries.map(delivery => (
              <div key={delivery.id} className="mt-4">
                <p><strong>Warehouse:</strong> {delivery.warehouse.name} ({delivery.warehouse.address})</p>
                <p><strong>Departure Time:</strong> {delivery.departure_time}</p>
                <p><strong>Arrival:</strong> {delivery.arrival.name} ({delivery.arrival.address})</p>
                <p><strong>Arrival Time:</strong> {delivery.arrival_time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
