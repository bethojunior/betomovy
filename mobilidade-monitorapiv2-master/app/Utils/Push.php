<?php


namespace App\Utils;


use App\Constants\Push\PushConst;
use App\Services\Push\FcmSenderService;
use ExponentPhpSDK\Expo;
use ExponentPhpSDK\ExpoRegistrar;
use ExponentPhpSDK\ExpoRepository;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Messaging\CloudMessage;

class Push
{
    const SERVICE = 0;
    const MESSAGE = 1;

    private const MAX_DEVICE_TOKENS_PUSH_BY_ROUND = 500;

    /**
     * Limite prático recomendado pela Expo por requisição de push.
     */
    private const MAX_EXPO_TOKENS_PER_REQUEST = 100;

    private $firebaseToken;

    /**
     * @var FcmSenderService
     */
    private $fcmSender;

    private $title;
    private $deviceToken;
    private $icon;
    private $action;
    private $message;
    private $link;
    private $body;
    private $tag;
    private $priority;
    private $image;
    private $imageType;
    private $forceStart;
    private $data;
    private $soundname;

    public function __construct()
    {
        $this->fcmSender = new FcmSenderService();

        $this->icon = null;
    }

    /**
     * @param null $deviceToken
     * @return mixed
     */
    public function sendNotification($deviceToken = null)
    {
        $deviceToken = $deviceToken ?? $this->deviceToken;
        $tokens = is_array($deviceToken) ? $deviceToken : [$deviceToken];

        $this->sendExpoNotification($tokens);

        $fcmTokens = array_values(array_filter($tokens, fn($token) => is_string($token) && str_contains($token, ':')));

        if (empty($fcmTokens)) {
            return null;
        }

        $message = CloudMessage::new()
            ->withNotification($this->buildNotification())
            ->withData($this->buildDataPayload([
                'sound'       => $this->soundname,
                'icon'        => $this->icon,
                'tag'         => $this->tag,
                'url'         => $this->link,
                'priority'    => $this->priority,
                'force-start' => $this->forceStart,
                'message'     => $this->message,
                'image'       => $this->image,
                'image-type'  => $this->imageType,
                'soundname'   => $this->soundname,
                'action'      => $this->action,
            ]));

        return $this->fcmSender->send($message, $fcmTokens);
    }

    /**
     * @param array|string|null $deviceTokens
     * @return array
     */
    public function sendNotificationOneByOne($deviceTokens = null)
    {
        $deviceTokens = is_array($deviceTokens) ? $deviceTokens : [$deviceTokens ?? $this->deviceToken];

        $flatTokens = [];
        foreach ($deviceTokens as $token) {
            if (is_array($token)) {
                $flatTokens = array_merge($flatTokens, $token);
            } elseif (is_string($token) && str_contains($token, ',')) {
                $flatTokens = array_merge($flatTokens, explode(',', $token));
            } elseif (!empty($token)) {
                $flatTokens[] = $token;
            }
        }

        $flatTokens = array_filter(array_map('trim', $flatTokens));

        $this->sendExpoNotification($flatTokens);

        $fcmTokens = [];

        foreach ($flatTokens as $token) {
            if (str_contains($token, ':')) {
                $fcmTokens[] = $token; // token FCM
            }
        }

        if (empty($fcmTokens)) {
            return [];
        }

        $message = CloudMessage::new()
            ->withNotification($this->buildNotification())
            ->withData($this->buildDataPayload([
                'sound' => $this->soundname,
                'icon' => $this->icon,
                'tag' => $this->tag,
                'url' => $this->link,
                'priority' => $this->priority,
                'force-start' => $this->forceStart,
                'message' => $this->message,
                'image' => $this->image,
                'image-type' => $this->imageType,
                'soundname' => $this->soundname,
                'action' => $this->action,
                'notId' => 1,
                'content-available' => 1,
            ]));

        return $this->fcmSender->send($message, $fcmTokens);
    }

