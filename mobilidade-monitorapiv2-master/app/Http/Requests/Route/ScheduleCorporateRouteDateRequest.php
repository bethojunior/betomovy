<?php


namespace App\Http\Requests\Route;


use Illuminate\Foundation\Http\FormRequest;

class ScheduleCorporateRouteDateRequest extends FormRequest
{

    /**
     * @return bool
     */
    public function authorization()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date' => 'required|string',
        ];
    }
}
