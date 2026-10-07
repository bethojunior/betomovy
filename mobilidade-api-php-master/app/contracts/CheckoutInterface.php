<?php

namespace app\contracts;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/08/2019
 * Time: 10:54
 */
interface CheckoutInterface
{
    public function __get($name);

    public function creditPayment();

    public function debitPayment();
    
    public function reserveAmount();

    public function captureAmount($paymentId, $amount = null);

    public function refundCreditPayment($paymentId, $amount = null);

    public function refundDebitPayment($paymentId, $amount = null);

    public function findPayment($paymentId);

    public function setParameters(array $data): CheckoutInterface;

    public function insertCustomer($email, array $options = []);

    public function insertCard($customerId, $data, $token = null);

    public function searchPayment(array $params);

    public function splitPayment($paymentId);

    public function hasSplit(): bool;

    public function refundPixPayment(string $paymentId, $amount = null);

    public function pixPayment(array $data);

    public function findPaymentPix(string $paymentId);
}