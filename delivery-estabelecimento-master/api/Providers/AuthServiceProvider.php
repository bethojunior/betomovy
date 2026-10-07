<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/06/2020
 * Time: 17:00
 */

namespace Api\Providers;

use Api\Exceptions\ApiToken\ApiTokenException;
use App\Constants\StatusConst;
use App\Repositories\User\UserRepository;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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

    public function boot()
    {
        $this->registerPolicies();

        \Auth::viaRequest('api_token', function (Request $request) {
            $headers = $request->headers;

            $this->validateHeadersRequest([
                'token' => $headers->get('token'),
                'userid' => $headers->get('userid')
            ]);

            $user = $this->repository
                ->findByIdForAuth($headers->get('userid'));

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
