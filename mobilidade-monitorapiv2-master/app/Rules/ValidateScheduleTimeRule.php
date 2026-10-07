<?php

namespace App\Rules;

use App\Models\Price\Dynamic\DynamicArea;
use App\Repositories\Price\Dynamic\DynamicAreaRepository;
use Illuminate\Contracts\Validation\Rule;

class ValidateScheduleTimeRule implements Rule
{
    private $cityId;
    private $name;
    private $id;

    public function __construct($cityId, $name)
    {
        $this->cityId = $cityId;
        $this->name = $name;
    }

    public function passes($attribute, $value)
    {
        return !(new DynamicAreaRepository)->availableForScheduling(
            $value, 
            $this->cityId, 
            $this->name
        );
    }

    public function message()
    {
        return "O tempo não pode estar entre outro período";
    }
}
