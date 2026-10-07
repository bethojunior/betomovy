<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Utils\Admin704Apps\Admin704Apps;

class AdminLoginController extends Controller
{
    private Admin704Apps $admin704Apps;
    public function __construct(Admin704Apps $admin704Apps)
    {
        $this->admin704Apps = $admin704Apps;
    }

    public function login()
    {
        try {
            $result = $this->admin704Apps->loginCustomer();

            if ($result instanceof \Symfony\Component\HttpFoundation\Response) {
                return $result;
            }

            if (!is_object($result) || !isset($result->token)) {
                return ApiResponse::error(null, 'Erro ao efetuar login no admin');
            }

            return ApiResponse::success([
                'token' => $result->token,
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao efetuar login no admin');
        }
    }
    
}
