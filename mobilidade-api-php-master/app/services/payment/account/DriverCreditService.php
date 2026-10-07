<?php

namespace app\services\payment\account;

use app\constant\DriverBalanceConst;
use app\constant\FinancialIntermediaryConst;
use app\constant\TransactionConst;
use app\constant\TransactionTypeConst;
use app\dao\BalanceFlowDao;
use app\dao\CreditPrepaidDao;
use app\dao\CreditPrepaidPurchaseDao;
use app\dao\DriverBalanceDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\TransactionDao;
use app\dao\UserDao;
use app\exceptions\CheckoutServiceException;
use app\model\PaymentForm;
use app\services\CheckoutService;
use app\services\TransactionService;
use app\utils\Connection;
use app\utils\Headers;
use app\utils\Push;
use app\validator\CheckoutCardValidator;
use app\validator\driverCredit\addDriverPixCredit;
use Carbon\Carbon;

class DriverCreditService
{
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
     * @var \MongoDB\Driver\Manager|\PDO
     */
    private $conn;
    /**
     * @var \app\dao\UserDao
     */
    private $userDao;
    private $driverDao;
    private TransactionService $transactionService;
    private TransactionDao $transactionDao;
    private DriverBalanceDao $driverBalanceDao;
    private BalanceFlowDao $balanceFlowDao;
    private Push $push;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->validator = new addDriverPixCredit();
        $this->checkoutService = new CheckoutService();
        $this->userDao = new UserDao();
        $this->driverDao = new DriverDao();
        $this->transactionDao = new TransactionDao();
        $this->transactionService = new TransactionService();
        $this->driverBalanceDao = new DriverBalanceDao();
        $this->balanceFlowDao = new BalanceFlowDao();
        $this->push = new Push();
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function generatePixTransaction($request)
    {
        $this->validator->validatePixData($request);

        $this->conn->beginTransaction();
        try {
            $createCreditPix = $this->createCreditPix($request);

            $this->conn->commit();
        } catch (CheckoutServiceException $e) {
            $this->conn->commit();
            (new LogDao())->logException($e);
            throw $e;
        } catch (\Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollback();
            }
            (new LogDao())->logException($e);
            throw $e;
        }

        return $createCreditPix;
    }

    public function createCreditPix($request)
    {
        $user = $this->userDao->find(Headers::getUserId());
        $driver = $this->driverDao->findByUserId(Headers::getUserId());

        $transactions = $this->transactionDao->getPeddingTransactionsByUserId($user->idUser, PaymentForm::PIX, 2);

        // se alguma das condições for verdadeira, irá buscar o pix mais recente
        if (
            !Carbon::now()->gt(Carbon::parse(end($transactions)->created_at)->addMinutes(3))
            && !empty($transactions)
            && floatval($request->amount) != floatval(end($transactions)->value)
        ) {
            $transaction = end($transactions);

            $pixData = $this->checkoutService->findPixPayment(null, $driver->cityId, $transaction->generatedPaymentId);
            $pixData = $this->normalizePixData($pixData);
            $objReturn = new \stdClass();
            $objReturn = $transaction;
            $objReturn->pixData = $pixData;

            return $objReturn;
        }
        [$transaction, $pixData] = $this->checkoutService->pixPayment([
            'amount' => (float) number_format($request->amount, 2, '.', '') * 100,
            'dueDate' => Carbon::now()->addMinutes(10),
            'customer' => [
                'name' => $user->name,
                'documentNumber' => $user->document,
                'email' => $user->email,
            ],
        ],
            TransactionTypeConst::NEGATIVE_BALANCE
        );
        $pixData = $this->normalizePixData($pixData);

        $objReturn = new \stdClass();
        $objReturn = $transaction->toArray();
        $objReturn['pixData'] = $pixData;

        return $objReturn;
    }

    public function getCreditPixRequest($request)
    {
        $transaction = $this->transactionDao->find($request->transactionId);
        $driver = $this->driverDao->findByUserId(Headers::getUserId());

        if (!$transaction) {
            throw new \Exception('Transação não encontrada');
        }

        $pixData = $this->checkoutService->findPixPayment(null, $driver->cityId, $transaction->generatedPaymentId);
        $pixData = $this->normalizePixData($pixData);

        if ($pixData->payment_status_id == TransactionConst::COMPLETED && intval($transaction->transactionStatusId) !== TransactionConst::COMPLETED) {
            $this->transactionService->confirmPixTransaction($transaction);
            $transaction = $this->transactionDao->find($request->transactionId);
            // não exige conta bancária — usava findWithAccountInfo (INNER JOIN em bankAccount)
            $driverAccountInfo = $this->driverBalanceDao->findByUser(Headers::getUserId());

            $totalBalance = $driverAccountInfo->balance + $pixData->amount / 100;
            $this->driverBalanceDao->updateBalance($driverAccountInfo->idBalance, [
                'amount' => $totalBalance,
            ]);
            $this->balanceFlowDao->insertWithTransaction(
                $pixData->amount / 100,
                DriverBalanceConst::TRANSFER_RECEIVING,
                $driverAccountInfo->idBalance,
                $transaction->idTransaction);
        }

        $objReturn = new \stdClass();
        $objReturn = $transaction;
        $objReturn->pixData = $pixData;

        return $objReturn;
    }

    private function normalizePixData($pixData)
    {
        if (is_array($pixData)) {
            $payload = $pixData['pix_payload'] ?? $pixData['qrCodeContent'] ?? $pixData['paymentData']['pixKey'] ?? null;
            $qrcode = $pixData['pix_qr_code'] ?? $pixData['qrCode'] ?? $pixData['paymentData']['pixQrCode'] ?? null;

            if (!empty($payload) && empty($pixData['pix_payload'])) {
                $pixData['pix_payload'] = $payload;
            }
            if (!empty($qrcode) && empty($pixData['pix_qr_code'])) {
                $pixData['pix_qr_code'] = $qrcode;
            }
            if (!empty($payload) && empty($pixData['qrCodeContent'])) {
                $pixData['qrCodeContent'] = $payload;
            }
            if (!empty($qrcode) && empty($pixData['qrCode'])) {
                $pixData['qrCode'] = $qrcode;
            }

            return $pixData;
        }

        if (is_object($pixData)) {
            $payload = $pixData->pix_payload ?? $pixData->qrCodeContent ?? $pixData->paymentData->pixKey ?? null;
            $qrcode = $pixData->pix_qr_code ?? $pixData->qrCode ?? $pixData->paymentData->pixQrCode ?? null;

            if (!empty($payload) && empty($pixData->pix_payload)) {
                $pixData->pix_payload = $payload;
            }
            if (!empty($qrcode) && empty($pixData->pix_qr_code)) {
                $pixData->pix_qr_code = $qrcode;
            }
            if (!empty($payload) && empty($pixData->qrCodeContent)) {
                $pixData->qrCodeContent = $payload;
            }
            if (!empty($qrcode) && empty($pixData->qrCode)) {
                $pixData->qrCode = $qrcode;
            }
        }

        return $pixData;
    }
}
