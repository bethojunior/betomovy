<?php

namespace App\Contracts\DTO;

abstract class AbstractDTO
{
    public static function fromArray(array $keyValues): self
    {
        $dto = new static();
        foreach ($keyValues as $key => $value) {
            $dto->$key = $value;
        }
        return $dto;
    }

    public function toArray(): array
    {
        $array = [];
        foreach ($this as $key => $value) {
            if (is_object($value) && method_exists($value, 'toArray')) {
                $array[$key] = $value->toArray();
            } else {
                $array[$key] = $value;
            }
        }
        return $array;
    }
}
