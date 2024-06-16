<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as PasswordRules;

class RegisterRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name' => ['required', 'string'],
            'lastName' => ['required', 'string'],
            'address' => ['required', 'string'],
            'telf' => ['required', 'string','max:20'],
            'email' => [
                'required',
                'email','unique:users,email'
            ],'value' => [
                'required',
                'string',
                'max:4'
            ],'password'=>[
                'required',
                'confirmed',
                PasswordRules::min(8)->letters()->symbols()->numbers()
            ]
        ];
    }
    public function messages()
    {
        return [
            'name' => 'El Nombre es obligatorio',
            'lastName' => 'El apellido es obligatorio',
            'address' => 'El direccion es obligatorio',
            'telf' => 'El telefono es obligatorio',
            'email.required' => 'El Email es obligatorio',
            'email.email' => 'El email no es valido',
            'email.unique' => 'El usuario ya esta registrado',
            'value' => 'Selecciona el prefijo',
            'password'=> 'El Password debe contener 8 caracterers, un simbolo y un numero'
        ];
    }
}
