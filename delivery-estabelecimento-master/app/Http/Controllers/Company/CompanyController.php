<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyRequest;
use App\Services\Company\CompanyService;
use Illuminate\Http\Request;
use function GuzzleHttp\Promise\all;

class CompanyController extends Controller
{
    private $service;

    public function __construct(CompanyService  $service)
    {
        $this->service = $service;
    }

    public function update(CompanyRequest $request)
    {
        try {
            $this->service
                ->update($request->validated());

            toast('Dados do estabelecimento atualizados', 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        return redirect()
            ->back();
    }
}
