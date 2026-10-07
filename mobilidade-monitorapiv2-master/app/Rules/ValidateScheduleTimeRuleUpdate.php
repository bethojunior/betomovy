<?php

namespace App\Rules;

use App\Models\Price\Dynamic\DynamicArea;
use App\Repositories\Price\Dynamic\DynamicAreaRepository;
use Illuminate\Contracts\Validation\Rule;

class ValidateScheduleTimeRuleUpdate implements Rule
{
    private $cityId;
    private $name;
    private $id;

    public function __construct($cityId, $name, $id)
    {
        $this->cityId = $cityId;
        $this->name = $name;
        $this->id = $id;
    }

    public function passes($attribute, $value)
    {
        return (new DynamicAreaRepository)->availableForSchedulingUpdate(
            $value,
            $this->id,
            $this->name
        );
    }

    public function message()
    {
        return "O tempo não pode estar entre outro período";
    }
}
