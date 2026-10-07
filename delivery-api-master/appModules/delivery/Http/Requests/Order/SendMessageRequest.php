<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/08/2020
 * Time: 16:27
 */

namespace Delivery\Http\Requests\Order;


use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    /**
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function rules()
    {
        return [
            'message' => 'required|string',
            'sendTo' => 'sometimes|in:driver,company'
        ];
    }
}
