<?php

namespace App\Http\Requests\Price\DriverCommission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DriverCommissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "value"                => "sometimes|nullable|numeric",
            "valueType"            => ["sometimes", "nullable", Rule::in('%', '$')],
            "tripTypeId"           => "required|integer|exists:tripType,idTripType",
            "disableOnPromotion"   => "sometimes|nullable|boolean",
            "commissionAnotherFee" => "sometimes|nullable|array",
            "commissionAnotherFee.another_value" => "sometimes|nullable",
            "commissionAnotherFee.valueType"     => ['sometimes', 'nullable', Rule::in('%', '$')],
            "commissionAnotherFee.tax_value"     => "sometimes|nullable",
            "commissionAnotherFee.taxValueType"  => ['sometimes', 'nullable', Rule::in('%', '$')],
            "commissionsPaymentForm.*.value"     => "sometimes|nullable",
            "commissionsPaymentForm.*.valueType" => ['sometimes', 'nullable', Rule::in('%', '$')],
            "commissionsPaymentForm.*.tripPaymentFormId" => "sometimes|nullable|integer",
        ];
    }
}
