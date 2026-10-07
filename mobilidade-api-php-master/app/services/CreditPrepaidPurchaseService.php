<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\constant\TransactionConst;
use app\constant\TransactionTypeConst;
use app\dao\BalanceFlowDao;
use app\dao\CreditPrepaidDao;
use app\dao\CreditPrepaidPurchaseDao;
use app\dao\DriverBalanceDao;
use app\dao\LogDao;
use app\dao\UserDao;
use app\exceptions\CardException;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\TripPaymentException;
use app\utils\Connection;
use app\utils\Headers;
use app\validator\CheckoutCardValidator;
use app\validator\CreditPrepaidPurchaseValidator;
use app\model\Config;
use app\model\CreditPrepaidPurchase;
use Exception;
use app\model\PaymentForm;
use PDO;
use app\model\Transaction;
use Carbon\Carbon;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 13:51
 */
class CreditPrepaidPurchaseService
{
    /**
     * @var CreditPrepaidPurchaseValidator
     */
    private $validator;
    /**
     * @var CreditPrepaidPurchaseDao
     */
    private $dao;
    /**
     * @var CreditPrepaidDao
     */
    private $creditPrepaidDao;
    /**
     * @var \app\dao\UserDao
     */
    private $userDao;
    /**
     * @var \app\dao\CreditPrepaidPurchaseDao
     */
    private $creditPrepaidPurchaseDao;
    /**
     * @var CheckoutService
     */
    private $checkoutService;
    /**
     * @var \app\model\Transaction
     */
    private $transaction;
    /**
     * @var CheckoutCardValidator
     */
    private $responseValidator;
    /**
     * @var string
     */
    private $saleDescription;
    /**
     * @var \MongoDB\Driver\Manager|PDO
     */
    private $conn;

    private CreditPrepaidPurchase $creditPrepaidPurchase;
    private TransactionService $transactionService;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->dao = new CreditPrepaidPurchaseDao;
        $this->validator = new CreditPrepaidPurchaseValidator;
        $this->creditPrepaidDao = new CreditPrepaidDao;
        $this->checkoutService = new CheckoutService;
        $this->responseValidator = new CheckoutCardValidator;
        $this->userDao = new UserDao;
        $this->transactionService = new TransactionService;
        $this->creditPrepaidPurchaseDao = new CreditPrepaidPurchaseDao;

