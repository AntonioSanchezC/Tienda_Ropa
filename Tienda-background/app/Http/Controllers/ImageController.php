<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageUploadRequest;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;


class ImageController extends Controller
{
    public function saveImage(ImageUploadRequest $request)
    {
        try {
            $imagen = $request->file('file');

            if (!$imagen) {
                return response()->json(['error' => 'No se proporcionó una imagen válida.'], 400);
            }

            $nombreImagen = Str::uuid() . "." . $imagen->getClientOriginalExtension();

            $imagenServidor = Image::make($imagen);
            $imagenServidor->encode($imagen->getClientOriginalExtension(), 90);
            $imagenServidor->resize(1000, null, function ($constraint) {
                $constraint->aspectRatio();
            });


            $rutaImagen = 'uploads/' . $nombreImagen;

            // Guardar la imagen en el sistema de archivos
            $imagenServidor->save(public_path($rutaImagen));

            return response()->json(['imagen' => $rutaImagen]);
        } catch (\Exception $e) {
            // Devuelve una respuesta de error más detallada en caso de excepción
            return response()->json(['error' => 'Error al procesar la imagen.', 'exception' => $e->getMessage()], 500);
        }
    }
}
