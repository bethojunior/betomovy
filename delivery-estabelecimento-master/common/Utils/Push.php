<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 14:56
 */

namespace Common\Utils;


use App\Models\Config\Config;
use Common\Exceptions\Utils\PushException;
use Kreait\Firebase\Factory;
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
     * @var \Kreait\Firebase\Messaging
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
    private $data;
    private $soundname;
    /**
     * @var \Kreait\Firebase\DynamicLinks
     */
    private $dynamicLinks;

    private function init()
    {
        if ($this->messaging) {
            return;
        }

        $pushFile = '../credentials/google_service_account.json';

        $jsonFile = file_exists($pushFile) ? $pushFile : 'credentials/google_service_account.json';

        if (!file_exists($jsonFile)) {
            $jsonFile = Config::getConf('google_service_account_json');
        }

        $factory = (new Factory)
            ->withServiceAccount($jsonFile);

        $this->messaging = $factory->createMessaging();
        $this->dynamicLinks = $factory->createDynamicLinksService('deliveryapp://deliveryapp');

        $this->icon = null;
    }

    /**
     * @param null $deviceToken
     * @return array|null
     */
    public function sendNotification($deviceToken = null)
    {
        $this->init();
        $deviceToken = $deviceToken ?? $this->deviceToken;

//        $this->validateSendPush();

        $message = CloudMessage::new()
            ->withNotification(array (
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
                'actions'     => $this->actions,
            ));

        return $this->trigger($message, is_array($deviceToken) ? $deviceToken : [$deviceToken]);
    }

    /**
     * @param null $deviceToken
     * @return mixed
     * @throws PushException
     */
    public function sendNotificationWithData($deviceToken = null)
    {
        $this->init();
        $this->deviceToken = $deviceToken ?? $this->deviceToken;

        $this->validateSendPush();

        $message = CloudMessage::new()
            ->withData([
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
            ]);

        return $this->trigger(
            $message,
            is_array($this->deviceToken) ? $this->deviceToken : [$this->deviceToken]
            );
    }

    /**
     * @param $tokens
     * @return array
     */
    public function notificationAll($tokens)
    {
        $fields = array (
            'title'         => $this->title,
            'body'          => $this->body,
            'sound'         => $this->soundname,
            'icon'          => $this->icon,
            'action'        => $this->action,
            'tag'           => $this->tag,
            'url'           => $this->link,
            'image'         => $this->image,
            'image-type'    => $this->imageType,
            'priority'      => $this->priority,
            'force-start'   => $this->forceStart,
            'data'          => $this->data,
            'soundname'     => $this->soundname,
        );

        $message = CloudMessage::new()
            ->withNotification($fields);

        return $this->trigger($message, is_array($tokens) ? $tokens : [$tokens]);
    }

    /**
     * Método não funciona para dispositivos iOS
     * @param $tokens
     * @return mixed
     */
    public function notificationAllWithData($tokens)
    {
        $this->init();
        $fields = array (
            "title"  => $this->title,
            "body"   => $this->body,
            "icon"   => $this->icon,
            "action" => $this->action,
            "tag"    => $this->tag,
            "url"    => $this->link,
            'image' => $this->image,
            'image-type' => $this->imageType,
            'priority'    => $this->priority,
            'force-start' => $this->forceStart,
            'content-available' => 1,
            'data' => $this->data,
            'soundname' => $this->soundname,
            'notId' => 1,
        );

        $message = CloudMessage::new()
            ->withData($fields);

        return $this->trigger($message, is_array($tokens) ? $tokens : [$tokens]);
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
    public function setSoundname($soundname): Push
    {
        $this->soundname = $soundname;
        return $this;
    }

    public function sendDeepLink(string $deviceToken)
    {
//        $this->dynamicLinks->
    }

    /**
     * @param CloudMessage $message
     * @param array $deviceTokens
     * @return array|null
     */
    private function trigger(CloudMessage $message, array $deviceTokens)
    {
        try {
            $result = $this->messaging->sendMulticast($message, $deviceTokens);
        } catch (\Kreait\Firebase\Exception\MessagingException $e) {
            return null;
        } catch (\Kreait\Firebase\Exception\FirebaseException $e) {
            return null;
        }

        return $result->map(function (\Kreait\Firebase\Messaging\SendReport $sendReport) {
            return [
                'isSuccess' => $sendReport->isSuccess(),
                'isFailure' => $sendReport->isFailure(),
            ];
        });
    }

    /**
     * @throws PushException
     */
    private function validateSendPush()
    {
//        if (!$this->title)
//            throw new PushException(600);

        if (!$this->deviceToken)
            throw new PushException("DeviceToken do push não informado");

//        if (!$this->body)
//            throw new PushException(602);
    }
}
