<?php

namespace App\Http\Requests\Central;

use App\Constants\StatusConst;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteCentralCustomerRequest extends FormRequest
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
            'id' => Rule::exists('centralCustomer')
                ->where(function(Builder $query){
                    return $query
                        ->where('statusId', StatusConst::ACTIVE)
                        ->where('id', $this['id']);
                })
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
