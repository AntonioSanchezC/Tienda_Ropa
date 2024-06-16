<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verifyEmail(Request $request)
    {
        // Recibir el número enviado desde el cliente
        $numeroCliente = $request->input('token');

        // Realizar la verificación necesaria, por ejemplo, comparar con el número generado durante el registro

        return response()->json([
            'numeroCliente' => $numeroCliente,
        ]);
    }
}
