<?php

namespace App\Http\Controllers\Auth;

use App\Constants\Company\CompanyRegisterStatusConst;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Repositories\User\UserRepository;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;
    /**
     * @var UserRepository
     */
    private $repository;

    /**
     * Create a new controller instance.
     *
     * @param UserRepository $repository
     */
    public function __construct(UserRepository $repository)
    {
        $this->middleware('guest')->except('logout');
        $this->repository = $repository;
    }

    protected function attemptLogin(Request $request)
    {
        $user = $this->repository
            ->findForAuth($request->email);

        if (!$user)
            return false;

        if (base64_encode($request->password) != $user->password)
            return false;

        if ($user->companyWorker->company->companyRegisterStatusId != CompanyRegisterStatusConst::ACTIVE)
            throw ValidationException::withMessages([
                $this->username() => ['Sua conta não está habilitada'],
            ]);

        return $this->guard()
            ->loginUsingId($user->idUser);
    }
}
