<?php

namespace App\Providers;

use App\Constants\StatusConst;
use App\Exceptions\ApiToken\ApiTokenException;
use Cash\Repositories\User\UserRepository;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Request;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * @var UserRepository
     */
    private $repository;

    public function __construct($app)
    {
        parent::__construct($app);
        $this->repository = new UserRepository;
    }

    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        \Auth::viaRequest('api_token', function (Request $request){

            $headers = $request->headers;

            $this->validateHeadersRequest([
                'token' => $headers->get('token'),
                'userid' => $headers->get('userid')
            ]);

            $user = $this->repository
                ->findForAuthProvider($headers->get('userid'));

            $this->validateUser($user, $headers->get('token'));

            return $user;
        });
    }

    /**
     * @param $request_headers
     * @throws ApiTokenException
     */
    private function validateHeadersRequest($request_headers)
    {
        try {
            \Validator::validate($request_headers, [
                'userid' => 'required|integer',
                'token' => [
                    'required',
                    function ($attribute, $value, $fail) {
                        if (password_get_info($value)['algo'] != PASSWORD_BCRYPT)
                            $fail("O campo {$attribute} está no formato inválido.");
                    }
                ]
            ]);
        } catch (ValidationException $e) {

            $errors = $e->errors();

            if ($errors['userid'])
                throw new ApiTokenException(implode(' ', $errors['userid']));

            if ($errors['token'])
                throw new ApiTokenException(implode(' ', $errors['token']));
        }
    }

    /**
     * @param $user
     * @param $token
     * @throws ApiTokenException
     */
    private function validateUser($user, $token)
    {
        if (!$user)
            throw new ApiTokenException("Usuário não encontrado");

        if (!password_verify($user->api_token, $token))
            throw new ApiTokenException("Token inválido");

        if ($user->statusId == StatusConst::REMOVED || $user->blocked)
            throw new ApiTokenException("Usuário não autorizado");
    }
}
