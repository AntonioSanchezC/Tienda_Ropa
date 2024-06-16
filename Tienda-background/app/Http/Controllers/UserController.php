<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserColletion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return new UserColletion(User::all());
    }

    public function getUserInfo(Request $request)
    {
        $user = $request->user();

        // Obtén la información del usuario junto con los números de teléfono
        $user->load('phoneNumbers');

        return response()->json([
            'message' => 'User info fetched successfully',
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validar los datos de la solicitud
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
        ]);

        // Actualizar el usuario con los nuevos datos
        $user->update($data);

        return response()->json(['user' => $user], 200);
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
