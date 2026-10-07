<?php

namespace App\Http\Requests\DiscountCoupon;

use App\Constants\StatusConst;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DiscountCouponRequest extends FormRequest
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
            'code' => [
                'required',
                'string',
                Rule::unique('discountCoupon')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where('cityId', $this->cityId)
                    ->where(function (Builder $query) {
                        $query
                            ->where('dateEnd', '>', now());
                    })
                    ->ignore($this->id, 'id')
            ],
            'tripPaymentFormId' => 'sometimes|nullable|integer|exists:tripPaymentForm,idTripPaymentForm',
            'genderId' => 'sometimes|nullable|integer|exists:gender,id',
            'cityId' => 'sometimes|nullable|integer|exists:city,id',
            'value' => 'required|numeric|min:1',
            'valueType' => [
                'required',
                'string',
                Rule::in(['$', '%'])
            ],
            'maxDiscountValue' => 'sometimes|numeric|nullable',
            'limitedTo' => 'sometimes|numeric',
            'fromValue' => 'sometimes|numeric',
            'bonusDriver' => 'required|boolean',
            'uniqueUse' => 'required|boolean',
            'active' => 'sometimes|boolean',
            'dateStart' => 'required|date',
            'dateEnd' => 'required|date|after:dateStart',
        ];
    }

    /**
     * @param null $keys
     * @return array
     */
    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }

    public function attributes()
    {
        return [
            'code' => 'Código',
            'value' => 'Valor do desconto',
            'valueType' => 'Tipo do valor',
            'uniqueUse' => 'Limite por usuário',
            'dateStart' => 'Data início',
            'dateEnd' => 'Data final',
            'limitedTo' => 'Limite do valor de desconto',
            'bonusDriver' => 'Bonificar motorista',
            'maxDiscountValue' => 'Valor máximo de desconto',
        ];
    }
}
