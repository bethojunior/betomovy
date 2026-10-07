<?php

namespace App\Http\Requests\Price\Range;

use App\Constants\StatusConst;
use App\Repositories\Price\Range\PriceRangeRepository;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceRangeRequest extends FormRequest
{
    /**
     * @var PriceRangeRepository
     */
    private $repository;

    public function __construct(
        PriceRangeRepository $repository,
        array $query = [],
        array $request = [],
        array $attributes = [],
        array $cookies = [],
        array $files = [],
        array $server = [],
        $content = null)
    {
        parent::__construct($query, $request, $attributes, $cookies, $files, $server, $content);

        $this->repository = $repository;
    }

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
            'cityId' => 'required|integer',
            'tripTypeId' => 'required|integer',
            'min_value' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    $rangeExists = $this->repository
                        ->findByParamsForValidation([
                            'cityId' => $this['cityId'],
                            'tripTypeId' => $this['tripTypeId'],
                            'min_value' => $value,
                            'id' => $this['id']
                        ]);

                    if ($rangeExists->isNotEmpty())
                        $fail("O valor mínimo da faixa não pode estar dentro de outra");
                }
            ],
            'max_value' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    $rangeExists = $this->repository
                        ->findByParamsForValidation([
                            'cityId' => $this['cityId'],
                            'tripTypeId' => $this['tripTypeId'],
                            'max_value' => $value,
                            'id' => $this['id']
                        ]);

                    if ($rangeExists->isNotEmpty())
                        $fail("O valor máximo da faixa não pode estar dentro de outra");
                }
            ],
            'new_value' => 'required|numeric',
            'description' => 'required|string',
            'id' => [
                'sometimes',
                'integer',
                Rule::exists('priceRange')
                    ->where('statusId', StatusConst::ACTIVE)
            ]
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
