<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/06/2019
 * Time: 10:37
 */

namespace App\Contracts\Repository;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

abstract class AbstractRepository
{
    /**
     * @var Model|Builder
     */
//    protected static $model;
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

    /**
     * @param array $attributes
     * @param array $values
     * @return Builder|Model
     */
    public function firstOrCreate(array $attributes, array $values = [])
    {
        return $this->getModel()
            ::firstOrCreate($attributes, $values);
    }

    /**
     * @param $id
     * @param array $values
     * @param string $primaryKey
     * @return int
     */
    public function updateById($id, array $values, $primaryKey = 'id')
    {
        return $this->getModel()
            ::where($primaryKey, $id)
            ->update($values);
    }
}
