<?php

namespace app\utils;

use app\constant\PushConst;
use app\exceptions\PushException;
use app\model\Config;
use app\utils\Pulse\PulseService;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

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

    /**
     * @var PulseService
     */
    private $pulseService;

    public function __construct()
    {
        $pushFile = '../configs/env/push.json';

        $jsonFile = file_exists($pushFile) ? $pushFile : '../configs/env/env.json';

        if (!file_exists($jsonFile)) {
            $keyFile = Config::get('google_service_account_json');
            $jsonFile = json_decode($keyFile, true);
        }

        $factory = (new Factory)
            ->withServiceAccount($jsonFile);

        $this->messaging = $factory->createMessaging();

        $this->icon = null;

        $this->pulseService = new PulseService(
            'api-php-' . Config::get('app_title'),
            '5a0a39bf-5115-432c-ae71-9153bc8855c2',
        );
    }

    /**
     * @param null $deviceToken
     * @return mixed
     * @throws PushException|Exception
     */
    public function sendNotification($deviceToken = null)
    {
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
                'isSuccess' => isset($result['name']), // Sucesso se a chave 'name' existir
                'isFailure' => !isset($result['name']) // Falha se a chave 'name' não existir
            ];
        } catch (\Exception $e) {
            return ['isSuccess' => false, 'isFailure' => true, 'error' => $e->getMessage()];
        }
    }

    /**
     * @param null $deviceToken
     * @return mixed
     * @throws PushException|Exception
     */
    public function sendNotificationWithData($deviceToken = null)
    {
        $deviceToken = $deviceToken ?? $this->deviceToken;

        if (empty($deviceToken) || is_array($deviceToken)) return null;

        $this->sendExpoNotification([$deviceToken], false);

        if (strpos($deviceToken, 'ExponentPushToken') === 0) {
            return ['isSuccess' => true, 'isFailure' => false];
        }

        $data = $this->buildDataPayload(['notId' => '1']);

        $message = $this->withVisibleAlert(
            CloudMessage::new()
                ->withTarget('token', $deviceToken)
                ->withData($data)
        );

        try {
            $result = $this->triggerSingle($message);

            return [
                'isSuccess' => isset($result['name']), // Sucesso se a chave 'name' existir
                'isFailure' => !isset($result['name']) // Falha se a chave 'name' não existir
            ];
        } catch (\Exception $e) {
            return ['isSuccess' => false, 'isFailure' => true, 'error' => $e->getMessage()];
        }
    }

    /**
     * @param $deviceTokens
     * @return array|string|null
     * @throws PushException|Exception
     */
    public function notificationAll($deviceTokens = null)
    {
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
     * @return array
     * @throws Exception
     */
    public function notificationAllWithData($deviceTokens = null)
    {
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

            $message = $this->withVisibleAlert(
                CloudMessage::new()
                    ->withTarget('token', $deviceToken)
                    ->withData($data)
            );

            try {
                $result = $this->triggerSingle($message);

                $results[$deviceToken] = [
                    'isSuccess' => isset($result['name']), // Sucesso se a chave 'name' existir
                    'isFailure' => !isset($result['name']) // Falha se a chave 'name' não existir
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

        try {
            array_map(function ($deviceToken) use ($foreground) {
                if (strpos($deviceToken, 'ExponentPushToken') === 0) {
                    $notification = [
                        "title"               => $this->title,
                        "body"                => $this->body,
                        "sound"               => 'default',
                        "priority"            => $this->mapExpoPriority(),
                        "channelId"           => 'tripCall',
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
                }
            }, $tokens);
        } catch (\Exception $e) {
            $this->pulseService->handle($e->getTraceAsString(), 'App\Utils\Push', 'critical');
            return null;
        }
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
        return $this->priority === PushConst::HIGH_PRIORITY ? 'high' : 'default';
    }

    /**
     * Mensagem só com data não abre banner nem toca no Android/iOS.
     * Android 8+ toca o som do canal, não o do payload.
     * O aplicativo cria o canal tripCall com assobio.mp3.
     * APNs não aceita mp3; som inválido pode derrubar o alerta.
     */
    private function withVisibleAlert(CloudMessage $message): CloudMessage
    {
        $soundFile = $this->soundname ?: 'default';
        $androidSound = preg_replace('/\.(mp3|wav|caf)$/i', '', $soundFile) ?: 'default';
        $apnsSound = preg_match('/\.(caf|wav|aiff|aif)$/i', $soundFile) ? $soundFile : 'default';

        return $message
            ->withNotification(Notification::create($this->title ?: 'Nova corrida', $this->body ?: 'Há uma corrida disponível'))
            ->withAndroidConfig([
                'priority' => 'high',
                'notification' => [
                    'channel_id' => 'tripCall',
                    'sound' => $androidSound,
                    'default_sound' => false,
                ],
            ])
            ->withApnsConfig([
                'headers' => [
                    'apns-priority' => '10',
                    'apns-push-type' => 'alert',
                ],
                'payload' => [
                    'aps' => [
                        'alert' => [
                            'title' => $this->title,
                            'body' => $this->body,
                        ],
                        'sound' => $apnsSound,
                    ],
                ],
            ]);
    }

    private function buildNotification(): array
    {
        return array_filter([
            'title' => $this->title,
            'body'  => $this->body,
            'image' => $this->image,
        ], fn($v) => $v !== null);
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

        return PushData::stringify($data);
    }

    /**
     * @param CloudMessage $message
     * @return \Kreait\Firebase\Messaging\SendReport|null
     */
    private function triggerSingle(CloudMessage $message)
    {
        try {
            return $this->messaging->send($message);
        } catch (\Kreait\Firebase\Exception\MessagingException | \Kreait\Firebase\Exception\FirebaseException $e) {
            $this->pulseService->handle($e->getTraceAsString(), 'App\Utils\Push', 'critical');
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * @throws PushException
     */
    private function validateSendPush()
    {
        //        if (!$this->title)
        //            throw new PushException(600);

        if (!$this->deviceToken)
            throw new PushException(601);

        //        if (!$this->body)
        //            throw new PushException(602);
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
