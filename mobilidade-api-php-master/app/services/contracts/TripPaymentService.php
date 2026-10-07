<?php

namespace app\services\contracts;

use app\constant\CompanyBalanceConst;
use app\constant\CompanyRegisterStatusConst;
use app\constant\CustomerBalanceConst;
use app\constant\PaymentFormTypeConst;
use app\constant\TransactionConst;
use app\constant\TripTypeConst;
use app\dao\BalanceDao;
use app\dao\CentralDao;
use app\dao\CompanyWorkerDao;
use app\dao\CustomerBalanceDao;
use app\dao\LogDao;
use app\dao\TransactionDao;
use app\dao\TripPaymentFormDao;
use app\dao\TripPixPaymentsDao;
use app\exceptions\CardException;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\TransactionException;
use app\exceptions\TripPaymentException;
use app\services\DiscountCancellationCustomerFeeService;
use app\services\TripCardPaymentService;
use app\validator\CheckoutCardValidator;
use app\model\Config;
use app\model\Status;
use app\model\Transaction;
use app\model\Trip;
use app\model\TripCancellationCustomerFee;
use app\model\TripCardPayment;
use app\model\TripPixPayments;
use app\services\CheckoutService;
use app\services\TransactionService;
use app\utils\Logger;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/05/2019
 * Time: 10:13
 */
abstract class TripPaymentService
{
    protected $tripCardPaymentService;
    protected $responseValidator;
    protected $discountCancellationCustomerFeeService;
    private $tripPaymentFormDao;
    private $companyWorkerDao;
    private $centralDao;

    public function __construct()
    {
        $this->tripCardPaymentService = new TripCardPaymentService;
        $this->responseValidator = new CheckoutCardValidator;
        $this->discountCancellationCustomerFeeService = new DiscountCancellationCustomerFeeService;
        $this->tripPaymentFormDao = new TripPaymentFormDao;
        $this->companyWorkerDao = new CompanyWorkerDao;
        $this->centralDao = new CentralDao();
    }

