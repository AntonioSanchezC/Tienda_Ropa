<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserColletion;
use App\Models\Img;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        return new UserColletion(User::all());
    }

// En UserController.php
public function getUserInfo(Request $request)
{
    // Obtener el usuario autenticado
    $user = $request->user();

    // Cargar la relación de la imagen si existe
    $user->load('imgs');

    return response()->json(
        $user
    );
}



    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validar los datos de la solicitud
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'image' => 'nullable|string|max:255',
        ]);

        // Actualizar los campos del usuario manualmente
        $user->name = $data['name'];
        $user->lastName = $data['lastName'] ?? $user->lastName; // Usa el valor actual si no se proporciona uno nuevo
        $user->gender = $data['gender'] ?? $user->gender;
        $user->address = $data['address'] ?? $user->address;
        $user->email = $data['email'];

        // Guarda los cambios en el usuario
        $user->save();

        // Manejar la subida de la imagen si existe
        $image = $data['image'];

        if ($image) {

            // Si el usuario ya tiene un `img_id`, actualiza el registro correspondiente
            if ($user->img_id) {
                $img = Img::find($user->img_id);
                if ($img) {
                    $img->update(['image' => $image]);
                }
            } else {
                // Si el usuario no tiene `img_id`, crea un nuevo registro de imagen
                $img = Img::create([
                    'image' => $image,
                    'entity' => 'user'
                ]);

                $user->img_id = $img->id;
                $user->save();
            }

        return response()->json(['user' => $image], 200);
    }


    }


    public function updatePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validar los datos de la solicitud
        $data = $request->validate([
            'password' => 'required|string',
            'newPassword' => 'required|string|min:8|confirmed',
        ]);

        // Verificar la contraseña actual
        if (!Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'La contraseña actual no es correcta'], 400);
        }

        // Actualizar la contraseña del usuario
        $user->password = Hash::make($data['newPassword']);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada exitosamente'], 200);
    }


    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Elimina las relaciones de clave foránea si es necesario
        $user->phoneNumbers()->delete(); // Asume que tienes una relación definida en el modelo User

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    // app/Http/Controllers/UserController.php



}
