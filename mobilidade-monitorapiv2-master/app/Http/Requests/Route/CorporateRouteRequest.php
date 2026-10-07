<?php


namespace App\Http\Requests\Route;


use Illuminate\Foundation\Http\FormRequest;

class CorporateRouteRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'routeId' => 'required|integer',
            'companyId' => 'required|integer'
        ];
    }
}
