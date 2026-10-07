<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2019
 * Time: 10:23
 *
 * Portado de mobilidade-api-php (app/utils/Push.php): envio por token individual
 * (Kreait Messaging::send) em vez de sendMulticast, com suporte a Expo (obrigatório
 * pra tokens ExponentPushToken, que não passam pelo FCM/Kreait) e additionalData.
 */

namespace App\Utils;

use App\Constants\Push\PushConst;
use App\Exceptions\Utils\PushException;
use App\Models\Config\Config;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;

/**
 * Class Push
 * Needs install the package: kreait/firebase-php
 */
class Push
{
    const SERVICE = 0;
    const MESSAGE = 1;

    /**
     * @var Messaging
     */
    private $messaging;

    private $title;
    private $deviceToken;
    private $icon;
    private $action;
    private $actions = array();
    private $message;
    private $link;
    private $body;
    private $tag;
    private $priority;
    private $image;
    private $imageType;
    private $forceStart;
    private $additionalData;
    private $soundname;
    private $collapseId;
    private $categoryId;

    public function __construct()
    {
        $this->icon = null;
    }

    private function startClient(): void
    {
        if ($this->messaging instanceof Messaging) {
            return;
        }

        $pushFile = '../credentials/google_service_account.json';

        $jsonFile = file_exists($pushFile) ? $pushFile : 'credentials/google_service_account.json';

        if (!file_exists($jsonFile)) {
            $keyFile = Config::getConf('google_service_account_json');
            $jsonFile = json_decode($keyFile, true);
        }

        $factory = (new Factory)
            ->withServiceAccount($jsonFile);

        $this->messaging = $factory->createMessaging();
    }

    /**
     * @param null $deviceToken
     * @return mixed
     * @throws PushException|\Exception
     */
    public function sendNotification($deviceToken = null)
    {
        $this->startClient();

        $deviceToken = $deviceToken ?? $this->deviceToken;

        if (empty($deviceToken) || is_array($deviceToken)) return null;

        $this->sendExpoNotification([$deviceToken]);

        if (strpos($deviceToken, 'ExponentPushToken') === 0) {
            return ['isSuccess' => true, 'isFailure' => false];
        }

        $data = $this->buildDataPayload();
        $notification = $this->buildNotification();

        $message = CloudMessage::new()
            ->withTarget('token', $deviceToken)
            ->withNotification($notification)
            ->withData($data);

        try {
            $result = $this->triggerSingle($message);

            return [
                'isSuccess' => isset($result['name']),
                'isFailure' => !isset($result['name'])
            ];
        } catch (\Exception $e) {
            return ['isSuccess' => false, 'isFailure' => true, 'error' => $e->getMessage()];
        }
    }

    /**
     * @param null $deviceToken
     * @return mixed
     * @throws PushException|\Exception
     */
    public function sendNotificationWithData($deviceToken = null)
    {
        $this->startClient();

        $deviceToken = $deviceToken ?? $this->deviceToken;

        if (empty($deviceToken) || is_array($deviceToken)) return null;

        $this->sendExpoNotification([$deviceToken], false);

        if (strpos($deviceToken, 'ExponentPushToken') === 0) {
            return ['isSuccess' => true, 'isFailure' => false];
        }

        $data = $this->buildDataPayload(['notId' => '1']);

        $message = CloudMessage::new()
            ->withTarget('token', $deviceToken)
            ->withAndroidConfig(['priority' => 'high'])
            ->withApnsConfig([
                'headers' => [
                    'apns-content-available' => '1',
                    'apns-priority'          => '10',
                ],
                'payload' => [
                    'aps' => [
                        'content-available' => 1,
                        'sound'             => $this->soundname ?: 'default',
                    ],
                ],
            ])
            ->withData($data);

        try {
            $result = $this->triggerSingle($message);

            return [
                'isSuccess' => isset($result['name']),
                'isFailure' => !isset($result['name'])
            ];
        } catch (\Exception $e) {
            return ['isSuccess' => false, 'isFailure' => true, 'error' => $e->getMessage()];
        }
    }

