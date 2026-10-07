<?php


namespace App\Http\Requests\Route;


use Illuminate\Foundation\Http\FormRequest;

class ScheduleCorporateRouteRequest extends FormRequest
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
        switch ($this->method()) {
            case "PUT":
            {
                return [
                    'schedule' => 'required|string',
                    'title' => 'required|string',
                    'vacancies' => 'required|integer',
                    'days' => 'required|array',
                    'days.*.day' => 'required|integer',
                ];
            }
            default :
            {
                return [
                    'schedule' => 'required|string',
                    'title' => 'required|string',
                    'vacancies' => 'required|integer',
                    'corporateRouteId' => 'required|integer',
                    'days' => 'required|array',
                    'days.*.day' => 'required|integer',
                ];
            }
        }
    }
}
