import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Importa Leaflet

export default function UbiCenter() {
    const [arrival, setArrival] = useState(null);
    const baseURL = 'http://localhost'; 

    // Define el icono personalizado
    const myIcon = L.icon({
        iconUrl: `${baseURL}/icon/point.png`, // Reemplaza 'url_del_icono' con la URL de tu icono
        iconSize: [32, 32], // Tamaño del icono
        iconAnchor: [16, 32], // Punto de anclaje del icono
    });

    return (
        <div className="flex flex-col items-center p-6 mb-12">
            <MapContainer center={[36.593423, -6.238616]} zoom={13} style={{ height: "200px", width: "70%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {arrival && (
                    <Marker position={[arrival.lat, arrival.lng]} icon={myIcon}>
                        {/* Opcional: Popup para más información sobre el punto de llegada */}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
