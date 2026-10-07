<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/03/2020
 * Time: 10:02
 */

namespace App\Traits\Scopes;


trait Select2ScopeTrait
{
    protected $select2Id;
    protected $select2Name;

    /**
     * Scope a query to only include popular users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Support\Collection
     */
    public function scopeSelect2($query)
    {
        $select2Id = $this->select2Id ?? 'id';
        $select2Name = $this->select2Name ?? 'name';

        return $query->pluck(
            "{$select2Id} AS id",
            "{$select2Name} AS text"
        );
    }
}