    /**
     * @param $deviceTokens
     * @return array|null
     * @throws \Exception
     */
    public function notificationAll($deviceTokens = null)
    {
        $this->startClient();

        $deviceTokens = $this->getValidDeviceTokens($deviceTokens);
        $results = [];

        if (empty($deviceTokens)) return null;

        $this->sendExpoNotification($deviceTokens);

        foreach ($deviceTokens as $deviceToken) {
            if (strpos($deviceToken, 'ExponentPushToken') === 0) {
                $results[$deviceToken] = ['isSuccess' => true, 'isFailure' => false];
                continue;
            }

            $data = $this->buildDataPayload();
            $notification = $this->buildNotification();

            $message = CloudMessage::new()
                ->withTarget('token', $deviceToken)
                ->withNotification($notification)
                ->withData($data);

            try {
                $result = $this->triggerSingle($message);

                $results[$deviceToken] = [
                    'isSuccess' => isset($result['name']),
                    'isFailure' => !isset($result['name']),
                ];
            } catch (\Exception $e) {
                $results[$deviceToken] = ['isSuccess' => false, 'isFailure' => true, 'error' => $e->getMessage()];
            }
        }

        return $results;
    }

    /**
     * @param array|string|null $deviceTokens
     * @return array|null
     * @throws \Exception
     */
    public function notificationAllWithData($deviceTokens = null)
    {
        $this->startClient();

        $deviceTokens = $this->getValidDeviceTokens($deviceTokens);

        $results = [];

        if (empty($deviceTokens)) return null;

        $this->sendExpoNotification($deviceTokens, false);

        foreach ($deviceTokens as $deviceToken) {
            if (strpos($deviceToken, 'ExponentPushToken') === 0) {
                $results[$deviceToken] = ['isSuccess' => true, 'isFailure' => false];
                continue;
            }

            $data = $this->buildDataPayload(['notId' => '1']);

            $message = CloudMessage::new()
                ->withTarget('token', $deviceToken)
                ->withAndroidConfig(['priority' => 'high'])
                ->withApnsConfig([
                    'headers' => [
                        'apns-content-available' => '1',
                        'apns-priority'          => '10',
                    ],
                    'payload' => [
                        'aps' => [
                            'content-available' => 1,
                            'sound'             => $this->soundname ?: 'default',
                        ],
                    ],
                ])
                ->withData($data);

            try {
                $result = $this->triggerSingle($message);

                $results[$deviceToken] = [
                    'isSuccess' => isset($result['name']),
                    'isFailure' => !isset($result['name'])
                ];
            } catch (\Exception $e) {
                $results[$deviceToken] = ['isSuccess' => false, 'isFailure' => true, 'error' => $e->getMessage()];
            }
        }

        return $results;
    }

    public function sendExpoNotification(array $tokens = [], bool $foreground = true)
    {
        $tokens = $this->getValidDeviceTokens($tokens);

        if (empty($tokens)) return null;

        array_map(function ($deviceToken) use ($foreground) {
            if (strpos($deviceToken, 'ExponentPushToken') !== 0) {
                return;
            }

            try {
                $notification = [
                    "title"               => $this->title,
                    "body"                => $this->body,
                    "sound"               => $this->soundname ?: 'default',
                    "priority"            => $this->mapExpoPriority(),
                    "displayInForeground" => $foreground,
                    "data"                => $this->buildDataPayload(),
                ];

                if ($this->collapseId !== null) {
                    $notification['collapseId'] = $this->collapseId;
                }

                if ($this->categoryId !== null) {
                    $notification['categoryId'] = $this->categoryId;
                }

                $channelName = 'news_' . rand();
                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $expo->subscribe($channelName, $deviceToken);
                $expo->notify([$channelName], $notification);
            } catch (\Throwable $e) {
                // captura \Throwable (não só \Exception) pra não derrubar o comando
                // se a classe do Expo SDK não estiver instalada/der erro
            }
        }, $tokens);
    }

    /**
     * @param mixed $title
     * @return Push
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * @param mixed $deviceToken
     * @return Push
     */
    public function setDeviceToken($deviceToken)
    {
        $this->deviceToken = $deviceToken;
        return $this;
    }

