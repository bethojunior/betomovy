<?php

namespace App\Http\Requests\Company\CompanyWorker;

use App\Constants\StatusConst;
use DB;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyWorkerRequest extends FormRequest
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
            'companyId' => 'required|integer|exists:company,id',
            'userId' => [
                'required',
                'integer',
                'exists:user,idUser',
                Rule::unique('companyWorker', 'userId')
                    ->where('companyId', ($this['companyId'] ?? null))
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
        ];
    }

    public function messages()
    {
        return [
            'userId.unique' => 'Este usuário já está cadastrado'
        ];
    }
}
