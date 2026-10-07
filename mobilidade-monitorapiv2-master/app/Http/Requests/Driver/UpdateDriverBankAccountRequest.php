<?php

namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateDriverBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // Documento salvo só com dígitos, igual ao app do motorista
    protected function prepareForValidation(): void
    {
        $this->merge([
            'document' => preg_replace('/\D/', '', (string) $this->input('document')),
            'pix' => $this->filled('pix') ? trim((string) $this->input('pix')) : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'holderName' => 'required|string|max:150',
            'document' => 'required|digits_between:11,14',
            'bankId' => 'nullable|integer|exists:bank,idBank',
            'typeAccount' => 'nullable|in:corrente,poupanca,outra',
            'agency' => 'required_with:bankId|nullable|string|max:20',
            'agencyDigit' => 'nullable|string|max:10',
            'numberAccount' => 'required_with:bankId|nullable|string|max:25',
            'numberAccountDigit' => 'nullable|string|max:10',
            'op' => 'nullable|string|max:10',
            'pix' => 'required_with:pixType|nullable|string|max:100',
            'pixType' => 'required_with:pix|nullable|in:cpf_cnpj,phone,email,random',
        ];
    }

    // Precisa de ao menos um destino para o saque: conta bancária ou Pix
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (!$this->filled('bankId') && !$this->filled('pix')) {
                $validator->errors()->add('bankId', 'Informe uma conta bancária ou uma chave Pix.');
            }
        });
    }

    public function attributes(): array
    {
        return [
            'holderName' => 'titular',
            'document' => 'CPF/CNPJ do titular',
            'bankId' => 'banco',
            'typeAccount' => 'tipo de conta',
            'agency' => 'agência',
            'agencyDigit' => 'dígito da agência',
            'numberAccount' => 'número da conta',
            'numberAccountDigit' => 'dígito da conta',
            'op' => 'operação',
            'pix' => 'chave Pix',
            'pixType' => 'tipo da chave Pix',
        ];
    }
}
