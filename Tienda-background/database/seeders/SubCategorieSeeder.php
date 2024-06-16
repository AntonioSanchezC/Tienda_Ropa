<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SubCategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        //Tipo c la Ropa
        DB::table('sub_categories')->insert([
            'name' => 'Jeans',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Pantalones',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Camisetas',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Sudaderas',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Cazadoras',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Bermudas',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Camisas',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Punto',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Bañadores',
            'parent_category_id' => DB::table('categories')->where('name', 'Ropa')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        //Tipo d los Zapatos

        DB::table('sub_categories')->insert([
            'name' => 'Zapatillas',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Zapatos Casual',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Botas',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Botines',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Sandalias',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Bermudas',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Alpargatas',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Piel',
            'parent_category_id' => DB::table('categories')->where('name', 'Zapatos')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        //Tipo e los Accesorios

        DB::table('sub_categories')->insert([
            'name' => 'Ropa interior',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Bisuteria',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Calcetines',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('sub_categories')->insert([
            'name' => 'Carteras',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Gorras y gorros',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Cinturones',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Gafas de sol',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        DB::table('sub_categories')->insert([
            'name' => 'Perfumes',
            'parent_category_id' => DB::table('categories')->where('name', 'Accesorios')->value('id'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


    }
}
