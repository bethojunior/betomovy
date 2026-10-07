<?php

namespace app\services;

use app\constant\PushConst;
use app\dao\UserDao;
use app\utils\Push;
use Exception;

class PushTestService
{
    /**
     * @throws Exception
     */
    public function send(int $userId): array
    {
        $user = (new UserDao())->find($userId, ['deviceToken']);

        if (!$user) {
            throw new Exception('Usuário não encontrado');
        }

        if (empty($user->deviceToken)) {
            throw new Exception('Usuário sem deviceToken cadastrado');
        }

        $result = (new Push())
            ->setTitle('Teste de push')
            ->setBody('Notificação de teste recebida com sucesso!')
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->sendNotification($user->deviceToken);

        return $result ?? ['isSuccess' => false, 'isFailure' => true];
    }
}
