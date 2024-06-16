<?php

namespace App\Http\Controllers;
use App\Http\Requests\AddProductoRequest;
use App\Http\Requests\ImgRequest;
use App\Http\Requests\PromotionProductsRequest;
use App\Http\Requests\PromotionRequest;
use App\Models\Color;
use App\Models\Img;
use App\Models\ImgProduct;
use App\Models\PhoneNumber;
use App\Models\Prefix;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\PromotionProduct;
use App\Models\Size;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\WarehouseProduct;
use App\Models\WarehouseProducts;
use App\Models\warehouses_products;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{

////////////7/////////////////////////////Product/////////////////////////////////////////
public function insertProduct(AddProductoRequest $request)
{
    DB::beginTransaction();

    try {
        // Validar el registro
        $data = $request->validated();

        // Crear o buscar la talla
        $size = Size::firstOrCreate(['name' => $data['size']], ['code' => strtoupper(substr($data['size'], 0, 3))]);
        $sizeId = $size->id;

        // Crear o buscar el color
        $color = Color::firstOrCreate(
            ['name' => $data['color'], 'code_color' => $data['code_color']],
            ['code_shop' => strtoupper(substr($data['code_color'], 2, 5))]
        );
        $colorId = $color->id;

        // Crear la imagen
        $image = Img::create([
            'image' => $data['image'],
            'entity' => $data['entity'],
        ]);
        $imageId = $image->id;

        // Crear el producto
        $product = Product::create([
            'name' => $data['name'],
            'gender' => $data['gender'],
            'price' => $data['price'],
            'available' => $data['disp'],
            'description' => $data['description'],
            'sub_categories_id' => $data['subcate'],
            'novelty' => $data['novelty'],
            'quantity' => $data['quantity'],
        ]);

        // Asociar el producto con la talla y el color
        $product->sizes()->attach($sizeId);
        $product->colors()->attach($colorId);

        // Crear la relación entre imagen y producto
        ImgProduct::create([
            'img_id' => $imageId,
            'product_id' => $product->id,
        ]);

        // Conectar el almacén y el producto
        warehouses_products::create([
            'warehouse_id' => $data['warehouses'],
            'product_id' => $product->id,
        ]);

        // Confirmar la transacción
        DB::commit();

        return response()->json([
            'message' => 'Producto y relación de imagen creados exitosamente.',
            'product' => $product,
            'full_product_code' => $product->generateFullProductCode(),
            'image' => $image,
            'sizeId' => $sizeId,
            'colorId' => $colorId,
        ], 201);
    } catch (Exception $e) {
        // Deshacer la transacción en caso de error
        DB::rollback();

        // Manejar el error y devolver una respuesta de error
        return response()->json([
            'error' => 'Error al crear producto e imagen.',
            'message' => $e->getMessage(), // Para más detalles sobre el error
        ], 500);
    }
}


    public function deleteProduct(Request $request)
    {

        try {
            $productId = $request->input('prod'); // Obtiene el valor del parámetro 'prod' enviado en la solicitud POST


            // Obtener los IDs de las imágenes relacionadas al producto
            $imgIds = ImgProduct::where('product_id', $productId)->pluck('img_id')->toArray();

            // Eliminar las imágenes del sistema de archivos
            foreach ($imgIds as $imgId) {
                $img = Img::find($imgId);
                if ($img ) {
                    $ruteImage = public_path($img ->image);
                    if (File::exists($ruteImage)) {
                        File::delete($ruteImage);
                    }
                }
            }


            // Eliminar las imágenes de la tabla 'imgs'
            Img::where('id', $imgIds)->delete();



            // Eliminar las imágenes relacionadas del producto de la tabla 'img_products'
            ImgProduct::where('product_id', $productId)->delete();

            // Eliminar el producto de la tabla 'products'
            Product::where('id', $productId)->delete();
            // Si todo se ejecuta correctamente, devuelve una respuesta exitosa
            return response()->json(['message' => 'Producto eliminado exitosamente'], 200);
        } catch (Exception $e) {
            // En caso de error, devuelve un mensaje de error
            return response()->json(['message' => 'Error al eliminar el producto'], 500);
        }

    }
    public function updateProduct(Request $request)
    {
        DB::beginTransaction();

        try {
            // Obtener los datos del formulario
            $data = $request->all();

            // Actualizar la imagen si se proporciona una nueva
            if ($data['image']) {
                $imgIds = ImgProduct::where('product_id', $data['id'])->pluck('img_id')->toArray();

                // Actualizar la ruta de la imagen en la base de datos
                Img::where('id', $imgIds)->update([
                    'image' => $data['image'],
                ]);

                // Eliminar la imagen anterior del sistema de archivos
                $oldImagePath = public_path($data['oldrute']);
                if (File::exists($oldImagePath)) {
                    File::delete($oldImagePath);
                }
            }

            // Actualizar el producto
            $product = Product::find($data['id']);
            $product->update([
                'name' => $data['name'],
                'price' => $data['price'],
                'available' => $data['disp'],
                'description' => $data['description'],
                'sub_categories_id' => $data['subcate'],
                'novelty' => $data['novelty'],
                'size' => $data['size'],
                'color' => $data['color'],
                'quantity' => $data['quantity'],
            ]);

            // Confirmar la transacción
            DB::commit();

            return response()->json([
                'message' => 'Producto actualizado exitosamente.',
                'product' => $product,
            ], 200);
        } catch (Exception $e) {
            // Deshacer la transacción en caso de error
            DB::rollback();

            // Manejar el error y devolver una respuesta de error
            return response()->json([
                'error' => 'Error al actualizar el producto.',
            ], 500);
        }
    }

////////////7/////////////////////////Users///////////////////////////////////////////
public function deleteUser(Request $request)
{

    try {
        $userId = $request->input('user');

        // Eliminar el teléfono del usuario
         PhoneNumber::where('user_id', $userId)->delete();



        // Eliminar el usuario de la tabla
        User::where('id', $userId)->delete();


        // Si todo se ejecuta correctamente, devuelve una respuesta exitosa
        return response()->json(['message' => 'Usuario eliminado exitosamente'], 200);
    } catch (Exception $e) {
        // En caso de error, devuelve un mensaje de error
        return response()->json(['message' => 'Error al eliminar el usuario'], 500);
    }

}
public function updateUser(Request $request)
{
    try {
        // Obtener los datos del formulario
        $data = $request->all();

        // Verificar si se proporciona un nuevo número de teléfono
        if ($request->has('telf')) {
            // Obtener el número de teléfono asociado al usuario
            $phoneNumber = PhoneNumber::where('user_id', $data['id'])->first();

            // Actualizar el número de teléfono con el nuevo número
            $phoneNumber->number = $request->input('telf');
            $phoneNumber->save();
        }

        // Verificar si se proporciona un nuevo prefijo
        if ($request->has('value')) {
            // Obtener el número de teléfono asociado al usuario
            $phoneNumber = PhoneNumber::where('user_id', $data['id'])->first();

            // Obtener el prefijo asociado al nuevo valor proporcionado
            $prefix = Prefix::where('value', $request->input('value'))->first();

            // Verificar si se encontró el prefijo
            if ($prefix) {
                // Asignar el nuevo prefijo al número de teléfono
                $phoneNumber->prefix()->associate($prefix);
                $phoneNumber->save();
            }
        }

        // Actualizar el usuario
        $user = User::findOrFail($data['id']);
        $user->name = $request->input('name');
        $user->lastName = $request->input('lastName');
        $user->address = $request->input('address');
        $user->email = $request->input('email');

        // Actualizar la contraseña si se proporciona una nueva
        if ($request->has('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        $user->save();

        // Si todo se ejecuta correctamente, devuelve una respuesta exitosa
        return response()->json(['message' => 'Usuario actualizado exitosamente'], 200);
    } catch (Exception $e) {
        // En caso de error, devuelve un mensaje de error
        return response()->json(['message' => 'Error al actualizar el usuario'], 500);
    }
}







////////////7/////////////////////////Promotion///////////////////////////////////////////

    public function insertPromotion(PromotionRequest $request)
    {
        DB::beginTransaction();

        try {
            // Validar el registro
            $data = $request->validated();

            //Crear la imagen
            $image = Img::create([

                'image' => $data['image'],
                'entity' => $data['entity'],
            ]);
            $imageId = $image->id;

            //Crear la promocion
             Promotion::create([

                'name' => $data['name'],
                'description' => $data['description'],
                'tipe' => $data['tipe'],
                'discount' => $data['discount'],
                'status' => $data['status'],
                'id_imgs' =>$imageId


            ]);
            // Confirmar la transacción
            DB::commit();
            // Devolver una respuesta exitosa
            return response()->json([
                'message' => 'Promocion introducida exitosamente.',

            ], 201);
        } catch (Exception $e) {
            // Deshacer la transacción en caso de error
            DB::rollback();
            // Manejar el error y devolver una respuesta de error
            return response()->json([
                'error' => 'Error al crear producto e imagen.',
            ], 500);
        }

    }

    public function promoProducts(PromotionProductsRequest $request)
    {
        try {
            // Validar el registro
            $data = $request->validated();

            // Consultar si ya existe una relación entre la promoción y el producto
            $existingRelation = PromotionProduct::where('promotion_id', $data['promotion_id'])
                ->where('product_id', $data['product_id'])
                ->first();

            if ($existingRelation) {
                // Si la relación ya existe, actualizar el campo quantity sumándole uno
                $existingRelation->quantity += 1;
                $existingRelation->save();
            } else {
                // Si la relación no existe, crear una nueva entrada en la tabla intermedia con quantity igual a uno
                PromotionProduct::create([
                    'promotion_id' => $data['promotion_id'],
                    'product_id' => $data['product_id'],
                    'quantity' => 1,
                ]);
            }

            // Devolver una respuesta exitosa
            return response()->json([
                'message' => 'Promoción enlazada exitosamente.',
            ], 201);
        } catch (Exception $e) {
            // Manejar el error y devolver una respuesta de error
            return response()->json([
                'error' => 'Error al relacionar producto y promociones.',
            ], 500);
        }
    }





    public function img(ImgRequest $request)
    {


        // Validar el registro
        $data = $request->validated();

        //Crear el usuario
        $user = Img::create([

            'image' => $data['image'],
            'entity' => $data['entity'],

        ]);

        // return response()->json(['message' => 'Registro exitoso'], 200);


    }




}
