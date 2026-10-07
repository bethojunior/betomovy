<?php

namespace App\Http\Requests\Advertising;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdvertisingRequest extends FormRequest
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'thumbnail' => 'required|image|dimensions:width=288,height=180',
            'banner' => 'required|image|dimensions:width=324,height=108',
            'description' => 'required|string',
            'companyId' => 'required|integer|exists:company,id',
            'dateStart' => 'required|date',
            'dateEnd' => 'required|date',
            'amountOfTime' => 'nullable|integer',
            'genderId' => 'required|integer|exists:gender,id',
            'advertisingAppSiteId' => 'required|integer|exists:advertisingAppSite,id',
            'cityId' => 'required|integer|exists:city,id',
            'appId' => 'required|integer|exists:app,idApp',
            'link' => 'required|url',
            'emailRedirect' => 'sometimes|email',
            'emailInformation' => 'sometimes|email',
        ];
    }

    public function attributes()
    {
        return [
            'thumbnail' => 'Imagem Modal',
            'banner' => 'Imagem Banner',
            'description' => 'Descrição',
            'dateStart' => 'Data de início',
            'dateEnd' => 'Data de fim',
            'emailRedirect' => 'Email de directionamento',
            'emailInformation' => 'Email de informação',
            'amountOfTime' => 'Quantidade de vezes',
        ];
    }
}
