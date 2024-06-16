import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import clienteAxios from "axios";

const Map = ({ deliveryPoint, warehouses, setClosestWarehouse }) => {
    const [map, setMap] = useState(null);

    // Inicializar el mapa solo si no existe
    useEffect(() => {
      if (!map) {
        const mapInstance = L.map("map").setView([51.505, -0.09], 13);
  
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
  
        setMap(mapInstance);
      }
    }, [map]);

  useEffect(() => {
    const calculateDistances = async () => {
      if (!map || !deliveryPoint || warehouses.length === 0) return;

      const deliveryLatLng = L.latLng(deliveryPoint.lat, deliveryPoint.lng);

      const distances = await Promise.all(warehouses.map(async (warehouse) => {
        const warehouseLatLng = L.latLng(warehouse.lat, warehouse.lng);

        const response = await clienteAxios.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
          params: {
            api_key: "5b3ce3597851110001cf6248145b41f1ce724712bb94e2b0f00f2fb4",
            start: `${warehouse.lng},${warehouse.lat}`,
            end: `${deliveryPoint.lng},${deliveryPoint.lat}`
          }
        });

        const distance = response.data.features[0].properties.segments[0].distance;

        return {
          warehouse,
          distance
        };
      }));

      const closest = distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr));

      setClosestWarehouse(closest.warehouse);

      L.marker([deliveryPoint.lat, deliveryPoint.lng]).addTo(map).bindPopup("Punto de Entrega").openPopup();
      L.marker([closest.warehouse.lat, closest.warehouse.lng]).addTo(map).bindPopup("Almacén más cercano").openPopup();
      L.Routing.control({
        waypoints: [L.latLng(closest.warehouse.lat, closest.warehouse.lng), deliveryLatLng],
        router: new L.Routing.openrouteservice("5b3ce3597851110001cf6248145b41f1ce724712bb94e2b0f00f2fb4"),
        geocoder: L.Control.Geocoder.nominatim(),
        routeWhileDragging: true
      }).addTo(map);
    };

    calculateDistances();
  }, [map, deliveryPoint, warehouses, setClosestWarehouse]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default Map;
