<?php
/**
 * Created by Visual Studio Code.
 * User: Eduardo Roseo
 * Date: 18/10/2020
 * Time: 14:17
 */

namespace App\Helpers\Push;

use App\Helpers\Config\PushConfigHelper;
use App\Utils\Push;

class PushHelper
{
    private $pushConfigHelper;
    private $push;

    function __construct(PushConfigHelper $pushConfigHelper, Push $push)
    {
        $this->pushConfigHelper = $pushConfigHelper;
        $this->push = $push;
    }

    public function sendByKey(string $key, string $deviceToken)
    {
        $pushConfig = $this->pushConfigHelper->get($key);

        $this->push
            ->setMessage($pushConfig->message)
            ->setBody($pushConfig->message)
            ->setTitle($pushConfig->title)
            ->setDeviceToken($deviceToken);

        return $this->push->sendNotificationOneByOne();
    }
}
