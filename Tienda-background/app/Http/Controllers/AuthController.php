<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\PhoneNumber;
use App\Models\Prefix;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        // Validar el registro
        $data = $request->validated();

        // Crear el usuario
        $user = User::create([
            'name' => $data['name'],
            'lastName' => $data['lastName'],
            'address' => $data['address'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        // Crear el número de teléfono asociado al usuario y al prefijo correspondiente
        $phoneNumber = new PhoneNumber([
            'number' => $data['telf'],
        ]);

        // Obtener el prefijo asociado al ID proporcionado
        $prefix = Prefix::find($data['value']);

        // Verificar si se encontró el prefijo
        if ($prefix) {
            // Asignar el prefijo al número de teléfono
            $phoneNumber->prefix()->associate($prefix);
        }

        // Asignar el usuario al número de teléfono
        $phoneNumber->user()->associate($user);
        $phoneNumber->save();

        // Retornar una respuesta
        return [
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user
        ];
        // return response()->json(['message' => 'Registro exitoso'], 200);
    }


    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        //Revisar el password
        if (!Auth::attempt($data))
            {
                return response([
                    'errors' => ['El email o el password son incorrectos']
                ], 422);
            }
        //Autenticar al usuario (con un token)

        $user = Auth::user();

        return [
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user
        ];

    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return[
            'user' => null
        ];
    }


}
