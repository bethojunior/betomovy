<?php

namespace App\Http\Requests\Central;

use App\Constants\Central\CentralCustomerConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlockOrReleaseCentralCustomerRequest extends FormRequest
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
            'action' => Rule::in(CentralCustomerConst::ACTIONS)
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
