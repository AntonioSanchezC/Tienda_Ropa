<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function getCommentsByProduct($product_id)
    {
        // Obtener comentarios del producto con el nombre del usuario
        $comments = Comment::where('product_id', $product_id)
                            ->with('user:id,name')
                            ->get();

        return response()->json([
            'comments' => $comments
        ], 200);
    }


    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validatedData = $request->validate([
            'user_id' => 'required|integer',
            'product_id' => 'required|integer',
            'comment' => 'required|string|max:255',
        ]);

        // Crear el comentario en la base de datos
        $comment = Comment::create([
            'user_id' => $validatedData['user_id'],
            'product_id' => $validatedData['product_id'],
            'content' => $validatedData['comment'],
        ]);

        // Devolver una respuesta exitosa
        return response()->json([
            'message' => 'Comentario guardado exitosamente',
            'comment' => $comment,
        ], 201);
    }

}
