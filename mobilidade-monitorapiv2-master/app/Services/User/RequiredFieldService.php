<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2019
 * Time: 17:40
 */

namespace App\Services\User;


use App\Constants\Users\UserTypeConst;
use App\Models\User\RequiredField;
use App\Repositories\User\RequiredFieldRepository;
use Illuminate\Database\Eloquent\Builder;

class RequiredFieldService
{
    /**
     * @var RequiredFieldRepository
     */
    private $repository;

    public function __construct(RequiredFieldRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findToCustomer()
    {
        return $this->repository
            ->findByUserType(UserTypeConst::CUSTOMER);
    }

    public function findByUserTypeId($userTypeId)
    {
        return $this->repository
            ->findByUserType($userTypeId);
    }

    public function updateByField($requiredFieldId, array $request)
    {
        /** @var RequiredField $requiredField */
        $requiredField = $this->repository
            ->find($requiredFieldId);

        $requiredField->required = $request['required'];
        $requiredField->compelField = $request['compelField'];

        $this->repository
            ->save($requiredField);

        return $requiredField;
    }

    public function changeConfirmationCode(array $data)
    {
        $fields = [];
        $fields[0] = (object)[
            'name' => strcasecmp($data['type'], "sms") == 0 ? "validateSms" : "validateEmail",
            'values' => [
                'compelField' => $data['value'],
                'required' => $data['value']
            ]
        ];

        foreach ($fields as $field) {
            RequiredField::where('userTypeId', UserTypeConst::CUSTOMER)
                ->where('field', $field->name)
                ->update($field->values);
        }

        return true;
    }

    public function getTypeConfirmationCodeCustomer()
    {
        return $this->repository->getTypeConfirmationCodeCustomer();
    }
}
