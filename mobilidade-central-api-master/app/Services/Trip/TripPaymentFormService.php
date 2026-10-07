<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:11
 */

namespace App\Services\Trip;


use App\Repositories\Trip\TripPaymentFormRepository;
use Illuminate\Database\Eloquent\Model;

class TripPaymentFormService
{
    /**
     * @var TripPaymentFormRepository|Model
     */
    private $repository;

    public function __construct(TripPaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->findAll();
    }
}
