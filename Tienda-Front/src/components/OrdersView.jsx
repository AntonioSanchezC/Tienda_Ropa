import React, { useEffect, useState } from "react";
import clienteAxios from '../config/axios';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const pointIconUrl = '/icons/point.png'; // Ruta desde la carpeta 'public' de Laravel

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [mapVisible, setMapVisible] = useState({});  // Estado para controlar la visibilidad del mapa

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');

    const fetchOrders = async () => {
      try {
        const response = await clienteAxios.get('/api/user/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Response data: ', response.data);
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <div>No orders available</div>;
  }

  const customIcon = new L.Icon({
    iconUrl: pointIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  const handleMapVisibility = (orderId) => {
    setMapVisible(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId]
    }));
  };

  return (
    <div className="md:m-5 bg-slate-400 ">
      <h3 className="text-4xl font-black md:my-6">Tus Pedidos</h3>
      {orders.map(order => (
        <div key={order.id} className="mb-8">
          <h4 className="text-2xl font-bold">Pedido {order.code}</h4>
          <p>Total: {order.total}</p>
          <p>Status: {order.status}</p>
          <p>Created At: {order.created_at}</p>
          <p>Updated At: {order.updated_at}</p>

          {order.products && order.products.length > 0 && (
            <>
              <h5 className="font-bold text-xl mt-3">Productos</h5>
              <ul>
                {order.products.map(product => (
                  <li key={product.id}>
                    {product.name} - Quantity: {product.quantity} - Price: {product.price}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p 
            className="text-blue-500 cursor-pointer mt-5" 
            onClick={() => handleMapVisibility(order.id)}
          >
            {mapVisible[order.id] ? 'Ocultar mapa de entregas' : 'Mostrar mapa de entregas'}
          </p>

          {mapVisible[order.id] && order.deliveries && order.deliveries.length > 0 && (
            <div className="flex flex-col md:flex-row mt-5">
              <div className="w-full md:w-1/2">
                <MapContainer 
                  center={[
                    order.deliveries[0].warehouse.latitude, 
                    order.deliveries[0].warehouse.longitude
                  ]} 
                  zoom={13} 
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {order.deliveries.map(delivery => (
                    <React.Fragment key={delivery.id}>
                      <Marker 
                        position={[
                          delivery.warehouse.latitude, 
                          delivery.warehouse.longitude
                        ]}
                      >
                        <Popup>
                          {delivery.departure}
                        </Popup>
                      </Marker>
                      <Marker 
                        position={[
                          delivery.arrival.latitude, 
                          delivery.arrival.longitude
                        ]}
                        icon={customIcon}
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
                {order.deliveries.map(delivery => (
                  <div key={delivery.id} className="mt-4">
                    <p><strong>Warehouse:</strong> {delivery.warehouse.name} ({delivery.departure})</p>
                    <p><strong>Departure Time:</strong> {delivery.departure_time}</p>
                    <p><strong>Arrival:</strong> {delivery.arrival.name} ({delivery.arrival.address})</p>
                    <p><strong>Arrival Time:</strong> {delivery.arrival_time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersView;
