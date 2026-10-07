<?php

namespace App\Http\Requests\PublicitiesApp;

use Illuminate\Foundation\Http\FormRequest;

class StorePublicitiesAppRequest extends FormRequest
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
    public function rules()
    {
        return [
            'company_name'   => 'required|string|max:100',
            'company_type'   => 'required|string|max:100',
            'company_email'   => 'required|string|max:100',
            'company_phone'   => 'required|string|max:100',
            'company_whatsapp'   => 'required|string|max:100',
            'link'   => 'string|max:100',
            'opening_hours'   => 'required|string|max:100',
            'opening_hours2'   => 'string|max:100',
            'benefit1'   => 'nullable|string|max:100',
            'benefit2'   => 'nullable|string|max:100',
            'benefit3'   => 'nullable|string|max:100',
            'responsible_manager'   => 'required|string|max:100',
            'email_report'   => 'required|string|max:100',
            'title'   => 'required|string|max:100',
            'subtitle'   => 'required|string|max:300',
            'text_button_cta'   => 'string|max:100',
            'link_button_cta'   => 'string|max:100',

            'image_passenger_screen'   => 'required|file',
            'image_passenger_transit'   => 'required|file',
            'image_driver_initial'   => 'required|file',
            'image_driver_transit'   => 'required|file',

            'gender'   => 'required|string|max:100',
            'min_age'   => 'required|numeric|max:100',
            'max_age'   => 'required|numeric|max:100',
            'min_distance'   => 'required|numeric',
            'max_distance'   => 'required|numeric',
            'activities'   => 'required|string|max:100',

            'passenger_screen'   => 'required|boolean|max:100',
            'passenger_transit'   => 'required|boolean|max:100',
            'driver_screen'   => 'required|boolean|max:100',
            'driver_transit'   => 'required|boolean|max:100',

            'start_date'   => 'required|string|max:100',
            'end_date'   => 'required|string|max:100',
            'start_hour'   => 'required|string|max:100',
            'end_hour'   => 'required|string|max:100',
            'days_of_week'   => 'required|array',
            'days_of_week.*'   => 'required|string',

            'driver_charge_initial'   => 'numeric|max:100',
            'passenger_charge_screen'   => 'numeric|max:100',
            'driver_charge_screen'   => 'numeric|max:100',
            'passenger_address_bar'   => 'numeric|max:100',
        ];
    }
}
