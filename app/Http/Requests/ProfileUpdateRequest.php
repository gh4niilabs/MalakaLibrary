<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png',
                'max:2048', // max 2MB
            ],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'avatar.image'  => 'File harus berupa gambar.',
            'avatar.mimes'  => 'Foto profil hanya boleh format JPG atau PNG.',
            'avatar.max'    => 'Ukuran foto maksimal 2MB.',
        ];
    }
}
