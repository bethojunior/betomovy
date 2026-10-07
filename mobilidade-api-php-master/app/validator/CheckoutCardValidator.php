<?php

namespace app\validator;

use app\dao\UserDao;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\utils\Email;
use app\utils\Headers;
use app\validator\contracts\ICheckoutValidator;
use app\model\Config;
use app\model\FinancialIntermediary;
use app\model\PaymentForm;
use app\services\AcquirerService;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2018
 * Time: 17:18
 */
class CheckoutCardValidator
{
    private $checkoutValidator;

    /**
     * @param $status
     * @param $status_detailed
     * @param null|string $saleDescription
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    public function validateTransactionResponse($status, $status_detailed, ?string $saleDescription = '', int $intermediaryId)
    {
        $this->checkoutValidator = $this->getCheckoutValidator($intermediaryId);

        try {
            $this->checkoutValidator->validateTransactionResponse($status, $status_detailed);
        } catch (CheckoutCardException $e) {
            $user = (new UserDao)->find(Headers::getUserId(), ['email', 'name']);

            $this->notifyAdministrator("
                <p>Ocorreu um problema ao processar pagamento de {$user->name} - {$user->email}</p>
                
                <p>
                    Descrição do pagamento: {$saleDescription}<br>
                    Detalhes do problema: {$e->getMessage()}
                </p>
                
                <p>Detail/Code: {$status_detailed} <br>
                
                <br><br>
                Por favor, verifique essa ocorrência com a sua operadora de cartão
            ");

            throw $e;
        }
    }

    /**
     * @return MPCheckoutValidator|CieloCheckoutValidator|RecebeAquiCheckoutValidator|IuguCheckoutValidator|GetnetCheckoutValidator
     * @throws CheckoutServiceException
     */
    private function getCheckoutValidator(int $intermediaryId): ICheckoutValidator
    {
        switch ($intermediaryId) {
            case 1:
                return new MPCheckoutValidator;
            case 2:
                return new CieloCheckoutValidator;
            case 3:
                return new RecebeAquiCheckoutValidator;
            case 4:
                return new IuguCheckoutValidator;
            case 5:
                return new PagSeguroCheckoutValidator;
            case 6:
                return new GetnetCheckoutValidator;
            case 7:
                return new RedeCheckoutValidator;
            case 8:
                return new ZspayCheckoutValidator;
            case 9:
                return new PaySoonCheckoutValidator;
            case 10:
                return new CotabankCheckoutValidator;
            case 11:
                return new CotabankCheckoutValidator;
            case 13:
                return new CheckoutValidator704Pay;
            case 14:
                return new CheckoutValidatorEpag;
            case 15:
                return new YumePayCheckoutValidator;
            case 16:
                return new CheckoutValidatorFirebanking;
            default:
                throw new CheckoutServiceException(151);
        }
    }

    private function notifyAdministrator(string $message)
    {
        $email = Config::get('email_to_send_request_withdraw');

        $emailService = new Email('default');
        $emailService
            ->addValue('title', 'OCORRÊNCIA NO RECEBIMENTO COM CARTÃO DE CRÉDITO')
            ->addValue('message', $message);

        return $emailService
            ->send($email, 'OCORRÊNCIA NO RECEBIMENTO COM CARTÃO DE CRÉDITO');
    }

}