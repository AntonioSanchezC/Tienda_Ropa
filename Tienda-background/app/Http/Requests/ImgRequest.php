<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImgRequest extends FormRequest
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
        ];

    }

    public function messages()
    {
        return [
            'image' => 'La ruta de imagen no ha sido establecida.',
            'entity' => 'La entidad de imagen no ha sido establecida.',

        ];
    }
}
