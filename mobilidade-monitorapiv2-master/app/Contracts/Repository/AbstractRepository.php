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

    protected function getQuery(): Builder
    {
        return $this->model::query();
    }

    /**
     * @param array $attributes
     * @return Builder|Model
     */
    public function create(array $attributes = [])
    {
        return $this->getModel()
            ::create($attributes);
    }

    /**
     * @param array $attributes
     * @return bool
     */
    public function createMany(array $attributes)
    {
        return $this->getModel()
            ::insert($attributes);
    }

    /**
     * @param $id
     * @param array $columns
     * @return Builder|Builder[]|\Illuminate\Database\Eloquent\Collection|Model|null
     */
    public function find($id, $columns = ['*'])
    {
        return $this->getModel()
            ::find($id, $columns);
    }

    /**
     * @param Model $model
     * @param array $attributes
     * @param array $options
     * @return bool
     */
    public function update(Model $model, array $attributes = [], array $options = [])
    {
        return $model
            ->update($attributes, $options);
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

    /**
     * @param $id
     * @param $column
     * @param int $amount
     * @param array $extra
     * @return int
     */
    public function increment($id, $column, $amount = 1, array $extra = [])
    {
        return $this->getModel()
            ::find($id)
            ->increment($column, $amount, $extra);
    }

    /**
     * @param $id
     * @param $column
     * @param int $amount
     * @param array $extra
     * @return int
     */
    public function decrement($id, $column, $amount = 1, array $extra = [])
    {
        return $this->getModel()
            ::find($id)
            ->decrement($column, $amount, $extra);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|Model[]
     */
    public function all()
    {
        return $this->getModel()
            ::all();
    }

    /**
     * @param Model $model
     * @return bool
     */
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
