<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/07/2020
 * Time: 17:31
 */

namespace Cash\Http\Requests\BalanceTransfer;


use Cash\Repositories\Balance\BalanceRepository;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BalanceTransferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(BalanceRepository $repository)
    {
        return [
            'cashPaymentFormId' => 'required|integer|exists:cashPaymentForm,id',
            'value' => 'required|numeric',
            'userId' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($repository) {
                    try {
                        $repository->findByUser($value);
                    } catch (\Exception $e) {
                        $fail("Usuário de destino não existe");
                    }
                }
            ],
            'description' => 'sometimes|nullable|string|max:50',
        ];
    }

    /**
     * @param null $keys
     * @return array
     */
    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
