<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyOpenHourRequest;
use App\Services\Company\CompanyOpenHourService;
use Illuminate\Http\Request;

class CompanyOpenHourController extends Controller
{
    /**
     * @var CompanyOpenHourService
     */
    private $service;

    public function __construct(CompanyOpenHourService $service)
    {
        $this->service = $service;
    }

    public function save(CompanyOpenHourRequest $request)
    {
        try {
            $this->service
                ->save($request->validated());

            toast('Horários de funcionamento atualizados', 'success');
        } catch (\Exception $e) {
            toast('Erro ao atualizar os horários de funcionamento', 'error');
        }

        return redirect()
            ->back();
    }
}
