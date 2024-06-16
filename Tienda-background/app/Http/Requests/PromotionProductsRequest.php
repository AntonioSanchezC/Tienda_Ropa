<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PromotionProductsRequest extends FormRequest
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

            'promotion_id' => ['required', 'integer'],
            'product_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer'],
        ];
    }


    public function messages()
    {
        return [
            'product_id' => 'Fallo en la identificación de archivo producto.',
            'promotion_id' => 'Fallo en la identificación de archivo promocion.',
            'quantity' => 'Fallo en la identificación de cuenta numerica.',

        ];
    }

}
