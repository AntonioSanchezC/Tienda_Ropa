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
                'name' => 'Almacén de Bernardino Abad, S.L.',
                'address' => '13, Mlle. de Levante, 11, 11006 Cádiz',
                'latitude' => 36.529112, // Latitud del almacén A 36.529112, -6.285167
                'longitude' => -6.285167, // Longitud del almacén A
            ],
            [
                'name' => 'El Almacén del Pata Negra',
                'address' => 'C. San Diego de Alcalá, 20, 11100 San Fernando, Cádiz',
                'latitude' => 36.465753, // Latitud del almacén B  36.465753, -6.199023
                'longitude' => -6.199023, // Longitud del almacén B
            ],
        ];

        // Insertar los almacenes en la base de datos
        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}
