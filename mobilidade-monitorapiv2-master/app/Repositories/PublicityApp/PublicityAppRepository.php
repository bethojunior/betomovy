<?php

namespace App\Repositories\PublicityApp;

use App\Contracts\Repository\AbstractRepository;
use App\Models\PublicityApp\PublicityApp;

class PublicityAppRepository extends AbstractRepository
{
    protected $model;

    public function __construct()
    {
        $this->setModel(PublicityApp::class);
    }

    public function setModel($model)
    {
        $this->model = new $model;
    }

    public function getModel()
    {
        return $this->model;
    }

    public function findAll()
    {
        return $this->getModel()
            ->get();
    }

    public function findById($id)
    {
        return $this->getModel()
            ->find($id);
    }

    public function delete($id) {
        $model = $this->getModel()->find($id);
        
        if ($model) {
            return $model->delete();
        }

        return false;
    }

    public function update($id, array $attributes = [], array $options = [])
    {
        $model = $this->getModel()->find($id);
    
        if ($model) {
            return $model->update($attributes, $options);
        }
    
        return false;
    }
}