    /**
     * @param $customer
     * @param Trip $trip
     * @param null $cardId
     * Token do mercado pago para autorização caso seja cartão de crédito
     * @param null $mpToken
     * @param bool $isOpenPriceTrip
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     * @throws TripPaymentException
     * @throws Exception
     */
    public function tripPayment(&$customer, Trip $trip, $cardId = null, $mpToken = null, $isOpenPriceTrip = false, $idTransaction = null): void
    {
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($trip->getTripPaymentFormId());

        if ($tripPaymentForm->statusId == Status::EXCLUIDO)
            throw new Exception("Forma de pagamento está desabilitada, tenta outra forma");

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
                $this->validatePaymentInOpenPriceTrip($isOpenPriceTrip);
                $this->voucherPayment($customer, $trip);
                break;
            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $this->validatePaymentInOpenPriceTrip($isOpenPriceTrip);
                $this->voucherAdministrativePayment($trip);
                break;
            case PaymentFormTypeConst::CREDIT_CARD:
            case PaymentFormTypeConst::DEBIT_CARD:
                $this->validatePaymentInOpenPriceTrip($isOpenPriceTrip);
                $this->cardPayment($cardId, $trip, $mpToken, $tripPaymentForm->paymentFormTypeId);
                break;
            case PaymentFormTypeConst::PIX:
                $this->verifyPayment($idTransaction, $trip->getTripReference());
                break;
        }
    }

    private function verifyPayment($idTransaction, $tripReference)
    {
        if(!$idTransaction) throw new Exception("ID da transação é obrigatório");
        $transactionService = new TransactionService();

        $transaction = $transactionService->find($idTransaction);

        if($transaction && $transaction->getTransactionStatusId() != TransactionConst::COMPLETED) {
            throw new Exception("Não foi possível validar pagamento.");
        }

        $tripPixPayment = new TripPixPayments();
        $tripPixPaymentDao = new TripPixPaymentsDao();
        $tripPixPayment
            ->setTripReference($tripReference)
            ->setIdTransaction($transaction->getIdTransaction());

        $tripPixPaymentDao->insertTripPixPayment($tripPixPayment);
    }

    /**
     * @param $trip
     * @param $balanceId
     * @param $cancelFee
     * @return array|mixed
     * @throws TripPaymentException
     * @throws Exception
     */
    public function tripPaymentOnCancel(Trip $trip, $balanceId, ?TripCancellationCustomerFee $cancelFee = null)
    {
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($trip->getTripPaymentFormId());

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
                return $this->cancelPaymentByVoucher($trip, $balanceId, $cancelFee);

            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $worker = $this->companyWorkerDao
                    ->findWithCompany($trip->getUserId());

                return $this->cancelPaymentByVoucher(
                    $trip, $worker->balanceId, $cancelFee, true);

            case PaymentFormTypeConst::VOUCHER_CENTRAL:
                $central = $this->centralDao
                    ->find($trip->getUserId());

                return $this->cancelPaymentByVoucher(
                    $trip, $central->balanceId, $cancelFee);

            case PaymentFormTypeConst::DEBIT_CARD:
            case PaymentFormTypeConst::CREDIT_CARD:
                return $this->cancelPaymentByCardPayment(
                    $trip, $tripPaymentForm->paymentFormTypeId, $cancelFee);
            case PaymentFormTypeConst::PIX:
                $this->cancelPaymentByPix($trip->getTripReference());
                break;
        }

        return null;
    }

    /**
     * @throws TripPaymentException
     * @throws TransactionException
     */
    public function tripPaymentOnFinish(Trip $trip): void
    {
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($trip->getTripPaymentFormId());

        if ((int)$tripPaymentForm->paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
            $this->tripCardPaymentService
                ->finishPayment($trip);
        }
    }

    /**
     * @param Trip $trip
     * @throws Exception
     */
    protected function voucherAdministrativePayment(Trip $trip)
    {
        $worker = $this->companyWorkerDao
            ->findWithCompany($trip->getUserId());

        if (!$worker)
            throw new Exception("Esse tipo de pagamento não está habilitado para você");

        if ((int)$worker->companyRegisterStatusId !== CompanyRegisterStatusConst::ACTIVE)
            throw new Exception("O status dessa empresa não permite novas viagens");

        if ($worker->tripBalance < $trip->getPrice())
            throw new Exception("Empresa não possui saldo suficiente");

        $worker->balance = (new BalanceDao)
            ->subBalanceForNewTrip(
                $worker->balanceId, $trip, CompanyBalanceConst::TRIP_BALANCE_OUT);
//
//        $customer = $worker;
    }

    /**
     * @param $customer
     * @param Trip $trip
     * @throws Exception
     */
    protected function voucherPayment(&$customer, Trip $trip)
    {
        if ($customer->tripBalance < $trip->getPrice())
            throw new Exception("Cliente não possui saldo suficiente");

        $customer->balance = (new BalanceDao)
            ->subBalanceForNewTrip(
                $customer->balanceId, $trip, CustomerBalanceConst::TRIP_BALANCE_LOCKOUT);
    }

    /**
     * @param $cardId
     * @param Trip $trip
     * @param $mpToken
     * @param int $paymentFormTypeId
     * @return array
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     * @throws TripPaymentException
     * @throws Exception
     */
    protected function cardPayment($cardId, Trip $trip, $mpToken, int $paymentFormTypeId)
    {
        if (!$cardId) {
            throw new TripPaymentException(251);
        }

        $description = $this->mountDescription($trip);

        $payment = $this->tripCardPaymentService
            ->initPayment($trip, $cardId, $description, $mpToken, $paymentFormTypeId);

        $this->throwRejectedPayment($payment, $description);

        return $payment->toArray();
    }

    /**
     * @param Trip $trip
     * @return string
     */
    private function mountDescription(Trip $trip)
    {
        $appName = Config::get('app_title');

        return "VIAGEM " .
            ($appName ??
                (TripTypeConst::typeName($trip->getTripTypeId()) ?? "")) .
            " - " . $trip->getTripReference();
    }

    /**
     * @param \app\model\Trip $trip
     * @param $balanceId
     * @param \app\model\TripCancellationCustomerFee|null $cancelFee
     * @param bool $administrative
     * @return array|mixed
     * @throws Exception
     */
    protected function cancelPaymentByVoucher(Trip                         $trip, $balanceId,
                                              ?TripCancellationCustomerFee $cancelFee = null, bool $administrative = false)
    {
        return (new CustomerBalanceDao)
            ->manageBalanceOnCancel($trip, $balanceId, $cancelFee, $administrative);
    }

    /**
     * @param \app\model\Trip $trip
     * @param int $tripPaymentFormTypeId
     * @param null|\app\model\TripCancellationCustomerFee $cancellationCustomerFee
     * @return \app\model\TripCardPayment
     * @throws TransactionException
     * @throws TripPaymentException
     * @throws CardException
     */
    protected function cancelPaymentByCardPayment(Trip                         $trip,
                                                  int                          $tripPaymentFormTypeId,
                                                  ?TripCancellationCustomerFee $cancellationCustomerFee = null)
    {
        try {
            $tripCardPayment = $this->tripCardPaymentService->cancelPayment($trip);
        } catch (\Exception $e) {
            (new LogDao)->logException($e);
            return null;
        }

        //IMPLEMENTAÇÃO PARA TAXA DE CANCELAMENTO
        if ($cancellationCustomerFee)
            $this->discountCancellationCustomerFeeService
                ->discountByCreditCard(
                    $cancellationCustomerFee, $tripCardPayment->getCardId(), $trip, $tripPaymentFormTypeId);

        return $tripCardPayment;
    }

    public function cancelPaymentByPix($tripReference)
    {
        $tripPixPaymentDao = new TripPixPaymentsDao();
        $transaction = $tripPixPaymentDao->getTransactionByTrip($tripReference);

        if(!$transaction) {
            throw new Exception("Transação não encontrada para a viagem: " . $tripReference);
        }

        try {
            $amountInCents = (int) round((float) $transaction->value * 100);
            $checkoutService = new CheckoutService();
            $checkoutService->refundPayment(new Transaction($transaction), null, $amountInCents);
        } catch (\Exception $e) {
            (new LogDao)->logException($e);
        }
    }

    /**
     * @param $status
     * @param $statusDetailed
     * @param string|null $description
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    protected function throwRejectedPayment(TripCardPayment $payment, ?string $description = null): void
    {
        $this->responseValidator->validateTransactionResponse(
            $payment->getStatus(),
            $payment->getStatusDetail(),
            $description,
            $payment->getIntermediaryId()
        );
    }

    /**
     * @param bool $isOpenPrice
     * @throws Exception
     */
    private function validatePaymentInOpenPriceTrip(bool $isOpenPrice)
    {
        if ($isOpenPrice)
            throw new Exception("Forma de pagamento não permite viagens com preço em aberto");
    }
}