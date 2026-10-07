<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 16:21
 */

namespace Cash\Http\Controllers\Customer;


use App\Http\Responses\ApiResponse;
use Cash\Http\Requests\Customer\ListCustomersRequest;
use Cash\Services\Customer\CustomerService;

class CustomerController
{
    /**
     * @var CustomerService
     */
    private $service;

    public function __construct(CustomerService $service)
    {
        $this->service = $service;
    }

    public function listByPhoneList(ListCustomersRequest $request)
    {
        try {
            $result = $this->service
                ->findAllByPhoneNumberList($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar usuários");
        }

        return ApiResponse::success($result);
    }
}
