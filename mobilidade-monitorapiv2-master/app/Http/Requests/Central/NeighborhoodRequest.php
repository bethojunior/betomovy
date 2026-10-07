<?php

namespace App\Http\Requests\Central;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NeighborhoodRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                Rule::unique('neighborhood', 'name')
                    ->where(function (Builder $query) {
                        $query
                            ->when(isset($this['cityId']), function (Builder $query) {
                                $query
                                    ->where('cityId', $this['cityId']);
                            });
                    })
                    ->whereNull('deleted_at')
                    ->ignore($this['neighborhood'])
            ],
            'cityId' => 'required|integer|exists:city,id',
            'area' => 'required|array',
            'area.*.lat' => 'required|numeric',
            'area.*.lng' => 'required|numeric'

        ];
    }
}
