<?php


namespace App\Http\Requests\Promotion;


use Illuminate\Foundation\Http\FormRequest;

class RoutePromotionalBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'picture' => 'required|image',
        ];
    }
}
