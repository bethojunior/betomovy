<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 14:43
 */

namespace App\Contracts\Repository;


use Jenssegers\Mongodb\Eloquent\Builder;
use Jenssegers\Mongodb\Eloquent\Model;

abstract class AbstractODMRepository
{
    /**
     * @var Model|Builder
     */
    protected $model;
    protected static $instance;

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public abstract function __construct();

    public function __call($method, $attr)
    {
        return call_user_func_array([$this->model, $method], $attr);
    }

    protected function setModel($model)
    {
        $this->model = $model;
    }

    protected function getModel()
    {
        return $this->model;
    }

    public function create($attributes)
    {
        return $this->getModel()
            ::create($attributes);
    }

    public function find($id, $columns = ['*'])
    {
        return $this->getModel()
            ::find($id, $columns);
    }

    /**
     * @param Model $model
     * @return bool|null
     * @throws \Exception
     */
    public function delete(Model $model)
    {
        return $model->delete();
    }

    public function save(Model $model)
    {
        return $model->save();
    }
}
