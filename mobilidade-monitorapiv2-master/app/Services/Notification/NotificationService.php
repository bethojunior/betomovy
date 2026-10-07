<?php

namespace App\Services\Notification;

use App\Jobs\Notification\NotificationMessage;
use App\Models\Notification\Notification;
use App\Models\User\User;
use App\Repositories\Notification\NotificationRepository;
use App\Utils\Push;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class NotificationService
{
    private $push;
    private $repository;
    private const MAX_DEVICE_TOKENS_PUSH_BY_ROUND = 500;

    public function __construct(NotificationRepository $repository)
    {
        $this->push = new Push();
        $this->repository = $repository;
    }

    public function findAll(array $data)
    {
        return $this->repository->findAll($data, (Auth::user())->role);
    }

    public function insert(array $request)
    {
        $page = 0;
        $result = ['success' => 0, 'failure' => 0];

        if (isset($request['image'])) {
            $path = Storage::cloud()
                ->putFile('notification', $request['image'], 'public');

            $request['image'] = $path ?? null;
            $linkPicture = $request['image'] ?
                Storage::cloud()->url($request['image']) : null;
        }

        do {
            $users = User::whereNotNull('deviceToken')
                ->when(isset($request['user_type']), function (Builder $query) use ($request) {
                    $query->where('type', $request['user_type']);
                })
                ->where('idUser', $request['usersId'][0])
                ->limit(self::MAX_DEVICE_TOKENS_PUSH_BY_ROUND)
                ->offset($page * self::MAX_DEVICE_TOKENS_PUSH_BY_ROUND)
                ->pluck('deviceToken')
                ->toArray();

            if (empty($users)) {
                break;
            }

            $this->push->prepareDeviceTokens($users);
            $this->push->preparePush($request, $linkPicture ?? null);

            foreach ($users as $deviceTokens) {
                $resultPushs = $this->push->sendNotificationOneByOne($deviceTokens);

                foreach ($resultPushs as $resultPush) {
                    $result['success'] += $resultPush['isSuccess'] ? 1 : 0;
                    $result['failure'] += $resultPush['isFailure'] ? 1 : 0;
                }
            }

            $page++;
        } while (count($users) === self::MAX_DEVICE_TOKENS_PUSH_BY_ROUND);

        return $result;
    }

    public function store(array $data)
    {
        if (isset($data['image'])) {
            $path = Storage::cloud()->putFile('notification', $data['image'], 'public');
            $data['image'] = $path ?? null;
        }

        dispatch(new NotificationMessage($data))->afterResponse();
    }

    public function delete(Notification $notification)
    {
        return $notification->update(['statusId' => 2]);
    }
}
