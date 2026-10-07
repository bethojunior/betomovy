<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 11:09
 */

namespace App\Services\Config\FormStep;


use App\Repositories\Config\FormStep\FormStepRepository;

class FormStepService
{
    /**
     * @var FormStepRepository
     */
    private $repository;

    public function __construct(FormStepRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->findAll();
    }
}
