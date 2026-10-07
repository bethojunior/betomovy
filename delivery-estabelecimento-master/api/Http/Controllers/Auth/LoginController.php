<?php


namespace Api\Http\Controllers\Auth;


use Api\Http\Responses\ApiResponse;
use Api\Repositories\User\UserRepository;
use App\Constants\Company\CompanyRegisterStatusConst;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{

    /**
     * @var UserRepository
     */
    private $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function attemptLogin(Request $request)
    {
        $user = $this->repository
            ->findForAuth($request->email);

        if (!$user)
            return ApiResponse::error("E-mail ou senha inválido");

        if (base64_encode($request->password) != $user->password)
            return ApiResponse::error("E-mail ou senha inválido");

        $user->api_token = password_hash($user->api_token,PASSWORD_BCRYPT);

        if ($user->companyWorker->company->companyRegisterStatusId != CompanyRegisterStatusConst::ACTIVE)
            return ApiResponse::error("Sua conta não está habilitada");

        return ApiResponse::success($user, "Login efetuado com sucesso");
    }

}
