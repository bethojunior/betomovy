<?php

namespace app\validator;

use app\validator\contracts\Validator;

use Exception;

class TripActiveValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateRequest($request)
    {
        $this->isRequired($request->field, 'field');
        $this->isValidField($request->field);

        $this->isRequired($request->id, 'id');
        $this->isNumber($request->id, 'O campo id está inválido');

        return true;
    }

    /**
     * @param mixed $field
     * @param string|null $fieldName
     * @throws Exception
     */
    private function isRequired($field, $fieldName = null)
    {
        if (is_null($field)) {
            throw new Exception("O campo {$fieldName} é obrigatório");
        }
    }

    /**
     * @param string $field
     * @throws Exception
     */
    private function isValidField($field)
    {
           if (!in_array($field, ['user', 'driver'])) {
            throw new Exception('O campo field é inválido');
        }
    }
}