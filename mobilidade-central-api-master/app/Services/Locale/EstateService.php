<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:37
 */

namespace App\Services\Locale;


use App\Repositories\Locale\EstateRepository;
use Illuminate\Database\Eloquent\Model;

class EstateService
{
    /**
     * @var EstateRepository|Model
     */
    private $repository;

    public function __construct(EstateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        return $this->repository->all();
    }
}
