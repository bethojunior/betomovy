<?php


namespace App\Http\Controllers\Config;


use App\Http\Controllers\Controller;
use App\Http\Requests\Config\SettingDeliveryCompanyPixRequest;
use App\Services\Config\SettingDeliveryCompanyPixService;

class SettingDeliveryCompanyPixController extends Controller
{
    private $service;

    public function __construct(SettingDeliveryCompanyPixService $service)
    {
        $this->service = $service;
    }

    public function update(SettingDeliveryCompanyPixRequest $request)
    {
        try {
            $this->service
                ->update($request->validated());
            toast('Atualização de configurações pix', 'success');

        } catch (\Exception $e) {
            toast('Erro ao atualizar configurações', 'error');
        }

        return redirect()
            ->back();
    }
}
