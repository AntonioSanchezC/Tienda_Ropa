<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Seed para almacenes
        $warehouses = [
            [
                'name' => 'Almacén A',
                'address' => 'Dirección del almacén A',
                'latitude' => 8.686507, // Latitud del almacén A
                'longitude' => 49.41943, // Longitud del almacén A
            ],
            [
                'name' => 'Almacén B',
                'address' => 'Dirección del almacén B',
                'latitude' => 11.686507, // Latitud del almacén B
                'longitude' => 53.41943, // Longitud del almacén B
            ],
        ];

        // Insertar los almacenes en la base de datos
        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}
