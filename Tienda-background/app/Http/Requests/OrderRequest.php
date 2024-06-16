<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'total' => 'required|numeric',
            'arrivalId' => 'required|exists:arrivals,id',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.name' => 'required|string',
            'products.*.product_code' => 'required|string',
            'products.*.price' => 'required|integer',
            'products.*.color' => 'required|integer',
            'products.*.size' => 'required|integer',
            'cardNumber' => 'required|string', // Añadir validaciones según sea necesario
            'cardExpiry' => 'required|string',
            'cardCVC' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'total.required' => 'El total es obligatorio',
            'total.numeric' => 'El total debe ser un número',
            'arrivalId.required' => 'El punto de entrega es obligatorio',
            'arrivalId.exists' => 'El punto de entrega seleccionado no es válido',
            'products.required' => 'El pedido debe contener al menos un producto',
            'products.array' => 'El formato de los productos no es válido',
            'products.*.id.required' => 'El ID del producto es obligatorio',
            'products.*.id.exists' => 'El ID del producto no es válido',
            'products.*.quantity.required' => 'La cantidad del producto es obligatoria',
            'products.*.quantity.integer' => 'La cantidad del producto debe ser un número entero',
            'products.*.price.integer' => 'El precio del producto debe ser un número entero',
            'products.*.color' => 'El color no ha llegado correctamente',
            'products.*.size' => 'La talla no ha llegado correctamente',
            'products.*.quantity.min' => 'La cantidad del producto debe ser al menos 1',
            'cardNumber.required' => 'El número de tarjeta es obligatorio',
            'cardNumber.digits_between' => 'El número de tarjeta debe tener entre 13 y 19 dígitos',
            'cardExpiry.required' => 'La fecha de expiración es obligatoria',
            'cardExpiry.date_format' => 'La fecha de expiración debe tener el formato MM/YY',
            'cardExpiry.after' => 'La fecha de expiración debe ser una fecha futura',
            'cardCVC.required' => 'El CVC es obligatorio',
            'cardCVC.digits_between' => 'El CVC debe tener entre 3 y 4 dígitos',
        ];
    }
}
