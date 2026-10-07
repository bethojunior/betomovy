<?php

namespace App\Http\Requests\Price\Dynamic;

use App\Repositories\Price\Dynamic\PriceDynamicRepository;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceDynamicRequest extends FormRequest
{
    /**
     * @var PriceDynamicRepository
     */
    private $repository;

    public function __construct(
        PriceDynamicRepository $repository,
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
            "dayOfWeek" => 'bail|required|array',
            "dayOfWeek.*" => 'bail|required|integer|exists:weekDay,day',
            "cityId" => 'required|integer',
            "multiplierValue" => 'required|numeric',
            "tripTypeId" => 'required|array',
            "timeStart" => [
                'bail',
                'required',
                'date_format:H:i:s',
                function ($attribute, $value, $fail) {
                    if (!is_array($this['dayOfWeek']))
                        return $fail("O dia da semana deve ser um array");

                    foreach ($this['dayOfWeek'] as $dayOfWeek) {
                        $dynamicExists = $this->repository
                            ->findByParamsForValidation([
                                'cityId' => $this['cityId'],
                                'dayOfWeek' => $dayOfWeek,
                                'tripTypeId' => $this['tripTypeId'],
                                'timeStart' => $value,
                            ]);

                        if ($dynamicExists->isNotEmpty())
                            return $fail("O tempo de início não pode estar entre outro período");
                    }

                    return true;
                }
            ],
            "timeEnd" => [
                'bail',
                'required',
                'date_format:H:i:s',
                'after:timeStart',
                function ($attribute, $value, $fail) {
                    if (!is_array($this['dayOfWeek']))
                        return $fail("O dia da semana deve ser um array");

                    foreach ($this['dayOfWeek'] as $dayOfWeek) {
                        $dynamicExists = $this->repository
                            ->findByParamsForValidation([
                                'cityId' => $this['cityId'],
                                'dayOfWeek' => $dayOfWeek,
                                'tripTypeId' => $this['tripTypeId'],
                                'timeStart' => $value,
                            ]);

                        if ($dynamicExists->isNotEmpty())
                            return $fail("O tempo de início não pode estar entre outro período");
                    }

                    return true;
                }
            ],
        ];
    }
}
