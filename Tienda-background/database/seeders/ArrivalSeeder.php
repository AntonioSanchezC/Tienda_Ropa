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
                'name' => 'Punto de llegada A',
                'address' => 'Dirección del punto de llegada A',
                'latitude' => 8.681495, // Latitud del punto de llegada A
                'longitude' => 47.629895, // Longitud del punto de llegada A
            ],
            [
                'name' => 'Punto de llegada B',
                'address' => 'Dirección del punto de llegada B',
                'latitude' => 10.681495, // Latitud del punto de llegada B
                'longitude' => 46.629895, // Longitud del punto de llegada B
            ],
        ];

        // Insertar los puntos de llegada en la base de datos
        foreach ($arrivals as $arrival) {
            Arrival::create($arrival);
        }
    }
}
