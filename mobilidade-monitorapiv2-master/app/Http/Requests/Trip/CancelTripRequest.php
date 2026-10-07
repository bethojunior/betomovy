<?php

namespace App\Http\Requests\Trip;

use App\Constants\Trip\TripConst;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CancelTripRequest extends FormRequest
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
            'tripReference' => [
                'required',
                Rule::exists('trip', 'tripReference')->where(function (Builder $query){
                    $query
                        ->whereNotIn('status', [
                            TripConst::FINISHED,
                            TripConst::CANCELED
                        ]);
                })
            ],
            'callAgain' => 'sometimes|boolean'
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
