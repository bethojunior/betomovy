<?php

namespace App\Repositories\Config;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\SmtpServer;

class SMTPServerRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(SmtpServer::class);
    }

    public function disableSMTPServer()
    {
        $this->getModel()
            ::where("statusId",  StatusConst::ACTIVE)
            ->update(["statusId"=> StatusConst::REMOVED]);
    }


    public function findAllActive()
    {
        return $this->getModel()
            ::where("statusId",  StatusConst::ACTIVE)
            ->get();
    }

    public function findActive()
    {
        return $this->getModel()
            ::where("statusId",  StatusConst::ACTIVE)
            ->first();
    }


    public function removeSmtpServer(int $id)
    {
        $this->getModel()
            ::where("statusId",  StatusConst::ACTIVE)
            ->where("id", $id)
            ->update(["statusId"=> StatusConst::REMOVED]);
    }

    public function updateSmtpServer(int $id, array $request)
    {
        $this->getModel()
            ::where("statusId",  StatusConst::ACTIVE)
            ->where("id", $id)
            ->update([
                "mailer" => $request["mailer"],
                "fromMailer" => $request["fromMailer"],
                "fromName" => $request["fromName"],
                "username" => $request["username"],
                "password" => $request["password"],
                "host" => $request["host"],
                "port" => $request["port"],
                "encryption" => $request["encryption"],
            ]);
    }
}
