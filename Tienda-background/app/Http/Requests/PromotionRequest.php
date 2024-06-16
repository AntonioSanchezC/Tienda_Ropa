<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PromotionRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'image' => ['required', 'string'],
            'entity' => ['required', 'string'],

            'name' => ['required', 'string'],
            'tipe' => ['required', 'string'],
            'description' => ['required', 'string'],
            'discount' => ['required', 'numeric'],
            'status' => ['required', 'integer'],
        ];
    }

    public function messages()
    {
        return [
            'image' => 'La ruta de imagen no ha sido establecida.',
            'entity' => 'La entidad de imagen no ha sido establecida.',

            'name' => 'El nombre es obligatorio.',
            'tipe' => 'Tipo de promoción.',
            'description' => 'Anade una descripcion.',
            'discount' => 'El descuento.',
            'status' => 'El estado de la promocion.',

        ];
    }
}
