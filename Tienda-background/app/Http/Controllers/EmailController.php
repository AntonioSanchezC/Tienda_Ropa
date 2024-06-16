<?php

namespace App\Http\Controllers;

use App\Mail\ClientComunication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\YourEmailMailable;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class EmailController extends Controller
{
    public function email(Request $request)
    {
        try {
            // Obtener el correo electrónico del cuerpo de la solicitud
            $email = $request->input('email');
            $addressCode = $request->input('addressCode');

            // Crea una instancia del Mailable y establece el mensaje
            $emailMailable = new YourEmailMailable($addressCode);

            // Envía el correo electrónico utilizando el Mailable
            Mail::to($email)->send($emailMailable);

            return response()->json(['message' => 'Correo electrónico enviado con éxito',], 200);
        } catch (\Exception $e) {
            // Devuelve una respuesta más informativa en caso de error
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function emailClient(Request $request)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'message' => 'required|string'
            ]);

            // Obtener los datos del cuerpo de la solicitud
            $data = $request->only(['firstName', 'lastName', 'email', 'phone', 'message']);

            // Log de los datos recibidos para depuración
            Log::info('Datos recibidos:', $data);

            // Crea una instancia del Mailable y pasa los datos
            $emailMailable = new ClientComunication($data);

            // Envía el correo electrónico a la dirección deseada
            Mail::to('practicadew@gmail.com')->send($emailMailable);

            return response()->json(['message' => 'Correo electrónico enviado con éxito'], 200);
        } catch (\Exception $e) {
            // Log del error para depuración
            Log::error('Error al enviar el correo:', ['error' => $e->getMessage()]);

            // Devuelve una respuesta más informativa en caso de error
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        // Obtener el ID del usuario y el nuevo valor del código desde la solicitud
        $userId = $request->user()->id; // Obtener el ID del usuario autenticado
        $newCode = $request->input('code');

        // Buscar el usuario por su ID
        $user = User::findOrFail($userId);

        // Actualizar el valor del campo 'code' del usuario
        $user->code = $newCode;
        $user->save();

        // Retornar una respuesta
        return [
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user
        ];
    }
    public function code(Request $request)
    {
        // Obtener el ID del usuario autenticado
        $userId = $request->user()->id;

        // Decodificar el cuerpo de la solicitud JSON y obtener el nuevo código
        $data = json_decode($request->getContent(), true);
        $newCode = $data['code'];

        // Buscar el usuario por su ID
        $user = User::findOrFail($userId);

        // Comprobar si el código proporcionado coincide con el código del usuario
        if ($user->code == $newCode) {
            // Actualizar el campo 'email_verified_at' del usuario
            $user->email_verified_at = now();
            $user->save();

            // Retornar una respuesta con un nuevo token y los datos del usuario
            return [
                'token' => $user->createToken('token')->plainTextToken,
                'user' => $user
            ];
        } else {
            // Retornar un mensaje de error si el código no coincide
            return response()->json(['error' => 'El código proporcionado es incorrecto.'], 400);
        }
    }



}
