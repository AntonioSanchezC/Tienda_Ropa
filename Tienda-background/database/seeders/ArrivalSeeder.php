<?php

namespace Database\Seeders;

use App\Models\Arrival;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArrivalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Seed para puntos de llegada
        $arrivals = [
            [
                'name' => 'Oficina Correos Cádiz',
                'address' => 'Suc. 3, Avenida de la Sanidad Pública, C/ Gibraltar, S/n, 11011 Cádiz',
                'latitude' => 36.501978, // Latitud del punto de llegada A 36.501978, -6.271356
                'longitude' => -6.271356, // Longitud del punto de llegada A
            ],
            [
                'name' => 'Oficina Correos San Fernando',
                'address' => 'C. Real, 113, 11100 San Fernando, Cádiz',
                'latitude' => 36.462935, // Latitud del punto de llegada B 36.462935, -6.197713
                'longitude' => -6.197713, // Longitud del punto de llegada B
            ],
        ];

        // Insertar los puntos de llegada en la base de datos
        foreach ($arrivals as $arrival) {
            Arrival::create($arrival);
        }
    }
}
