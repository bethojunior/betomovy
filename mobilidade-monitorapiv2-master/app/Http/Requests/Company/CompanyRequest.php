<?php

namespace App\Http\Requests\Company;

use App\Constants\StatusConst;
use DB;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest
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
            'address' => 'required|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'billingDay' => 'sometimes|integer',
            'document' => [
                'required',
                'min:11',
                'max:14',
                Rule::unique('company', 'document')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this['id'])
            ],
            'voucherLimit' => 'sometimes|numeric',
            'site' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'cityId' => 'required|integer',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('company', 'email')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this['id'])
            ],
            'phone' => [
                'sometimes',
                'string',
                Rule::unique('company', 'phone')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this['id'])
            ],
            'userId' => [
                'sometimes',
                'integer',
                Rule::unique('companyWorker', 'userId')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where(function (Builder $query) {
                        $query
                            ->whereExists(function (Builder $query) {
                                $query->select(DB::raw(1))
                                    ->from('company')
                                    ->whereRaw(
                                        '(company.id = companyWorker.companyId AND company.statusId = 1)'
                                    );
                            });
                    })
            ],
            'workers' => 'sometimes|array',
            'workers.*.userId' => [
                'sometimes',
                'distinct',
                'integer',
                Rule::unique('companyWorker', 'userId')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where(function (Builder $query) {
                        $query
                            ->whereExists(function (Builder $query) {
                                $query->select(DB::raw(1))
                                    ->from('company')
                                    ->whereRaw(
                                        '(company.id = companyWorker.companyId AND company.statusId = 1)'
                                    );
                            });
                    })
            ],
            'establishmentCollectionManagementId' => 'sometimes|nullable|integer',
            'registration' => 'sometimes|string',
            'observation' => 'sometimes|string'
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }

    public function validationData()
    {
        $data = $this->all();

        if (isset($data['document']))
            $data['document'] = onlyCharacters($data['document']);

        if (isset($data['phone']))
            $data['phone'] = onlyCharacters($data['phone']);

        return $data;
    }

    public function attributes()
    {
        return [
            'workers.*.userId' => 'usuário autorizado',
            'document' => 'cnpj',
            'address' => 'endereço',
            'fantasyName' => 'nome de fantasia',
            'name' => 'razão social',
            'billingDay' => 'dia de faturamento',
            'voucherLimit' => 'limite de voucher',
            'phone' => 'telefone',
            'userId' => 'gestor',
            'establishmentCollectionManagementId' => 'gestão de cobrança'
        ];
    }
}
