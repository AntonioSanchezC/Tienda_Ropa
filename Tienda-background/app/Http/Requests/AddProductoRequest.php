<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['required', 'string'],
            'entity' => ['required', 'string'],

            'name' => ['required', 'string'],
            'gender' => ['required', 'string'],

            'warehouses' => ['required', 'integer'],
            'price' => ['required', 'numeric'],
            'disp' => ['required', 'integer'],
            'description' => ['required', 'string'],
            'size' => ['required', 'string'],
            'color' => ['required', 'string'],
            'code_color' => ['required', 'string'],
            'quantity' => ['required', 'integer'],
            'subcate' => [ 'integer'],

            'novelty'=> ['required', 'integer'],
        ];
    }

    public function messages()
    {
        return [
            'image' => 'La ruta de imagen no ha sido establecida.',
            'entity' => 'La entidad de imagen no ha sido establecida.',

            'warehouses' => 'El almacen no ha sido establecida.',

            'name' => 'El campo nombre es obligatorio.',
            'gender' => 'Por favor aclare el sexo designado para el producto.',
            'price.required' => 'El campo precio es obligatorio.',
            'price.numeric' => 'El campo precio debe ser un número válido.',
            'disp.required' => 'El campo disponible debe ser verdadero o falso.',
            'disp.numeric' => 'Existe un fallo en el tipo de valor de la disponibilidad.',
            'description' => 'El campo descripción es obligatorio.',
            'size' => 'El campo de talla es obligatorio.',
            'color' => 'El campo de color es obligatorio.',
            'code_color' => 'Elija el campo de código de color.',
            'quantity' => 'El campo cantidad es obligatorio.',
            'subcate' => 'El campo subcategoría es obligatorio.',

            'novelty'=> 'Existe un fallo en el envio de datos de la novedad'
        ];
    }
}
