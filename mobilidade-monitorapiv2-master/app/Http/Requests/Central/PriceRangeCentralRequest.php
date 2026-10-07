<?php

namespace App\Http\Requests\Central;

use App\Constants\StatusConst;
use App\Repositories\Price\Range\PriceRangeRepository;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceRangeCentralRequest extends FormRequest
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
            'centralId' => 'required|array',
            'min_value' => [
                'required',
                'numeric',
            ],
            'max_value' => [
                'required',
                'numeric',
            ],
            'new_value' => 'required|numeric',
            'description' => 'required|string',
            'id' => [
                'sometimes',
                'integer',
                Rule::exists('priceRangeCentral')
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
