<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 14:18
 */

namespace Delivery\Http\Controllers\User;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\User\CustomerAsaasRequest;
use Delivery\Repositories\User\CustomerRepository;
use Delivery\Services\User\CustomerService;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * @var CustomerRepository
     */
    private $repository;
    private $service;

    public function __construct(CustomerService $service, CustomerRepository $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
    }

    public function findByUser(Request $request)
    {
        $user = $request->user();
        try {
            $customer = $this->repository
                ->findByUser($user->idUser);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar cliente");
        }

        return ApiResponse::success($customer);
    }

    public function updateAddress(int $id, Request $request)
    {
        try {
            if (!$request->has('zipcode')) throw new \Exception("CEP não enviado");
            if (!$request->has('addressNumber')) throw new \Exception("Número do endereço não enviado");

            $result = $this->service->updateAddress($id, $request->zipcode, $request->addressNumber);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar endereço");
        }

        return ApiResponse::success($result, 'Endereço salvo com sucesso');
    }

    public function createCustomerInAsaas(CustomerAsaasRequest $request, CustomerService $service)
    {
        try {
            $this->service->createCustomerInAsaas($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar endereço");
        }

        return ApiResponse::success(null, 'Endereço salvo com sucesso');
    }
}
