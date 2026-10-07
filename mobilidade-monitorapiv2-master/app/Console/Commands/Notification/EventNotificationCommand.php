<?php
namespace App\Console\Commands\Notification;

use App\Constants\Notification\EventNotificationConst;
use App\Constants\Push\PushActionConst;
use App\Constants\Push\PushConst;
use App\Repositories\Notification\EventNotificationRepository;
use App\Repositories\User\UserRepository;
use App\Utils\Push;
use Illuminate\Console\Command;

class EventNotificationCommand extends Command
{
    protected $signature = "event-notification:trigger";

    protected $description = 'Dispara notificações de eventos';

    protected $userRepository;
    protected $eventNotificationRepository;

    public function __construct(
        UserRepository              $userRepository,
        EventNotificationRepository $eventNotificationRepository
    )
    {
        parent::__construct();
        $this->userRepository = $userRepository;
        $this->eventNotificationRepository = $eventNotificationRepository;
    }

    public function handle()
    {
        $dateOfBirthDate = $this->eventNotificationRepository->findByEventType(EventNotificationConst::DATE_OF_BIRTH);
        $dateOfRegister = $this->eventNotificationRepository->findByEventType(EventNotificationConst::DATE_OF_REGISTER);

        if($dateOfBirthDate){
            $tokens = $this->userRepository->findByDateOfBirthOfToday();
            $this->sendNotification($dateOfBirthDate, $tokens->toArray());
        }

        if($dateOfRegister){
            $tokens = $this->userRepository->findByDateRegisterOfToday();
            $this->sendNotification($dateOfRegister, $tokens->toArray());
        }

        return 0;
    }

    private function sendNotification($data,$tokens)
    {
        $tokens = array_map(function($token){
            return $token['deviceToken'];
        }, $tokens);

        $push = new Push;
        $push
            ->setTitle($data->title)
            ->setBody($data->description)
            ->setAction(PushActionConst::NEW_NOTIFICATION)
            ->setPriority(PushConst::HIGH_PRIORITY);

        $push->sendNotification($tokens);
    }
}
