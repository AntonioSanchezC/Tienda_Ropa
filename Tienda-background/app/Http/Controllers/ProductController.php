<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductCollection;
use App\Models\Color;
use App\Models\Product;
use App\Models\Size;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener productos agrupados por nombre y tomar solo uno por cada grupo
        $products = Product::with('imgs')
            ->select('products.*')
            ->join(DB::raw('(SELECT MIN(id) as id FROM products GROUP BY name) as grouped_products'), 'products.id', '=', 'grouped_products.id')
            ->orderBy('products.id', 'DESC')
            ->get();

        // Retornar los productos agrupados en una colección de productos
        return new ProductCollection($products);
    }






    public function getSizesAndColors($productCode)
    {
        try {
            // Buscar todos los productos que comparten el mismo código base
            $products = Product::where('product_code', $productCode)->get();

            // Obtener todas las tallas y colores de esos productos
            $sizes = [];
            $colors = [];

            foreach ($products as $prod) {
                $prodSizes = $prod->sizes;
                $prodColors = $prod->colors;

                foreach ($prodSizes as $size) {
                    if (!in_array($size, $sizes)) {
                        $sizes[] = $size;
                    }
                }

                foreach ($prodColors as $color) {
                    if (!in_array($color, $colors)) {
                        $colors[] = $color;
                    }
                }
            }

            return response()->json([
                'message' => 'Los campos searched se han actualizado correctamente',
                'sizes' => $sizes,
                'colors' => $colors,
                'products' => $products,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error al obtener tallas y colores del producto.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    public function GetProductsByCode(Request $request)
    {
        $productCode = $request->input('product_code');
        $sizeId = $request->input('size_id');

        $products = Product::where('product_code', $productCode)->get();

        $sizes = Size::whereHas('products', function ($query) use ($productCode) {
            $query->where('product_code', $productCode);
        })->get();

        $colors = Color::whereHas('products', function ($query) use ($productCode, $sizeId) {
            $query->where('product_code', $productCode);
            if ($sizeId) {
                $query->whereHas('sizes', function ($query) use ($sizeId) {
                    $query->where('size_id', $sizeId);
                });
            }
        })->get();

        return response()->json([
            'products' => $products,
            'sizes' => $sizes,
            'colors' => $colors,
        ]);
    }



    public function searchCount(Request $request)
    {
        // Verificar si se recibieron datos en la solicitud
            // Obtener los productos de la solicitud
            $products = $request->all();

            // Iterar sobre los productos y aumentar el campo searched en 1
            foreach ($products as $product) {
                // Obtener el producto por su ID
                $productModel = Product::find($product['id']);

                // Verificar si se encontró el producto
                if ($productModel) {
                    // Incrementar el campo searched
                    $productModel->searched++;

                    // Guardar los cambios en la base de datos
                    $productModel->save();
                }
            }

            // Retornar una respuesta exitosa
            return response()->json(['message' => 'Los campos searched se han actualizado correctamente'], 200);

    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $producto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
        $product->available = 0;
        $product->save();
        return [
            'product' => $product
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $producto)
    {
        //
    }
}
