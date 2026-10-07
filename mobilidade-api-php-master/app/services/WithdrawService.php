<?php

namespace app\services;

use app\dao\BankAccountDao;
use app\model\ExternalServiceMetaData;
use app\utils\Email;
use app\model\Config;
// use app\utils\MiltoServiceEmailApi;
use Exception;
use app\model\User;
use app\model\Withdraw;
use Carbon\Carbon;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/10/2018
 * Time: 12:59
 */
class WithdrawService
{
    /**
     * @param \app\model\User $userObject
     * @param $withdraw
     * @return bool
     * @throws \PHPMailer\PHPMailer\Exception
     * @throws Exception
     */
    public function sendEmailWithdrawRequest(User $userObject, $withdraw)
    {
        $title = $this->getEmailTitle($userObject->getName());
        $subject = $this->getEmailSubject($userObject->getName());
        $message = $this->getEmailMessage($userObject, $withdraw);

        $email = Config::get('email_to_send_request_withdraw');

        return Email::sendMail($email, $subject, $title, $message);
    }

    /**
     * @param $userName
     * @return mixed
     */
    private function getEmailTitle($userName)
    {
        $title = Config::get('withdraw_email_title');
        return str_replace('{nameUser}', $userName, $title);
    }

    /**
     * @param $userName
     * @return mixed
     */
    private function getEmailSubject($userName)
    {
        $subject = Config::get('withdraw_email_subject');
        return str_replace('{nameUser}', $userName, $subject);
    }

    /**
     * @param \app\model\User $userObject
     * @param Withdraw $withdraw
     * @return mixed
     * @throws Exception
     */
    private function getEmailMessage(User $userObject, Withdraw $withdraw)
    {
        $message = Config::get('withdraw_email_message');
        $message = str_replace('{nameUser}', $userObject->getName(), $message);
        $message = str_replace('{email}', $userObject->getEmail(), $message);
        $message = str_replace('{value}', number_format((float)$withdraw->getValue(), 2, ',', '.'), $message);
        $message = str_replace('{datetime}', Carbon::now()->format('d/m/Y H:i'), $message);
        $message = str_replace('{bankAccountString}', $this->mountBankAccountString($userObject->getBankAccountId()), $message);

        return $message;
    }

    /**
     * @param $bankAccountId
     * @return array|mixed
     * @throws Exception
     */
    private function mountBankAccountString($bankAccountId)
    {
        $bankAccountString = (new BankAccountDao)->getBankAccountLikeString($bankAccountId);

        return $bankAccountString;
    }
}