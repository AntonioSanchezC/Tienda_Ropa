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
    public function indexAdminSex($gender)
    {
        // Obtener productos agrupados por nombre y tomar solo uno por cada grupo
        $products = Product::with('imgs')
            ->where('gender', $gender)
            ->select('products.*')
            ->orderBy('products.id', 'DESC')
            ->get();

        // Retornar los productos agrupados en una colección de productos
        return new ProductCollection($products);
    }

    public function indexAdmin()
        {
            // Obtener todos los productos con imágenes
            $products = Product::with('imgs')
            ->orderBy('products.id', 'DESC')
            ->get();

            return new ProductCollection($products);
        }


    public function index($gender)
    {
        // Verifica que el género sea válido ('M' o 'F')
        if (!in_array($gender, ['M', 'F'])) {
            return response()->json(['error' => 'Género inválido'], 400);
        }

        // Obtener productos con el género especificado
        $products = Product::with('imgs')
            ->where('gender', $gender)
            ->select('products.*')
            ->join(DB::raw('(SELECT MIN(id) as id FROM products WHERE gender = ? GROUP BY name) as grouped_products'), 'products.id', '=', 'grouped_products.id')
            ->setBindings([$gender], 'join')
            ->orderBy('products.id', 'DESC')
            ->get();

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

    public function getProductSizesColorsImages($productCode)
    {
        $products = Product::where('name', $productCode)
            ->with(['sizes', 'colors', 'imgs'])
            ->get();

        return response()->json([
            'products' => $products,
        ]);
    }



    public function getProductsByCode($productCode)
    {
        // Paso 1: Encontrar el producto específico con el código dado
        $product = Product::where('product_code', $productCode)
            ->with(['sizes', 'colors', 'imgs'])
            ->first();

        // Verificar si se encontró el producto
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        // Paso 2: Obtener todos los productos que tengan el mismo nombre
        $products = Product::where('name', $product->name)
            ->where('product_code', '!=', $productCode) // Excluir el producto específico del resto
            ->with(['sizes', 'colors', 'imgs'])
            ->get();

        // Paso 3: Insertar el producto específico al inicio del array
        $allProducts = collect([$product])->merge($products);

        return response()->json([
            'products' => $allProducts,
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
