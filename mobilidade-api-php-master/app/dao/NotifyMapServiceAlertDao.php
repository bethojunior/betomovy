<?php


namespace app\dao;

use app\utils\BaseDao;
use app\model\NotifyMapServiceAlert;

class NotifyMapServiceAlertDao extends BaseDao
{

    protected $table = 'notifyMapServiceAlert';


    public function insert($message, $type, $service, $token)
    {
        $notifyMapServiceAlert = new NotifyMapServiceAlert;

        $notifyMapServiceAlert->setCreatedAt(now());
        $notifyMapServiceAlert->setMessage($message);
        $notifyMapServiceAlert->setType($type);
        $notifyMapServiceAlert->setService($service);
        $notifyMapServiceAlert->setToken($token);
        $notifyMapServiceAlert->setId($this->sqlInsert($notifyMapServiceAlert));

        return $notifyMapServiceAlert;
    }

    public function alreadyNotified($type, $service, $token)
    {
        return $this->sqlRawSelect(
            "select *
                    from notifyMapServiceAlert
                    where DATE_FORMAT(created_at, '%Y-%m-%d') =  DATE_FORMAT(:today, '%Y-%m-%d')
                      and type = :type
                      and service = :service
                      and token = :token",
            [
                ":type" => $type,
                ":service" => $service,
                ":today" => now(),
                ":token" => $token
            ])
            ->get(false);
    }
}