    /**
     * @param null $deviceToken
     * @return array
     */
    public function sendNotificationWithData($deviceToken = null)
    {
        $deviceToken = $deviceToken ?? $this->deviceToken;

        $deviceTokens = is_array($deviceToken) ? $deviceToken : [$deviceToken];

        $flatTokens = [];
        foreach ($deviceTokens as $token) {
            if (is_array($token)) {
                $flatTokens = array_merge($flatTokens, $token);
            } elseif (is_string($token) && str_contains($token, ',')) {
                $flatTokens = array_merge($flatTokens, explode(',', $token));
            } elseif (!empty($token)) {
                $flatTokens[] = $token;
            }
        }

        $flatTokens = array_filter(array_map('trim', $flatTokens));

        $this->sendExpoNotification($flatTokens, false);

        $fcmTokens = [];

        foreach ($flatTokens as $token) {
            if (str_contains($token, ':')) {
                $fcmTokens[] = $token; // token FCM
            }
        }

        if (empty($fcmTokens)) {
            return [];
        }

        $message = CloudMessage::new()
            ->withData($this->buildDataPayload([
                'title'       => $this->title,
                'body'        => $this->body,
                'sound'       => $this->soundname,
                'icon'        => $this->icon,
                'tag'         => $this->tag,
                'url'         => $this->link,
                'priority'    => $this->priority,
                'force-start' => $this->forceStart,
                'message'     => $this->message,
                'image'       => $this->image,
                'image-type'  => $this->imageType,
                'soundname'   => $this->soundname,
                'action'      => $this->action,
                'notId'       => 1,
                'content-available' => 1,
            ]));

        return $this->fcmSender->send($message, $fcmTokens);
    }

    private function sendExpoNotification($tokens, bool $foreground = true)
    {
        $expoTokens = array_values(array_filter($tokens, fn($token) => is_string($token) && strpos($token, 'ExponentPushToken') === 0));

        if (empty($expoTokens)) {
            return null;
        }

        $notification = [
            "title"               => $this->title,
            "body"                => $this->body,
            "sound"               => $this->soundname ?: 'default',
            "priority"            => $this->mapExpoPriority(),
            "displayInForeground" => $foreground,
            "data"                => $this->buildDataPayload([
                'icon'        => $this->icon,
                'tag'         => $this->tag,
                'url'         => $this->link,
                'force-start' => $this->forceStart,
                'message'     => $this->message,
                'action'      => $this->action,
            ]),
        ];

        foreach (array_chunk($expoTokens, self::MAX_EXPO_TOKENS_PER_REQUEST) as $chunk) {
            try {
                $expo = new Expo(new ExpoRegistrar($this->makeInMemoryExpoRepository()));

                foreach ($chunk as $deviceToken) {
                    $expo->subscribe('push', $deviceToken);
                }

                $expo->notify(['push'], $notification);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }

        return null;
    }

    /**
     * Repositório de interesses em memória, só para o tempo desta requisição — evita
     * que o ExponentPhpSDK grave um arquivo em disco (storage/tokens.json) a cada envio.
     */
    private function makeInMemoryExpoRepository(): ExpoRepository
    {
        return new class implements ExpoRepository {
            private array $tokens = [];

            public function store($key, $value): bool
            {
                $this->tokens[$key][] = $value;
                return true;
            }

            public function retrieve(string $key)
            {
                return $this->tokens[$key] ?? null;
            }

            public function forget(string $key, string $value = null): bool
            {
                unset($this->tokens[$key]);
                return true;
            }
        };
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
     * @param mixed $data
     * @return Push
     */
    public function setData($data)
    {
        $this->data = $data;
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

    private function mapExpoPriority(): string
    {
        return $this->priority === PushConst::HIGH_PRIORITY ? 'high' : 'default';
    }

    private function buildNotification(): array
    {
        return array_filter([
            'title' => $this->title,
            'body'  => $this->body,
            'image' => $this->image,
        ], fn($v) => $v !== null);
    }

    private function buildDataPayload(array $data): array
    {
        return array_map('strval', array_filter($data, fn($v) => $v !== null));
    }

    /**
     * @param $deviceTokens
     */
    public function prepareDeviceTokens(&$deviceTokens)
    {
        $deviceTokens = array_chunk($deviceTokens, self::MAX_DEVICE_TOKENS_PUSH_BY_ROUND);
    }

    /**
     * @param $request
     * @param $linkPicture
     */
    public function preparePush($request, $linkPicture)
    {
        $this->setBody($request['message']);
        $this->setMessage($request['message']);
        $this->setTitle($request['title']);
    }

}