    /**
     * @param string $icon
     * @return Push
     */
    public function setIcon(?string $icon): Push
    {
        $this->icon = $icon;
        return $this;
    }

    /**
     * @param mixed $action
     * @return Push
     */
    public function setAction($action)
    {
        $this->action = $action;
        return $this;
    }

    /**
     * @param mixed $link
     * @return Push
     */
    public function setLink($link)
    {
        $this->link = $link;
        return $this;
    }

    /**
     * @param mixed $body
     * @return Push
     */
    public function setBody($body)
    {
        $this->body = $body;
        return $this;
    }

    /**
     * @param mixed $message
     * @return Push
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @param mixed $tag
     * @return Push
     */
    public function setTag($tag)
    {
        $this->tag = $tag;
        return $this;
    }

    /**
     * @param mixed $priority
     * @return Push
     */
    public function setPriority($priority)
    {
        $this->priority = $priority;
        return $this;
    }

    /**
     * @param mixed $image
     * @return Push
     */
    public function setImage($image)
    {
        $this->image = $image;
        return $this;
    }

    /**
     * @param mixed $imageType
     * @return Push
     */
    public function setImageType($imageType)
    {
        $this->imageType = $imageType;
        return $this;
    }

    /**
     * @param mixed $forceStart
     * @return Push
     */
    public function setForceStart($forceStart)
    {
        $this->forceStart = $forceStart;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAdditionalData()
    {
        return $this->additionalData;
    }

    /**
     * @param mixed $additionalData
     * @return Push
     */
    public function setAdditionalData($additionalData)
    {
        $this->additionalData = json_encode($additionalData);
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSoundname()
    {
        return $this->soundname;
    }

    /**
     * @param mixed $soundname
     */
    public function setSoundname($soundname): void
    {
        $this->soundname = $soundname;
    }

    /**
     * @param mixed $collapseId
     * @return Push
     */
    public function setCollapseId($collapseId): Push
    {
        $this->collapseId = $collapseId;
        return $this;
    }

    /**
     * @param mixed $categoryId
     * @return Push
     */
    public function setCategoryId($categoryId): Push
    {
        $this->categoryId = $categoryId;
        return $this;
    }

    private function mapExpoPriority(): string
    {
        // [suposição] valor vindo de pushConfig.priority (DB) pode chegar como string;
        // comparação por (int) cobre "2" e 2.
        return (int)$this->priority === PushConst::HIGH_PRIORITY ? 'high' : 'default';
    }

    private function buildNotification(): array
    {
        return array_filter([
            'title' => $this->title,
            'body'  => $this->body,
            'image' => $this->image,
        ], function ($v) { return $v !== null; });
    }

    private function buildDataPayload(array $extra = []): array
    {
        $data = [
            'sound'          => $this->soundname,
            'icon'           => $this->icon,
            'tag'            => $this->tag,
            'url'            => $this->link,
            'priority'       => $this->priority,
            'force-start'    => $this->forceStart,
            'message'        => $this->message,
            'image'          => $this->image,
            'image-type'     => $this->imageType,
            'soundname'      => $this->soundname,
            'action'         => $this->action,
            'additionalData' => $this->additionalData
        ] + $extra;

        return array_map('strval', array_filter($data, function ($v) { return $v !== null; }));
    }

    /**
     * @param CloudMessage $message
     * @return array|null
     */
    private function triggerSingle(CloudMessage $message)
    {
        try {
            return $this->messaging->send($message);
        } catch (\Kreait\Firebase\Exception\MessagingException | \Kreait\Firebase\Exception\FirebaseException $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * @throws PushException
     */
    private function validateSendPush()
    {
        if (!$this->deviceToken)
            throw new PushException(601);
    }

    private function getValidDeviceTokens($deviceTokens): array
    {
        if (!empty($deviceTokens) && is_array($deviceTokens)) {
            return $deviceTokens;
        } elseif (!empty($deviceTokens)) {
            return [$deviceTokens];
        } elseif (!empty($this->deviceToken)) {
            return [$this->deviceToken];
        } else {
            return [];
        }
    }
}
