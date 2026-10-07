<?php

namespace App\Services\Config;

use App\Models\Config\SmtpServer;
use App\Notifications\ValidateSmtpNotification;
use App\Repositories\Config\SMTPServerRepository;
use Illuminate\Support\Facades\Notification;


class SMTPServerService
{
    private $repository;

    public function __construct(SMTPServerRepository $repository)
    {
        $this->repository = $repository;
    }

    public function create(array $request)
    {
//        $this->repository->disableSMTPServer();
        $smtpServer = new SmtpServer($request);
        $smtpServer->save();

        return $smtpServer;
    }

    public function findAllActive()
    {
        return $this->repository->findAllActive();
    }

    public function disable()
    {
        $this->repository->disableSMTPServer();
    }

    public function removeSmtpServer(int $id)
    {
        $this->repository->removeSmtpServer($id);
    }

    public function find(int $id)
    {
        return $this->repository->find($id);
    }

    public function validateSmtp(array $request)
    {
        $smtpActive = (new SMTPServerRepository())->findActive();
        $configSmtp = [];
        if(!$smtpActive){
            throw new \Exception("config smtp not found");
        }
        $configSmtp = array(
            'transport' => 'smtp',
            'host' => $smtpActive->host,
            'port' => $smtpActive->port,
            'encryption' => $smtpActive->encryption,
            'username' => $smtpActive->username,
            'password' => $smtpActive->password,
            'timeout' => null,
        );


        // dd($configSmtp,$request['email']);

        Notification::route('mail', $request['email'])->notify(new ValidateSmtpNotification($configSmtp));
    }

    public function updateSmtpServer(int $id, array $request)
    {
        $this->repository->updateSmtpServer($id, $request);
    }
}
