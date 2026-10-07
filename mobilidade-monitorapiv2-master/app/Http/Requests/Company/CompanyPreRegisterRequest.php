<?php

namespace App\Http\Requests\Company;

use App\Constants\StatusConst;
use App\Constants\Users\UserTypeConst;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyPreRegisterRequest extends FormRequest
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
            'fantasyName' => 'required|string',
            'name' => 'sometimes|string',
            'address' => 'sometimes|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'billingDay' => 'sometimes|integer',
            'document' => [
                'required',
                'min:11',
                Rule::unique('company', 'document')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'voucherLimit' => 'sometimes|numeric',
            'site' => 'sometimes|string',
            'instagram' => 'sometimes|string',
            'facebook' => 'sometimes|string',
            'cityId' => 'required|integer',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('company', 'email')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'phone' => [
                'sometimes',
                'string',
                Rule::unique('company', 'phone')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'user.name' => 'required|string',
            'user.surname' => 'sometimes|nullable|string',
            'user.email' => [
                'required',
                'email',
                Rule::unique('user', 'email')
                    ->where('email', $this['email'])
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
                'required',
                'string',
                Rule::unique('user')
                    ->where(function (Builder $query) {
                        $query
                            ->whereRaw('clearPhone(phone)',str_replace(['(',')','-',' ','.','+'], '', $this['user.phone']));
                    })
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
            'user.password' => 'required|string|min:5'
        ];
    }

    public function attributes()
    {
        return [
            'user.name' => 'nome',
            'user.phone' => 'telefone',
            'user.email' => 'email',
            'user.password' => 'senha',
        ];
    }
}
