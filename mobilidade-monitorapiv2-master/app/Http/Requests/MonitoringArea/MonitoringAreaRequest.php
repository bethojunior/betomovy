<?php

namespace App\Http\Requests\MonitoringArea;

use Illuminate\Foundation\Http\FormRequest;

class MonitoringAreaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function validationData()
    {
        $data = $this->all();

        // Se os dados estão vazios ou incompletos mas há conteúdo JSON no body, tenta parsear
        // Isso resolve o problema quando o Content-Type está incorreto (ex: multipart/form-data sem boundary)
        if (($this->isJson() || empty($data) || (!isset($data['name']) && !isset($data['area']) && !isset($data['cityId']))) && $this->getContent()) {
            $jsonData = json_decode($this->getContent(), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($jsonData)) {
                $data = array_merge($data, $jsonData);
            }
        }

        return $data;
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'area' => 'required|array',
            'area.*.lat' => 'required|numeric',
            'area.*.lng' => 'required|numeric',
            'cityId' => 'required|integer|exists:city,id',
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'nome',
            'area' => 'area',
            'cityId' => 'cidade',
        ];
    }
}


