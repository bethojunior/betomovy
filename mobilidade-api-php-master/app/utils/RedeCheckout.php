<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;
use Exception;
use Rede\eRede;
use Rede\Store;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/03/2020
 * Time: 16:05
 */
class RedeCheckout implements CheckoutInterface
{

    /**
     * @var Store
     */
    private $store;

    private $financialIntermediaryId = FinancialIntermediaryConst::REDE;

    private $sale_id;

    private $value;
    private $description;
    private $card;

    public function __construct(string $pv, string $token)
    {
        $environment = env('ENV') == 'production' ?
            \Rede\Environment::production() : \Rede\Environment::sandbox();

        $this->store = new Store($pv, $token, $environment);
    }

    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? null;
    }

    public function creditPayment()
    {
        $value = round($this->value, 2);

        $transaction = (new \Rede\Transaction($value, 'sale' . time()))->creditCard(
            $this->card['number'],
            $this->card['cvv'],
            abs($this->card['expirationMonth']),
            substr($this->card['expirationYear'], -2, 2),
            $this->card['cardholderName']
        );
//        ->setSoftDescriptor(strtoupper(substr($this->description, 0, 13)));

        try {
            $transaction = (new eRede($this->store))
                ->create($transaction);
        } catch (Exception $e) {
            return array_replace_recursive(
                $transaction->jsonSerialize(),
                [
                    'status_code' => $transaction->getReturnCode(),
                    'return_message' => $transaction->getReturnMessage(),
                    'tid' => $transaction->getTid(),
                ]
            );
        }

        return array_replace_recursive(
            $transaction->jsonSerialize(),
            [
                'status_code' => $transaction->getReturnCode(),
                'return_message' => $transaction->getReturnMessage(),
                'tid' => $transaction->getTid(),
            ]
        );
    }

    /**
     * @throws CheckoutServiceException
     */
    public function debitPayment()
    {
        throw new CheckoutServiceException(154);
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        $value = round((float)$amount, 2);

        try {
            $transaction = (new eRede($this->store))
                ->cancel((new \Rede\Transaction($value))
                    ->setTid($paymentId));
        } catch (Exception $e) {
            $transaction = null;
        }

        return $this->findPayment($paymentId);
    }

    /**
     * @param $paymentId
     * @param null $amount
     * @throws CheckoutServiceException
     */
    public function refundDebitPayment($paymentId, $amount = null)
    {
        throw new CheckoutServiceException(154);
    }

    public function findPayment($paymentId)
    {
        $transaction = (new eRede($this->store))
            ->get($paymentId);

        $authorization = $transaction->getAuthorization();

        return [
            'kind' => $authorization->getAuthorizationCode(),
            'reference' => $authorization->getReference(),
            'amount' => $authorization->getAmount(),
            'cardHolderName' => $authorization->getCardHolderName(),
            'cardBin' => $authorization->getCardBin(),
            'authorizationCode' => $authorization->getAuthorizationCode(),
            'nsu' => $authorization->getNsu(),
            'status_code' => $authorization->getReturnCode(),
            'return_message' => $transaction->getReturnMessage() ?? $authorization->getStatus(),
            'tid' => $authorization->getTid(),
        ];
    }

    public function setParameters(array $data): CheckoutInterface
    {
        // TODO: Implement setParameters() method.
        foreach ($data as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }

        return $this;
    }

    public function insertCustomer($email, array $options = [])
    {
        // TODO: Implement insertCustomer() method.
    }

    public function insertCard($customerId, $data, $token = null)
    {
        // TODO: Implement insertCard() method.
    }

    public function searchPayment(array $params)
    {
        // TODO: Implement searchPayment() method.
    }

    public function captureAmount($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }

    public function reserveAmount()
    {
        // TODO: Implement reserveAmount() method.
    }

    public function hasSplit(): bool
    {
        return false;
    }

    public function splitPayment($paymentId)
    {
        throw new CheckoutServiceException(157);
    }

    public function refundPixPayment($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }
}