<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 12:36
 */

namespace App\Services\Config\FormStep;


use App\Constants\StatusConst;
use App\Exceptions\Config\FormStepUserTypeException;
use App\Repositories\Config\FormStep\FormStepUserTypeRepository;

class FormStepUserTypeService
{
    /**
     * @var FormStepUserTypeRepository
     */
    private $repository;

    public function __construct(FormStepUserTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByUserType($userTypeId)
    {
        return $this->repository
            ->findByUserType($userTypeId);
    }

    public function insert(array $request)
    {
        $formStepUserType = $this->repository
            ->firstOrCreate([
                'userTypeId' => $request['userTypeId'],
                'formStepId' => $request['formStepId'],
                'statusId' => StatusConst::ACTIVE
            ], [
                'userTypeId' => $request['userTypeId'],
                'formStepId' => $request['formStepId'],
            ]);

        return $formStepUserType;
    }

    /**
     * @param $id
     * @return bool
     * @throws FormStepUserTypeException
     */
    public function delete($id)
    {
        $formStepUserType = $this->repository->find($id);

        $formStep = $formStepUserType->formStep;

        if (!$formStep->manageable)
            throw new FormStepUserTypeException("O campo não permite alteração");

        $formStepUserType->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($formStepUserType);

        return true;
    }
}
