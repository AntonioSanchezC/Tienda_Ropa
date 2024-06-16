<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PrefixesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

     public function run(): void
     {

         //Prefijos de numero de telefono

         DB::table('prefixes')->insert([
             'country' => 'Estados Unidos/Canadá',
             'number' => '+1',
             'value' => '1',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);

         DB::table('prefixes')->insert([
             'country' => 'Reino Unido',
             'number' => '+44',
             'value' => '2',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);

         DB::table('prefixes')->insert([
            'country' => 'Australia',
            'number' => '+61',
            'value' => '3',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);

         DB::table('prefixes')->insert([
             'country' => 'Alemania',
             'number' => '+49',
             'value' => '4',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);



         DB::table('prefixes')->insert([
             'country' => 'Francia',
             'number' => '+33',
             'value' => '5',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);

         DB::table('prefixes')->insert([
             'country' => 'España',
             'number' => '+34',
             'value' => '6',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);

         DB::table('prefixes')->insert([
             'country' => 'Italia',
             'number' => '+39',
             'value' => '7',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
         ]);


         DB::table('prefixes')->insert([
            'country' => 'México',
            'number' => '+52',
            'value' => '8',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('prefixes')->insert([
             'country' => 'Brasil',
             'number' => '+55',
             'value' => '9',
             'created_at' => Carbon::now(),
             'updated_at' => Carbon::now(),
        ]);

        DB::table('prefixes')->insert([
              'country' => 'India',
              'number' => '+91',
              'value' => '10',
              'created_at' => Carbon::now(),
              'updated_at' => Carbon::now(),
        ]);

        DB::table('prefixes')->insert([
            'country' => 'China',
            'number' => '+86',
            'value' => '11',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('prefixes')->insert([
            'country' => 'Japón',
            'number' => '+81',
            'value' => '12',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('prefixes')->insert([
            'country' => 'Sudáfrica',
            'number' => '+27',
            'value' => '13',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('prefixes')->insert([
            'country' => 'Argentina',
            'number' => '+54',
            'value' => '14',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('prefixes')->insert([
            'country' => 'Chile',
            'number' => '+56',
            'value' => '15',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('prefixes')->insert([
            'country' => 'Colombia',
            'number' => '+57',
            'value' => '16',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('prefixes')->insert([
            'country' => 'Perú',
            'number' => '+51',
            'value' => '17',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

     }

}