        $this->saleDescription = (Config::get('app_title') ?? '') . ' - COMPRA DE CRÉDITO PRÉ-PAGO';
    }

    public function getCreditPrepaidPurchase($creditPrepaidPurchaseId)
    {
        return $this->dao->findByField('id', $creditPrepaidPurchaseId);
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function purchase($request)
    {
        $this->validator->validatePurchase($request);

        $creditPrepaid = $this->creditPrepaidDao->find($request->creditPrepaidId);

        $existCreditPrepaidPurchaseByUser = $this->dao->findByUser(Headers::getUserId());

        $expirationDate = null;

        if ($creditPrepaid->type === 'perPeriod') {
            if ($existCreditPrepaidPurchaseByUser) {
                $expirationDate = date('Y-m-d', strtotime('+' . $creditPrepaid->quantityDaysPurchased . ' days',
                    strtotime($existCreditPrepaidPurchaseByUser->expirationDate)));
            } else {
                $expirationDate = date('Y-m-d', strtotime('+' . $creditPrepaid->quantityDaysPurchased . ' days'));
            }
        }

        $creditPrepaidPurchase = new CreditPrepaidPurchase;
        $creditPrepaidPurchase
            ->setUserId(Headers::getUserId())
            ->setValue($creditPrepaid->sellPrice)
            ->setAmount($creditPrepaid->purchasePrice)
            ->setCreditPrepaidId($request->creditPrepaidId)
            ->setExpirationDate($expirationDate);

        $this->conn->beginTransaction();

        try {
            switch ($request->paymentFormId) {
                case PaymentForm::CREDIT_CARD:
                    $creditPrepaidPurchase = $this->creditCardPayment($creditPrepaidPurchase, $request);
                    $creditPrepaidPurchase->setId($this->dao->sqlInsert($creditPrepaidPurchase));
                    $this->throwRejectedPayment();
                    break;
                case PaymentForm::PIX:
                    [$creditPrepaidPurchase, $payment] = $this->pixPayment($creditPrepaidPurchase, $request);
                    $creditPrepaidPurchase->setId($this->dao->sqlInsert($creditPrepaidPurchase));
                    $this->throwRejectedPayment();
                    break;
                case PaymentForm::OTHER_OPTIONS:
                    $creditPrepaidPurchase->setId($this->dao->sqlInsert($creditPrepaidPurchase));
                    break;
            }

            $this->conn->commit();

        } catch (CheckoutServiceException $e) {
            $this->conn->commit();
            (new LogDao)->logException($e);
            throw $e;
        } catch (CheckoutCardException $e) {
            $this->conn->commit();
            (new LogDao)->logException($e);
            throw $e;
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }

        $dataToReturn = $creditPrepaidPurchase->toArray();

        if ($request->paymentFormId == PaymentForm::PIX) {
            $dataToReturn['payment_data']['code'] =
                $payment['qrCodeContent']
                ?? $payment['pix_payload']
                ?? ($payment['data']['pix_payload'] ?? null)
                ?? ($payment['paymentData']['pixKey'] ?? null); // Firebanking

            $dataToReturn['payment_data']['qrcode'] =
                $payment['qrCode']
                ?? $payment['pix_qr_code']
                ?? ($payment['data']['pix_qr_code'] ?? null)
                ?? ($payment['paymentData']['pixQrCode'] ?? null); // Firebanking
        }

        return $dataToReturn;
    }

    /**
     * @param CreditPrepaidPurchase $creditPrepaidPurchase
     * @param array $request
     * @return CreditPrepaidPurchase
     * @throws CardException
     * @throws CheckoutServiceException
     * @throws Exception
     */
    private function pixPayment(CreditPrepaidPurchase $creditPrepaidPurchase, $request): array
    {
        $user = $this->userDao->find(Headers::getUserId());

        [$transaction, $payment] = $this->checkoutService
            ->pixPayment(
                [
                    'amount' => $creditPrepaidPurchase->getValue() * 100,
                    'dueDate' => Carbon::now()->addMinutes(10),
                    'customer' => [
                        'name' => $user->name,
                        'documentNumber' => $user->document,
                        'email' => $user->email,
                    ],
                ],
                TransactionTypeConst::CREDIT_PREPAID
            );

        $this->transaction = new Transaction($transaction);

        $creditPrepaidPurchase
            ->setTransactionId($this->transaction->getIdTransaction())
            ->setRefused(true)
            ->setStatusDetail('PENDENTE');

        return [$creditPrepaidPurchase, $payment];
    }

    public function creditPrepaidPixConfirm($transaction)
    {
        $this->transaction = new Transaction($transaction);

        $creditPrepaidPurchase = $this->dao->findByField('transactionId', $transaction->getIdTransaction());
        $this->creditPrepaidPurchase = new CreditPrepaidPurchase($creditPrepaidPurchase);

        if (!$creditPrepaidPurchase) {
            throw new Exception('Compra de crédito pré-pago não encontrada');
        }

        $balance = (new DriverBalanceDao)
            ->findByUser($this->creditPrepaidPurchase->getUserId());

        $this->conn->beginTransaction();

        try {
            if (!empty($this->creditPrepaidPurchase->getAmount())) {
                (new DriverBalanceDao)
                    ->add($balance->idBalance, $this->creditPrepaidPurchase->getAmount());

                $balanceFlow = (new BalanceFlowDao)->insertWithTransaction(
                    $this->creditPrepaidPurchase->getAmount(),
                    DriverBalanceConst::CREDIT_PREPAID_PURCHASE,
                    $balance->idBalance,
                    $this->transaction->getIdTransaction()
                );
            }

            $this->creditPrepaidPurchase
                ->setCredited(true)
                ->setRefused(0)
                ->setBalanceFlowId(isset($balanceFlow) ? $balanceFlow->getIdBalanceFlow() : null)
                ->setStatusDetail('PAGO');


            $this->creditPrepaidPurchaseDao->update($this->creditPrepaidPurchase);

            $this->transaction->setStatus(TransactionConst::COMPLETED);
            $this->transaction->setTransactionStatusId(TransactionConst::COMPLETED);
            $this->transaction->setStatusDetailed('PAGO');

            $this->transactionService->update($this->transaction);
            $this->checkoutService->dispatchTransactionStatusToAdmin(
                $this->transaction->getIdTransaction(),
                $this->transaction->getTransactionStatusId()
            );

            $this->conn->commit();
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param CreditPrepaidPurchase $creditPrepaidPurchase
     * @param array $request
     * @return CreditPrepaidPurchase
     * @throws CardException
     * @throws CheckoutServiceException
     * @throws Exception
     */
    private function creditCardPayment(CreditPrepaidPurchase $creditPrepaidPurchase, $request): CreditPrepaidPurchase
    {
        if (!isset($request->cardId))
            throw new TripPaymentException(251);

        $balance = (new DriverBalanceDao)
            ->findByUser($creditPrepaidPurchase->getUserId());

        $this->transaction = $this->checkoutService
            ->doCardCreditPayment(
                $creditPrepaidPurchase->getValue(),
                $request->cardId,
                null,
                $this->saleDescription,
                $request->mpToken ?? null
            );

        $creditPrepaidPurchase
            ->setTransactionId($this->transaction->getIdTransaction())
            ->setRefused(true);

        if ($this->transaction->getTransactionStatusId() == TransactionConst::COMPLETED) {
            if (!empty($creditPrepaidPurchase->getAmount())) {
                (new DriverBalanceDao)
                    ->add($balance->idBalance, $creditPrepaidPurchase->getAmount());

                $balanceFlow = (new BalanceFlowDao)->insertWithTransaction(
                    $creditPrepaidPurchase->getAmount(),
                    DriverBalanceConst::CREDIT_PREPAID_PURCHASE,
                    $balance->idBalance,
                    $this->transaction->getIdTransaction());
            }

            $creditPrepaidPurchase
                ->setCredited(true)
                ->setRefused(0)
                ->setBalanceFlowId(isset($balanceFlow) ? $balanceFlow->getIdBalanceFlow() : null);
        }

        return $creditPrepaidPurchase;
    }

    /**
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    private function throwRejectedPayment(): void
    {
        if (!$this->transaction) return;
        
        $this->responseValidator->validateTransactionResponse(
            $this->transaction->getStatus(),
            $this->transaction->getStatusDetailed(),
            $this->saleDescription,
            $this->transaction->getIntermediaryId()
        );
    }
}