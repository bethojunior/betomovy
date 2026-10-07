<?php

namespace App\Jobs\Notification;

use App\Constants\Notification\NotificationTypeConst;
use App\Constants\Push\PushActionConst;
use App\Constants\Push\PushConst;
use App\Constants\StatusConst;
use App\Constants\Users\UserTypeConst;
use App\Models\Notification\Notification;
use App\Models\Notification\NotificationUser;
use App\Models\Notification\NotificationUserType;
use App\Repositories\User\UserRepository;
use App\Utils\Push;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class NotificationMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var array
     */
    protected $data;

    /**
     * @param Push $push
     */
    protected $push;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return array
     */
    private const MAX_DEVICE_TOKENS_PUSH_BY_ROUND = 500;

    public function handle(Push $push)
    {
        $this->push = $push;
    
        DB::beginTransaction();
    
        try {
            
            $city = null;

            if(isset($this->data['cityId']) && !empty($this->data['cityId'])) {
                $city = $this->data['cityId'];
            } 

            $notification = new Notification();
            $notification->title = $this->data['title'];
            $notification->message = $this->data['message'];
            $notification->link = $this->data['link'] ?? null;
            $notification->notificationTypeId = NotificationTypeConst::PUSH;
            $notification->userTypeId = UserTypeConst::ADMIN;
            $notification->statusId = StatusConst::ACTIVE;
            $notification->cityId = $city;
            $notification->date = Carbon::now();
            $notification->identifyUserInLink = $this->data['identifyUserInLink'] ?? false;
            $notification->image = $this->data['image'] ?? null;
            $notification->save();

            if (isset($this->data['userTypes'])) {
                $notificationUserTypes = [];
                $userTypes = $this->data['userTypes'];

                foreach ($userTypes as $userType) {
                    $notificationUserTypes[] = [
                        'userTypeId' => $userType,
                        'notificationId' => $notification->idNotification,
                        'created_at' => Carbon::now()
                    ];
                }
    
                NotificationUserType::insert($notificationUserTypes);
            }

            DB::commit();
    
            $page = 0;
            $result = ['success' => 0, 'failure' => 0];
            $linkPicture = $notification->image ? Storage::cloud()->url($notification->image) : null;
    
            do {
                $users = (new UserRepository())->getUsersForSendNotificationPaginated(
                    explode(',', $city),
                    $this->data['userTypes'] ?? null,
                    $page,
                );

                if ($users->isEmpty()) {
                    break;
                }
    
                $notificationUsers = [];
                foreach ($users as $user) {
                    $notificationUsers[] = [
                        'userId' => $user->idUser,
                        'notificationId' => $notification->idNotification,
                        'created_at' => Carbon::now()
                    ];
                }
    
                NotificationUser::insert($notificationUsers);
    
                $deviceTokens = $users->pluck('deviceToken')->toArray();
    
                $this->push->prepareDeviceTokens($deviceTokens);
                $this->push->preparePush($this->data, $linkPicture ?? null);
                $this->push->setImage($linkPicture ?? null);
                $this->push->setData($notification);
                $this->push->setAction(PushActionConst::NEW_NOTIFICATION);
                $this->push->setPriority(PushConst::HIGH_PRIORITY);
    
                foreach ($deviceTokens as $deviceToken) {
                    $idTokens = array_unique($deviceToken);
                    $resultPushs = $this->push->sendNotificationOneByOne($idTokens);
    
                    foreach ($resultPushs as $resultPush) {
                        $result['success'] += $resultPush['isSuccess'] ? 1 : 0;
                        $result['failure'] += $resultPush['isFailure'] ? 1 : 0;
                    }
                }
    
                $page++;
            } while (count($users) === self::MAX_DEVICE_TOKENS_PUSH_BY_ROUND);
    
            return ['notification' => $notification, 'result' => $result];
        } catch (\Exception $e) {
            Log::error('Error in NotificationMessage job: ' . $e->getMessage());
            Log::error('File: ' . $e->getFile());
            Log::error('Line: ' . $e->getLine());
    
            DB::rollBack();
            throw $e;
        }
    }
    
}
