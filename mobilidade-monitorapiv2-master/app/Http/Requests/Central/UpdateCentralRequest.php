<?php

namespace App\Http\Requests\Central;

use App\Constants\Central\CentralConst;
use App\Constants\StatusConst;
use App\Constants\Users\UserTypeConst;
use DB;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCentralRequest extends FormRequest
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
        $central = $this->route('central');
        $centralId = is_object($central) ? $central->id : $central;

        return [
            'name' => 'sometimes|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'syncCustomers' => 'sometimes|boolean',
            'showAllPrices' => 'sometimes|boolean',
            'enableCustomRadiusCentral' => 'sometimes|boolean',
            'discount_type' => 'sometimes|nullable',
            'discount_value' => 'sometimes|nullable',
            'placesSearchRadius' => 'sometimes|nullable|numeric',
            'centralCallDriver' => [
                'sometimes',
                Rule::in(array_keys(CentralConst::CENTRAL_CALLS))
            ],
            'responsibleId' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::unique('central', 'responsibleId')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($centralId)
            ],
            'address' => 'sometimes|nullable|string',
            'logo' => 'sometimes|nullable|image',
            'user.name' => 'sometimes|nullable|string',
            'user.email' => [
                'required_with:user.name',
                'email',
                Rule::unique('user', 'email')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where(function (Builder $query) {
                        $query
                            ->whereExists(function (Builder $query) {
                                $query->select(DB::raw(1))
                                    ->from('levelAccess')
                                    ->where('levelAccess.userTypeId', UserTypeConst::CUSTOMER);
                            });
                    }, 'idUser')
            ],
            'user.phone' => [
                'required_with:user.name',
                'string',
            ],
            'user.password' => 'required_with_all:user.name,user.email|min:5'
        ];
    }
}
