<?php

namespace app\services;

use app\constant\AppConst;
use app\constant\FinancialIntermediaryConst;
use app\constant\TransactionConst;
use app\contracts\CheckoutInterface;
use app\dao\CardInfoDao;
use app\dao\CustomerCardDao;
use app\dao\LogDao;
use app\dao\TransactionLogDao;
use app\dao\UserDao;
use app\dtos\checkout\split\SplitPaymentDTO;
use app\exceptions\CardException;
use app\exceptions\CheckoutServiceException;
use app\model\Acquirer;
use app\model\AcquirerMetaData;
use app\model\Card;
use app\model\CardInfo;
use app\model\PaymentForm;
use app\model\Transaction;
use app\model\TransactionLog;
use app\model\User;
use app\services\AcquirerService;
use app\utils\Admin704Apps;
use app\utils\Checkout704Pay;
use app\utils\CieloCheckout;
use app\utils\CotabankCheckout;
use app\utils\EPCheckout;
use app\utils\FBCheckout;
use app\utils\FormatValue;
use app\utils\GetnetCheckout;
use app\utils\Headers;
use app\utils\IntegraApiCheckout;
use app\utils\IuguCheckout;
use app\utils\MPCheckout;
use app\utils\PagSeguroCheckout;
use app\utils\Admin704AppsMapper;
use app\utils\Logger;
use app\utils\PaySoonCheckout;
use app\utils\RecebeAquiCheckout;
use app\utils\RedeCheckout;
use app\utils\YumePayCheckout;
use app\utils\ZspayCheckout;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/11/2018
 * Time: 16:48.
 */
class CheckoutService
{
    private $checkout;

    /** @var Transaction */
    private $transaction;
    private $transactionService;
    private $customerCardDao;
    private $intermediary_id;
    private $userDao;
    private array $splits = [];
    private ?Acquirer $acquirer = null;
    private ?Admin704Apps $admin = null;
    private ?AcquirerService $acquirerService;

    public function __construct($intermediary_id = null)
    {
        $this->admin = new Admin704Apps();
        $this->transaction = new Transaction();
        $this->transactionService = new TransactionService();
        $this->customerCardDao = new CustomerCardDao();
        $this->userDao = new UserDao();
        $this->intermediary_id = $intermediary_id;
        $this->acquirerService = new AcquirerService();
    }

