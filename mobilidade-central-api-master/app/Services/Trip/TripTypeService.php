<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 22:02
 */

namespace App\Services\Trip;


use App\Repositories\Trip\TripTypeRepository;
use Illuminate\Database\Eloquent\Model;

class TripTypeService
{
    /**
     * @var TripTypeRepository|Model
     */
    private $repository;

    public function __construct(TripTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        return $this->repository->findAll();
    }
}
