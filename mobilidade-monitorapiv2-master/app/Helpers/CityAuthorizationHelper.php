<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class CityAuthorizationHelper
{
    /**
     * Restringe a query pela cidade autorizada; sem cityId, bloqueia tudo (fail closed).
     * Só chamar dentro de um when(!$user->role->support, ...) — suporte não passa por aqui.
     *
     * @param Builder $query
     * @param mixed $cityId
     * @param string $column
     * @return void
     */
    public static function restrictToCity(Builder $query, $cityId, string $column): void
    {
        $query->when(isset($cityId), function (Builder $query) use ($cityId, $column) {
            $query->where($column, $cityId);
        }, function (Builder $query) {
            $query->whereRaw('1 = 0');
        });
    }
}
