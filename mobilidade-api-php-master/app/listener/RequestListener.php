<?php

namespace app\listener;

use app\dao\ro\user\PartnerRoDao;
use app\dao\ro\user\UserRoDao;
use app\exceptions\ApiTokenException;
use app\model\Partner;
use app\model\User;
use app\utils\RedisUtil;
use app\validator\RequestHeaderValidator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/11/2018
 * Time: 12:35
 */
class RequestListener
{
    private RequestHeaderValidator $validator;

    public function __construct()
    {
        $this->validator = new RequestHeaderValidator;
    }

    /**
     * @param array $headers
     * @throws ApiTokenException
     * @throws Exception
     */
    public function headersListener(array $headers)
    {
        $token = $headers['token'] ?? ($headers['Token'] ?? '');
        $userId = $headers['userid'] ?? ($headers['Userid'] ?? '');

        $this->validator->validateRequestHeader([
            'token' => $token,
            'userId' => $userId
        ]);

        $redis = new RedisUtil;
        if ($redis->get("user-{$userId}-verified") == $token) {
            return;
        }

        $redis->delete("user-{$userId}-verified");

        $user = (new UserRoDao)
            ->find($userId, ['api_token', 'blocked']);

        if ($user) {
            $partner = (new PartnerRoDao)->findSimpleByUser($userId);
        }

        $this->validator->verifyUserToken(
            new User($user),
            $token,
            isset($partner) ? new Partner($partner) : null
        );

        $redis->set("user-{$userId}-verified", $token);
    }
}
