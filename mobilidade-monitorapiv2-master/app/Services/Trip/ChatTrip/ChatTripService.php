<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 19:35
 */

namespace App\Services\Trip\ChatTrip;


use App\Models\Trip\ChatTrip\ChatTrip;
use App\Models\Trip\ChatTrip\MessagesChatTrip;
use App\Models\Trip\Trip;
use App\Models\User\User;
use App\Realtimes\Chat\MessagesChatTrip as RealtimeMessage;
use App\Repositories\Realtime\MessagesChatTripRepository as RealtimeRepository;
use App\Repositories\Trip\ChatTrip\ChatTripRepository;
use App\Repositories\Trip\ChatTrip\MessagesChatTripRepository;
use App\Repositories\Trip\TripRepository;

class ChatTripService
{
    /**
     * @var MessagesChatTripRepository
     */
    private $repository;
    /**
     * @var ChatTripRepository
     */
    private $chatTripRepository;
    /**
     * @var TripRepository
     */
    private $tripRepository;
    /**
     * @var RealtimeRepository
     */
    private $realtimeRepository;

    public function __construct(MessagesChatTripRepository $repository,
                                ChatTripRepository $chatTripRepository,
                                TripRepository $tripRepository,
                                RealtimeRepository $realtimeRepository)
    {
        $this->repository = $repository;
        $this->chatTripRepository = $chatTripRepository;
        $this->tripRepository = $tripRepository;
        $this->realtimeRepository = $realtimeRepository;
    }

    public function sendMessage($request, User $user)
    {
        $chat = $this->createChatIfNotExists(
            $request['tripReference'], $user->idUser);

        $messageChatTrip = new MessagesChatTrip([
            'message' => $request['message'],
            'userId' => $user->idUser
        ]);

        $messageChatTrip
            ->chatTrip()
            ->associate($chat);

        $this->repository
            ->save($messageChatTrip);

        $this->sendRealtime($messageChatTrip);

        return true;
    }

    private function createChatIfNotExists($tripReference, $userId)
    {
        /** @var ChatTrip|null $chat */
        $chat = $this->chatTripRepository
            ->findByTrip($tripReference);

        if (!$chat) {
            /** @var Trip $trip */
            $trip = $this->tripRepository
                ->findByReference($tripReference);

            $chat = $this->chatTripRepository
                ->create([
                    'driverId' => $trip->driverId,
                    'tripReference' => $trip->tripReference,
                    'userId' => $userId,
                ]);
        }

        return $chat;
    }

    private function sendRealtime(MessagesChatTrip $messageChatTrip)
    {
        $realtime = new RealtimeMessage;
        $realtime
            ->setDocumentId($messageChatTrip->idMessagesChatTrip)
            ->setMessage($messageChatTrip->message)
            ->setDate(now())
            ->setIsAudio(false)
            ->setUserId($messageChatTrip->userId)
            ->setIsCentral(true)
            ->setChatTripId($messageChatTrip->chatTripId)
            ->setTripReference($messageChatTrip->chatTrip->tripReference);

        $this->realtimeRepository
            ->setRealtime($realtime)
            ->save();
    }
}
