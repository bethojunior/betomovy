<?php

namespace app\dao;

use app\constant\ChatCallConst;
use app\constant\ChatMessageAudioConst;
use app\constant\PlatformConst;
use app\constant\PushActionConst;
use app\constant\PushConst;
use app\constant\PushTagConst;
use app\exceptions\PushException;
use app\model\ChatTrip;
use app\model\Log;
use app\model\LogApp;
use app\model\LogType;
use app\model\MessagesChatTrip;
use app\model\Trip;
use app\model\User;
use app\realtime\ChatTripRealtime;
use app\realtime\MessagesChatTripRealtime;
use app\utils\Audio;
use app\utils\BaseDao;
use app\utils\Headers;
use app\utils\Push;
use app\validator\ChatTripValidator;
use DateTime;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 06/08/2018
 * Time: 14:15
 */
class ChatTripDao extends BaseDao
{
    protected $table = "chatTrip";
    private $validator;

    public function __construct()
    {
        $this->validator = new ChatTripValidator;

        parent::__construct();
    }

    /**
     * @param string $tripReference
     * @param int|null $userId
     * @return stdClass
     * @throws Exception
     */
    public function init(string $tripReference, ?int $userId = null): stdClass
    {
        try {
            $trip = (new TripDao)->find($tripReference);

            if (empty($trip->driverId) || $trip->status == Trip::CANCELED)
                throw new Exception("Corrida encerrada ou nenhum motorista a aceitou!");

            $chat = new ChatTrip;
            $chat
                ->setTripReference($tripReference)
                ->setDriverId($trip->driverId)
                ->setUserId($userId ?? $trip->userId)
                ->setStatus(ChatTrip::ACTIVE)
                ->setIdChatTrip(
                    $this->sqlInsert($chat)
                );

            return $chat->toStdClass();
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function findByTrip($tripReference, ?int $userId = null)
    {
        $where = [['tripReference', '=', ':tripReference']];
        $bind = ['tripReference' => $tripReference];

        if ($userId) {
            $where[0][] = 'AND';
            $where[] = ['userId', '=', ':userId'];
            $bind += [':userId' => $userId];
        }

        return $this->sqlSelect([], $where, [], 1)
            ->bind($bind)
            ->first();
    }


    /**
     * @param string $tripReference
     * @return stdClass|null
     * @throws Exception
     */
    private function createChatIfNotExist(string $tripReference): ?stdClass
    {
        $chat = $this->findByTrip($tripReference);

        if (empty($chat)) {
            $chat = $this->init($tripReference);
            $driver = (new DriverDao)->find($chat->driverId, false);

            $log = new Log(LogType::PROCESS);
            $log->setData((object)['chat' => $chat, 'driver' => $driver])
                ->setIdReference($tripReference)
                ->setUserId(Headers::getUserId())
                ->setApp($driver ? LogApp::DRIVER : LogApp::PWA)
                ->setMessage("CHAT INICIADO");

            (new LogDao)->insert($log);
        }

        return $chat;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function sendMessage($request)
    {
        $this->validator->validateInsertMessage($request);

        $this->beginTransaction();

        try {
            $chat = $this->createChatIfNotExist($request->tripReference);

            $senderId = Headers::getUserId() ?? ($request->userId ?? null);

            if (!isset($request->audio)) {
                $messagesChat = $this->createMessage($senderId, $request->message, $chat->idChatTrip);
            } else {
                $messagesChat = $this->createMessageAudio($request, $chat->idChatTrip, $senderId);
            }

            $this->notify($messagesChat, new ChatTrip($chat), $senderId);
            $this->commit();

            return true;
        } catch (PushException $e) {
            $this->commit();

            return true;
        } catch (Exception $e) {
            $this->rollback();

            (new LogDao())->logException($e);

            return false;
        }
    }

    /**
     * @param string $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function getMessagesByTrip(string $tripReference): array
    {
        $chat = $this->findByTrip($tripReference);

        if (!$chat) {
            $chat = $this->init($tripReference);
        }
            
        return (new MessagesChatTripDao)->getMessages($chat->idChatTrip);
    }

    /**
     * @param $userId
     * @param $message
     * @param $idChatTrip
     * @return MessagesChatTrip
     * @throws Exception
     */
    private function createMessage($userId, $message, $idChatTrip): MessagesChatTrip
    {
        $messagesChat = new MessagesChatTrip;
        $messagesChat->setUserId($userId);
        $messagesChat->setMessage($message);
        $messagesChat->setChatTripId($idChatTrip);
        $messagesChat->setDate(now());

        (new MessagesChatTripDao)->sqlInsert($messagesChat);

        return $messagesChat;
    }

    /**
     * @param stdClass $request
     * @param int $idChatTrip
     * @param int|null $userId
     * @return MessagesChatTrip
     * @throws Exception
     */
    private function createMessageAudio(stdClass $request, int $idChatTrip, ?int $userId = null): MessagesChatTrip
    {
        $audio = new Audio();

        $messagesChat = new MessagesChatTrip;
        $messagesChat->setUserId($userId ?? $request->userId);
        $messagesChat->setMessage($audio
            ->save(
                $request->audio,
                ChatMessageAudioConst::S3_DIR . $request->tripReference . "/",
                $userId ?? $request->userId
            ));
        $messagesChat->setChatTripId($idChatTrip);
        $messagesChat->setIsAudio(true);
        $messagesChat->setDate(now());

        (new MessagesChatTripDao)->sqlInsert($messagesChat);

        return $messagesChat;
    }

    /**
     * @param MessagesChatTrip $messagesChatTrip
     * @param ChatTrip $chatTrip
     * @param int|null $senderId Autor da mensagem já resolvido em sendMessage()
     *        (Headers::getUserId() com fallback pro userId do payload em jobs CLI)
     * @throws PushException
     * @throws Exception
     */
    private function notify(MessagesChatTrip $messagesChatTrip, ChatTrip $chatTrip, ?int $senderId = null): void
    {
        $sessionUserId = (int) ($senderId ?? Headers::getUserId());

        if ($sessionUserId == $chatTrip->getUserId()) {
            $driver = (new DriverDao())->find($chatTrip->getDriverId(), false);
            $targetUser = (new UserDao)->find($driver->userId);
        } else {
            $targetUser = (new UserDao)->find($chatTrip->getUserId());
        }

        $this->triggerMessageRealtime($messagesChatTrip, $chatTrip);

        $messagesChatTrip->setMessage(
            $messagesChatTrip->getIsAudio() ?
                ChatMessageAudioConst::PUSH_MESSAGE :
                $messagesChatTrip->getMessage()
        );
        $messagesChat = $messagesChatTrip->toStdClass();
        $messagesChat->tripReference = $chatTrip->getTripReference();

        if (
            $messagesChatTrip->getMessage() != ChatCallConst::CUSTOMER_CALL_CUSTOMER &&
            $messagesChatTrip->getMessage() != ChatCallConst::DRIVER_CALL_CUSTOMER
        ) {

            if ($targetUser->deviceToken) {
                $this->triggerPush(new User($targetUser), $messagesChatTrip);
            }
            // $this->triggerEvent($messagesChat, $chatTrip->getTripReference());
        }
    }

    /**
     * @param \app\model\User $user
     * @param MessagesChatTrip $messagesChatTrip
     * @return mixed
     * @throws PushException
     */
    private function triggerPush(User $user, MessagesChatTrip $messagesChatTrip)
    {
        $whoSent = (new UserDao)->find($messagesChatTrip->getUserId());

        $push = new Push;
        $push
            ->setDeviceToken($user->getDeviceToken())
            ->setTitle(($whoSent->nickname ?? $whoSent->name) . " lhe enviou uma mensagem")
            ->setBody($messagesChatTrip->getMessage())
            ->setAction(PushActionConst::OPEN_APP)
            ->setPriority(PushConst::FORCE_START)
            ->setTag(PushTagConst::CHAT_MESSAGE);
        
        if ($user->getPlatform() == PlatformConst::IOS) {
            return $push->sendNotification();
        } else {
            return $push->sendNotificationWithData();
        }

    }

    private function triggerChatRealtime(ChatTrip $chat)
    {
        $chatRealtime = new ChatTripRealtime;
        $chatRealtime
            ->setDocumentId($chat->getIdChatTrip())
            ->setTripReference($chat->getTripReference())
            ->setUserId($chat->getUserId())
            ->setDriverId($chat->getDriverId())
            ->setDate(new DateTime($chat->getDate()))
            ->save();
    }

    private function triggerMessageRealtime(MessagesChatTrip $messagesChatTrip, ChatTrip $chatTrip)
    {
        $driver = (new DriverDao)->findSimple($chatTrip->getDriverId());

        $messageRealtime = new MessagesChatTripRealtime;
        $messageRealtime
            ->setDocumentId($messagesChatTrip->getIdMessagesChatTrip())
            ->setMessage($messagesChatTrip->getMessage())
            ->setIsAudio((bool)$messagesChatTrip->getIsAudio())
            ->setTripReference($chatTrip->getTripReference())
            ->setDate(new DateTime)
            ->setChatTripId((int)$messagesChatTrip->getChatTripId())
            ->setUserId((int)$messagesChatTrip->getUserId())
            ->setCustomerUserId((int)$chatTrip->getUserId())
            ->setDriverUserId((int)$driver->userId)
            ->setUserWhoReceivedId((int)
            $messagesChatTrip->getUserId() == $chatTrip->getUserId() ?
                $driver->userId : $chatTrip->getUserId())
            ->save();
    }
}
