<?php

namespace App\Http\Requests\Trip;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewTripScheduledBatchRequest extends FormRequest
{
    const MAX_SCHEDULES = 30;

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
            'tripTypeId' => 'required|integer',
            'tripPaymentFormId' => 'required|integer',
            'priceId' => 'required|integer',
            'centralId' => 'bail|required|integer',
            'price' => 'required|numeric',
            'distance' => 'sometimes|nullable|numeric',
            'estimatedTripTime' => 'sometimes|nullable|numeric',
            'multiplierDynamic' => 'sometimes|nullable|numeric',
            'origin.address' => 'required|string',
            'origin.latitude' => 'required|numeric',
            'origin.longitude' => 'required|numeric',
            'origin.neighborhood' => 'sometimes|nullable|string',
            'destination.address' => 'required|string',
            'destination.latitude' => 'required|numeric',
            'destination.longitude' => 'required|numeric',
            'destination.neighborhood' => 'sometimes|nullable|string',
            'tripCustomer.id' => 'sometimes|nullable|integer',
            'tripCustomer.userId' => 'sometimes|nullable|integer',
            'tripCustomer.name' => $this->requiredIfNewCustomerRule(),
            'tripCustomer.phone' => [
                $this->requiredIfNewCustomerRule(),
                'bail',
            ],
            'tripCustomer.document' => [
                'sometimes',
                'bail',
                $this->uniqueCustomerDocumentRule(),
            ],
            'tripCustomer.dateOfBirth' => [
                'sometimes',
                'date',
            ],
            'waypoints' => 'sometimes|array',
            'waypoints.*.address' => 'required|string',
            'waypoints.*.latitude' => 'required|numeric',
            'waypoints.*.longitude' => 'required|numeric',
            'waypoints.*.neighborhood' => 'sometimes|nullable|string',
            'deliveryInfo' => 'sometimes|array',
            'haveReturn' => 'sometimes|boolean',
            'paidByCentral' => 'sometimes|boolean',
            'isOpenPriceTrip' => 'sometimes|boolean',
            'centralNeighborhoodId' => 'sometimes|integer',
            'questions' => 'sometimes|array',
            'questions.*.questionId' => 'required|integer',
            'questions.*.response' => 'required|string',
            'schedules' => 'required|array|min:1|max:' . self::MAX_SCHEDULES,
            'schedules.*.schedule' => 'required|date|after:now',
            'schedules.*.scheduleUTC' => 'required|date',
            'favoriteDrivers' => 'sometimes|array',
            'favoriteDrivers.*' => $this->activeCentralDriverRule(),
        ];
    }

    private function activeCentralDriverRule()
    {
        $centralId = $this->input('centralId');

        return Rule::exists('centralDriver', 'driverId')->where(function ($query) use ($centralId) {
            $query->where('centralId', $centralId);
            $query->where('statusId', StatusConst::ACTIVE);
        });
    }

    private function requiredIfNewCustomerRule()
    {
        return Rule::requiredIf(function () {
            return !isset($this->request->get('tripCustomer')['id']);
        });
    }

    private function uniqueCustomerDocumentRule()
    {
        return Rule::unique('centralCustomer', 'document')
            ->where(function ($query) {
                $query->where('centralId', $this['centralId']);
            });
    }

    public function messages()
    {
        return [
            'schedules.required' => 'É necessário informar ao menos uma data de agendamento.',
            'schedules.array' => 'O campo de agendamentos está em um formato inválido.',
            'schedules.min' => 'É necessário selecionar ao menos uma data de agendamento.',
            'schedules.max' => 'É possível agendar no máximo ' . self::MAX_SCHEDULES . ' datas por vez.',

            'schedules.*.schedule.required' => 'Informe a data e o horário de cada agendamento.',
            'schedules.*.schedule.date' => 'Uma das datas de agendamento é inválida.',
            'schedules.*.schedule.after' => 'As datas de agendamento devem ser posteriores ao horário atual.',

            'schedules.*.scheduleUTC.required' => 'Informe a data e o horário de cada agendamento.',
            'schedules.*.scheduleUTC.date' => 'Uma das datas de agendamento é inválida.',

            'favoriteDrivers.*.exists' => 'Um dos motoristas selecionados não pertence a esta central ou está inativo.',
        ];
    }

    protected function validationData()
    {
        $messages = $this->all();

        if (isset($messages['tripCustomer']['document']))
            $messages['tripCustomer']['document'] = onlyCharacters($messages['tripCustomer']['document']);

        if (isset($messages['tripCustomer']['phone']))
            $messages['tripCustomer']['phone'] = onlyCharacters($messages['tripCustomer']['phone']);

        return $messages;
    }
}