    /**
     * @throws \Exception
     */
    public function findOrCreateCustomer(User $user)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id);

        $customerName = explode(' ', $user->getName());

        $customerOptions = [
            'first_name' => $customerName[0],
            'last_name' => end($customerName),
        ];

        $customer = $this->checkout
            ->insertCustomer($user->getEmail(), $customerOptions);

        return $customer['id'] ?? null;
    }

    /**
     * @throws \Exception
     */
    public function saveCard($customerId, $data, $token = null)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id, Headers::getCityId());

        return $this->checkout
            ->insertCard($customerId, $data, $token);
    }

    /**
     * @param      $value       | valor da transação
     * @param null $sale_id
     * @param null $description | alguma descrição para a transação
     * @param null $mpToken     | token do mercado pago (opcional)
     *
     * @return mixed
     *
     * @throws CheckoutServiceException
     */
    public function doCardCreditPayment(
        $value,
        $cardId,
        $sale_id = null,
        $description = null,
        $mpToken = null,
        int $cityId = null,
        $capture = true
    ): Transaction {
        $this->doPayment(
            $value,
            $cardId,
            PaymentForm::CREDIT_CARD,
            $sale_id,
            $description,
            $mpToken,
            $cityId,
            $capture
        );

        return $this->transaction;
    }

    /**
     * @param null $sale_id
     * @param null $description
     * @param null $mpToken
     *
     * @return Transaction
     *
     * @throws CardException
     * @throws CheckoutServiceException
     */
    public function doCardDebitPayment(
        $value,
        $cardId,
        $sale_id = null,
        $description = null,
        $mpToken = null,
        int $cityId = null
    ) {
        $this->doPayment(
            $value,
            $cardId,
            PaymentForm::DEBIT_CARD,
            $sale_id,
            $description,
            $mpToken,
            $cityId
        );

        return $this->transaction;
    }

    public function validateCardByReserve($request, $cardId, $amount, $cityId = null)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id, $cityId, PaymentForm::CREDIT_CARD);
        $user = (new UserDao())->find(Headers::getUserId());

        $parameters = [
            'value' => $amount,
            'card' => [
                'cardId' => $cardId,
                'cardholderName' => $request->cardholderName,
                'holderDocument' => $request->docNumber,
                'number' => $request->cardNumber,
            ],
            'phone' => $user->phone ?? null,
            'email' => $user->email ?? null
        ];

        return $this->checkout
            ->setParameters($parameters)
            ->reserveAmount();
    }

    public function refundValidateCardReserve($paymentId, $cityId = null)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id, $cityId, PaymentForm::CREDIT_CARD);
        $payment = $this->checkout->refundCreditPayment($paymentId);
        return $payment;  
    }

    /**
     * @throws CheckoutServiceException
     */
    public function captureAmount(Transaction $transaction): ?Transaction
    {
        $this->transaction = $transaction;

        $this->checkout = $this->getCheckout($transaction->getIntermediaryId(), null, $transaction->getPaymentFormId());

        $intermediaryId = (int) $transaction->getIntermediaryId();
        $isStripe = $intermediaryId === FinancialIntermediaryConst::STRIPE;

        // Stripe sempre autoriza (manual) e captura no fim da corrida.
        // Demais adquirentes: captura só se a flag do adquirente estiver desligada (pré-auth).
        $shouldCapture = $isStripe || ($this->acquirer && !$this->acquirer->getCapture());

        if ($shouldCapture) {
            $payment = $this->checkout->captureAmount($transaction->getGeneratedPaymentId(), $transaction->getValue());
            $this->updateTransaction($payment);

            $this->dispatchTransactionStatusToAdmin(
                $this->transaction->getIdTransaction(),
                $this->transaction->getTransactionStatusId()
            );

            return $this->transaction;
        }

        return $this->transaction;
    }

    /***
     * @param Transaction $transaction
     * @param int|null $cityId
     * @return Transaction
     * @throws CheckoutServiceException
     */
    public function refundPayment(Transaction $transaction, ?int $cityId = null, ?float $amount = null): Transaction
    {
        $this->transaction = $transaction;

        $paymentForm  = $transaction->getPaymentFormId();

        $this->checkout = $this->getCheckout(
            $transaction->getIntermediaryId(),
            $cityId,
            $paymentForm
        );

        $payment = $this->processRefund($this->checkout, $transaction, $paymentForm, $amount);

        $this->updateTransactionStatusOnly($payment);

        $this->dispatchTransactionStatusToAdmin(
            $this->transaction->getIdTransaction(),
            $this->transaction->getTransactionStatusId()
        );

        return $this->transaction;
    }

    /**
     * @throws \Exception
     */
    public function findIntermediaryPayment($paymentId)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id);
        $payment = $this->checkout->findPayment($paymentId);

        return $payment;
    }

    private function processRefund($checkout, Transaction $transaction, int $paymentForm, ?float $amount)
    {
        $paymentId = $transaction->getGeneratedPaymentId();
        $value     = $amount ?? $transaction->getValue();

        switch ($paymentForm) {
            case PaymentForm::CREDIT_CARD:
                return $checkout->refundCreditPayment($paymentId, $value);

            case PaymentForm::DEBIT_CARD:
                return $checkout->refundDebitPayment($paymentId, $value);

            case PaymentForm::PIX:
                return $checkout->refundPixPayment($paymentId, $value);

            default:
                throw new CheckoutServiceException(151);
        }
    }

    /**
     * @return array
     *
     * @throws CardException
     * @throws CheckoutServiceException
     */
    private function findPaymentInformation(int $cardId, ?string $description, $intermediary)
    {
        $description = $description ?? AppConst::PRODUCT_NAME;

        $card = $this->findCard($cardId);

        $user = $this->userDao
            ->find(Headers::getUserId());

        if (empty($card['cardId']) && ($intermediary === FinancialIntermediaryConst::PAY704 || $intermediary === FinancialIntermediaryConst::STRIPE)) {
            $cardInfo = $this->saveCardInfoAdquirer($card, $user, $this->intermediary_id);
            $this->updateCard($card['idCard'], $cardInfo, $card);
            $card = $this->findCard($cardId);
        }

        return [$card, $user, $description, $this->acquirer->getCapture()];
    }

    /**
     * @param null $sale_id
     * @param null $description
     * @param null $mpToken
     *
     * @throws CardException
     * @throws CheckoutServiceException
     */
    private function doPayment(
        $value,
        $cardId,
        $paymentFormId,
        $sale_id = null,
        $description = null,
        $mpToken = null,
        int $cityId = null,
        bool $capture = true
    ): void {
        $this->checkout = $this->getCheckout($this->intermediary_id, $cityId, $paymentFormId);

        list($card, $user, $description, $captureFinancial) = $this->findPaymentInformation(
            $cardId,
            $description,
            $this->intermediary_id
        );

        $email = $user->email ?? null;
        $name = $user->name ?? null;
        $phone = $user->phone ?? null;
        $document = $user->document ?? null;

        $isStripe = ((int) $this->intermediary_id) === FinancialIntermediaryConst::STRIPE;

        // Stripe: respeita o parâmetro da corrida (false = authorize/manual).
        // Outros: OR com flag do adquirente (legado).
        if ($isStripe) {
            $capture = (bool) $capture;
        } else {
            $capture = !(empty($capture) && empty($captureFinancial));
        }

        $mpCustomerId = $card['mpCustomerId'];
        $customerId = $card['CustomerId'];
        $userId = $user->idUser;
        // TODO: REMOVER DATA ESTATICA
        $dateOfBirth = ($card['birthDate'] ?? $user->dateOfBirth) ?? '1980-06-11';

        $parameters = [
            'user' => $user,
            'value' => $value,
            'sale_id' => $sale_id,
            'mpToken' => $mpToken,
            'description' => $description,
            'email' => $email,
            'name' => $name,
            'capture' => $capture,
            'phone' => $phone,
            'mpCustomerId' => $mpCustomerId,
            'customerId' => $customerId,
            'userId' => $userId,
            'card' => $card,
            'document' => $document,
            'dateOfBirth' => $dateOfBirth,
            'splits' => $this->splits,
        ];

        switch ((int) $paymentFormId) {
            case PaymentForm::CREDIT_CARD:
                $payment = empty($capture) ? $this->checkout
                    ->setParameters($parameters)
                    ->reserveAmount()
                    :
                    $this->checkout
                    ->setParameters($parameters)
                    ->creditPayment();
                break;
            case PaymentForm::DEBIT_CARD:
                $payment = $this->checkout
                    ->setParameters($parameters)
                    ->debitPayment();
                break;
            default:
                throw new CheckoutServiceException(151);
        }

        /*
         * Alimenta o objeto Transaction para padronização das respostas dos intermediadores
         */
        $this->feedTransaction($payment, $paymentFormId, $cityId);
    }

    /**
     * @throws CheckoutServiceException
     * @throws CardException
     */
    private function findCard($id): array
    {
        $card = $this->customerCardDao
            ->find($id);

        if (!$card && Headers::getUserId()) {
            $userCards = $this->customerCardDao->findByUserId(Headers::getUserId());
            if (!empty($userCards) && isset($userCards[0]['idCard'])) {
                $card = $this->customerCardDao->find($userCards[0]['idCard']);
            }
        }

        if (!$card) {
            throw new CheckoutServiceException(153, compact('card'));
        }

        $cardObj = new Card($card);

        return array_merge(
            (array) $card,
            $cardObj
                ->decode()
                ->toArray()
        );
    }

    /**
     * @throws \Exception
     */
    private function saveCardInfoAdquirer($card, $user, $aquirerId)
    {
        $savedCard = $this->saveCard($card['userId'], array_merge((array) $card, ['user' => (array) $user]), null);
        $cardInfo = new CardInfo();
        $externalCardId = !empty($savedCard['id']) ? $savedCard['id'] : (!empty($savedCard['card_id']) ? $savedCard['card_id'] : ($savedCard['response']->uuid ?? ('pm_' . bin2hex(random_bytes(10)))));
        $cardInfo
            ->setCustomerId($card['userId'])
            ->setCardId($externalCardId)
            ->setFirstSixDigits(substr($card['number'], 0, 6))
            ->setPaymentMethodName(FormatValue::brandsCard($card['number']))
            ->setSecurityCodeLength(3)
            ->setLastFourDigits(substr($card['number'], 12, 16))
            ->setFinancialIntermediaryId($aquirerId)
            ->setIdCardInfo(
                (new CardInfoDao())
                    ->sqlInsert($cardInfo)
            );

        return $cardInfo->getIdCardInfo();
    }

    /**
     * @throws CheckoutServiceException
     * @throws \Exception
     */
    private function updateCard(int $idCard, int $cardInfoId, array $card): void
    {
        $card['number'] = substr($card['number'], 0, 4) . '00000000' . substr($card['number'], 12, 16);
        $cardObj = new Card($card);
        $card = array_merge(
            (array) $card,
            $cardObj
                ->encode()
                ->toArray()
        );

        $card = $this->customerCardDao
            ->updateCard($idCard, $cardInfoId, $card);

        if (!$card) {
            throw new CheckoutServiceException(153, compact('card'));
        }
    }

    /**
     * @throws CheckoutServiceException
     */
    private function feedTransaction($payment, $paymentFormId, ?int $cityId = null): void
    {
        $this->checkout = $this->getCheckout($this->intermediary_id, $cityId, $paymentFormId);
        $checkoutIntermediaryService = new CheckoutIntermediaryService();

        $this->transaction = $checkoutIntermediaryService
            ->feedTransactionByIntermediaryResponse(
                $this->checkout->__get('financialIntermediaryId'),
                $payment,
                $paymentFormId
            );
        $this->transaction = $this->transactionService
            ->insert($this->transaction);
        
        $this->dispatchTransactionToAdmin($this->transaction);

        $this->createTransactionLog($payment);
    }

    private function dispatchTransactionToAdmin(Transaction $transaction): void
    {
        if ($this->isAcquirerLegacy()) {
            return;
        }

        $acquirerId  = $this->acquirer->getAcquirerId() ?? null;
        $customer_id = $this->acquirer->getCustomerId() ?? null;

        if (!isset($customer_id) || !isset($acquirerId)) {
            return;
        }

        $user = $this->userDao->find(Headers::getUserId(), ['name', 'document', 'email']);

        $payload = [
            'customer_id'    => $customer_id,
            'acquirer_id'    => $acquirerId,
            'external_id'    => $transaction->getIdTransaction(),
            'amount'         => (float) $transaction->getValue(),
            'status'         => Admin704AppsMapper::mapStatus($transaction->getTransactionStatusId()),
            'payment_method' => Admin704AppsMapper::mapPaymentMethod($transaction->getPaymentFormId()),
            'payer_name'     => $user->name ?? null,
            'payer_document' => $user->document ?? null,
            'payer_email'    => $user->email ?? null,
        ];

        try {
            $this->admin->storeTransaction($payload);
        } catch (\Exception $e) {
            (new LogDao)->logException($e);
        }
    }

    /**
     * Envia uma atualização de status para o Admin704Apps.
     * Deve ser chamado sempre que houver uma mudança de status na transação para manter o Admin atualizado.
     */
    public function dispatchTransactionStatusToAdmin(string $transactionId, int $transactionStatusId): void
    {
        if ($this->isAcquirerLegacy()) {
            return;
        }

        $status = Admin704AppsMapper::mapStatus($transactionStatusId);

        if (empty($transactionId) || empty($status)) {
            return;
        }

        try {
            $this->admin->updateTransactionStatus($transactionId, $status);
        } catch (\Exception $e) {
            (new LogDao)->logException($e);
        }
    }

    private function isAcquirerLegacy(): bool
    {
        if ($this->acquirer !== null) {
            return $this->acquirer->getLegacy() === true;
        }

        return $this->acquirerService->isCachedAcquirerLegacy() === true;
    }

    /**
     * Deve ser chamado antes do método doPayment para que o split seja aplicado.
     *
     * @TODO: Create getSplits method
     *
     * @TODO: Create remove split method
     */
    public function addSplitConfig(SplitPaymentDTO $splitPaymentDTO): CheckoutService
    {
        $this->splits[] = $splitPaymentDTO->toArray();

        return $this;
    }

    /**
     * @throws CheckoutServiceException
     * @throws \Exception
     */
    private function updateTransaction($paymentData): void
    {
        $checkoutIntermediaryService = new CheckoutIntermediaryService();

        $this->transaction = $checkoutIntermediaryService
            ->feedTransactionByIntermediaryResponse(
                $this->checkout->__get('financialIntermediaryId'),
                $paymentData,
                $this->transaction->getPaymentFormId(),
                $this->transaction->getIdTransaction()
            );

        $this->transactionService->update($this->transaction);
        
        $this->createTransactionLog($paymentData);
    }

    private function updateTransactionStatusOnly($paymentData): void
    {
        $checkoutIntermediaryService = new CheckoutIntermediaryService();

        $mapped = $checkoutIntermediaryService
            ->feedTransactionByIntermediaryResponse(
                $this->checkout->__get('financialIntermediaryId'),
                $paymentData,
                $this->transaction->getPaymentFormId(),
                $this->transaction->getIdTransaction()
            );

        $this->transaction->setTransactionStatusId($mapped->getTransactionStatusId());
        $this->transaction->setStatus($mapped->getStatus());

        $this->transactionService->updateStatusOnly($this->transaction);

        $this->createTransactionLog($paymentData);
    }

    /**
     * @throws CheckoutServiceException
     */
    private function validateArrayResponse($payment)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id);

        if (isset($payment['error']) && $payment['error'] == 'bad_request') {
            throw new CheckoutServiceException(150, ['payment_response' => $payment]);
        }

        if (isset($payment['description']) && !$payment['status']) {
            $payment = $this->checkout
                ->searchPayment(['description' => $payment['description']])[0] ?? $payment;
        }

        if (
            !isset($payment['description'])
            || !$payment['status']
            || !$payment['id']
        ) {
            throw new CheckoutServiceException(150, compact('payment'));
        }
    }

    private function createTransactionLog($paymentData): void
    {
        $log = new TransactionLog();
        $log
            ->setUserId(Headers::getUserId())
            ->setIdReference($this->transaction->getIdTransaction())
            ->setData((object) [
                'transaction' => $this->transaction->toStdClass(),
                'paymentData' => $paymentData,
            ]);

        (new TransactionLogDao())->noSqlInsert($log->toStdClass());
    }

    public function pixPayment(array $data, $transactionTypeId = 1)
    {
        $this->checkout = $this->getCheckout($this->intermediary_id, null, PaymentForm::PIX);
        switch ($this->checkout->financialIntermediaryId) {
            case FinancialIntermediaryConst::MERCADO_PAGO:
                $response = $this->checkout->pixPayment($data);
                $this->insertPixTransaction($response, $transactionTypeId);
                return [$this->transaction, $response];
            case FinancialIntermediaryConst::PAY704:
                $response = $this->checkout->pixPayment($data);
                $this->insertPixTransaction($response, $transactionTypeId);
                return [$this->transaction, $response['response']];
            case FinancialIntermediaryConst::EPAG:
                $response = $this->checkout->pixPayment($data);
                $this->insertPixTransaction($response, $transactionTypeId);
                return [$this->transaction, $response['body']];
            case FinancialIntermediaryConst::FIREBANKING:
                $response = $this->checkout->pixPayment($data);
                $this->insertPixTransaction($response, $transactionTypeId);
                return [$this->transaction, $response];
            case FinancialIntermediaryConst::YUMEPAY:
                $response = $this->checkout->pixPayment($data);
                $this->insertPixTransaction($response, $transactionTypeId);
                return [$this->transaction, $response['data'] ?? []];
            default:
                throw new CheckoutServiceException(158, [], 'Pix indisponível para pagamentos!');
            }
    }

    public function findPixPayment(int $intermediaryId = null, $cityId = null, $generatedId)
    {
        $this->checkout = $this->getCheckout($intermediaryId, $cityId, PaymentForm::PIX);

        switch ($this->checkout->financialIntermediaryId) {
            case FinancialIntermediaryConst::MERCADO_PAGO:
                return $this->checkout->findPaymentPix($generatedId);
            case FinancialIntermediaryConst::PAY704:
                return $this->checkout->findPaymentPix($generatedId);
            case FinancialIntermediaryConst::EPAG:
                $result = $this->checkout->findPaymentPix($generatedId);
                $status = $result->status;
                switch ($status) {
                    case 1:
                        $result->payment_status_id = TransactionConst::PENDENTE;
                        break;
                    case 3:
                        $result->payment_status_id = TransactionConst::COMPLETED;
                        break;
                    case 2:
                        $result->payment_status_id = TransactionConst::REJECTED;
                        break;
                    default:
                        $result->payment_status_id = $status;
                        break;
                }
                return $result;
            case FinancialIntermediaryConst::FIREBANKING:
                return $this->checkout->findPaymentPix($generatedId);
            case FinancialIntermediaryConst::YUMEPAY:
                $result = $this->checkout->findPaymentPix($generatedId);
                $status = strtoupper((string) ($result->sale_status ?? $result->status ?? ''));

                switch ($status) {
                    case 'CONFIRMED':
                    case 'PAID':
                    case 'SUCCESS':
                        $result->payment_status_id = TransactionConst::COMPLETED;
                        break;
                    case 'PRE_CAPTURED':
                    case 'PENDING':
                    case 'WAITING_PAYMENT':
                        $result->payment_status_id = TransactionConst::PENDENTE;
                        break;
                    case 'CANCELLED':
                    case 'CANCELED':
                    case 'REFUSED':
                    case 'FAILED':
                    case 'EXPIRED':
                        $result->payment_status_id = TransactionConst::REJECTED;
                        break;
                    default:
                        $result->payment_status_id = $result->payment_status_id ?? TransactionConst::PENDENTE;
                        break;
                }

                if (empty($result->amount) && isset($result->value)) {
                    $result->amount = $result->value;
                }

                return $result;
            default:
                throw new CheckoutServiceException(158, [], 'Pix disponível apenas para o 704pay e Ipag');
        }
    }

    public function insertPixTransaction($payment, $transactionTypeId)
    {
        $checkoutIntermediaryService = new CheckoutIntermediaryService();

        $this->transaction = $checkoutIntermediaryService
            ->feedTransactionByIntermediaryResponse(
                $this->checkout->__get('financialIntermediaryId'),
                $payment,
                PaymentForm::PIX,
                null,
                $transactionTypeId
            );

        $this->transaction = $this->transactionService
            ->insert($this->transaction);
        
        $this->dispatchTransactionToAdmin($this->transaction);

        $this->createTransactionLog($payment);
    }

    /**
     * @param null $intermediary_id
     * @param ?int $cityId
     * @param ?int $paymentFormId
     *
     * @return CheckoutInterface
     *
     * @throws CheckoutServiceException
     */
    private function getCheckout($intermediary_id = null, ?int $cityId = null, ?int $paymentFormId = null): CheckoutInterface
    {
        $paymentForm = $paymentFormId ?? $this->transaction->getPaymentFormId();
        
        $this->acquirer = $this->acquirerService->getActiveAcquirerData($paymentForm, $cityId);

        $configs = $this->acquirer->getConfigs();

        $this->intermediary_id = $intermediary_id ?? $this->acquirer->getIntermediaryId();

        switch ($this->intermediary_id) {
            case FinancialIntermediaryConst::MERCADO_PAGO:
                return new MPCheckout($configs['mp_access_token']);
            case FinancialIntermediaryConst::CIELO:
                return new CieloCheckout($configs['cielo_merchant_id'], $configs['cielo_merchant_key']);
            case FinancialIntermediaryConst::RECEBE_AQUI:
                return new RecebeAquiCheckout($configs['recebeaqui_client_token']);
            case FinancialIntermediaryConst::IUGU:
                return new IuguCheckout(
                    $configs['iugu_api_token'],
                    $configs['iugu_account_id']
                );
            case FinancialIntermediaryConst::INTEGRAPAY:
                return new IntegraApiCheckout(
                    $configs['integra_pay_api_token']
                );
            case FinancialIntermediaryConst::PAGSEGURO:
                return new PagSeguroCheckout(
                    $configs['pagseguro_token'],
                    $configs['pagseguro_email']
                );
            case FinancialIntermediaryConst::PAY704:
                return new Checkout704Pay(
                    $configs['704_pay_api_id'],
                    $configs['704_pay_api_secret']
                );
            case FinancialIntermediaryConst::GETNET:
            case FinancialIntermediaryConst::GETNET_MOVY: // id 6 no banco MOVY
                return new GetnetCheckout(
                    $configs['getnet_seller_id'],
                    $configs['client_id'],
                    $configs['client_secret']
                );
            case FinancialIntermediaryConst::REDE:
                list('rede_pv' => $rede_pv, 'rede_token' => $rede_token) = $configs;

                return new RedeCheckout($rede_pv, $rede_token);
            case FinancialIntermediaryConst::ZSPAY:
                list('zspay_token' => $zspay_token, 'zspay_establishment_id' => $zspay_establishment_id) = $configs;

                return new ZspayCheckout($zspay_token, $zspay_establishment_id);
            case FinancialIntermediaryConst::PAYSOON:
                return new PaySoonCheckout($configs['paysoon_user'], $configs['paysoon_password']);
            case FinancialIntermediaryConst::COTABANK:
                return new CotabankCheckout(
                    $configs['cotabank_user'],
                    $configs['cotabank_password'],
                    $configs['cotabank_terminal']
                );
            case FinancialIntermediaryConst::EPAG:
                return new EPCheckout($configs);
            case FinancialIntermediaryConst::YUMEPAY:
                return new YumePayCheckout($configs['yume_api_token']);
            case FinancialIntermediaryConst::FIREBANKING:
                return new FBCheckout($configs);
            case FinancialIntermediaryConst::STRIPE:
                return new \app\utils\StripeCheckout(
                    $configs['secret_key'] ?? $configs['stripe_secret_key'] ?? '',
                    $configs['publishable_key'] ?? $configs['stripe_publishable_key'] ?? null
                );
            default:
                throw new CheckoutServiceException(151);
        }
    }
}
