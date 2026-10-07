<?php

namespace App\Http\Requests\Trip\ChatTrip;

use App\Constants\Trip\TripConst;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMessageChatTripRequest extends FormRequest
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
                'uuid',
                Rule::exists('trip', 'tripReference')->where(function (Builder $query){
                    $query
                        ->whereIn('status', TripConst::ACTIVE_STATUSES);
                })
            ],
            'message' => 'required|string',
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
