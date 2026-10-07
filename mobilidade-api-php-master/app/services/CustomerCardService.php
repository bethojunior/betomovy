<?php

namespace app\services;

use app\constant\FinancialIntermediaryConst;
use app\model\AcquirerMetaData;
use app\model\FinancialIntermediary;
use app\dao\CustomerCardDao;
use app\dao\FinancialIntermediaryDao;
use app\dao\MpCardInfoDao;
use app\dao\CardInfoDao;
use app\dao\UserDao;
use app\exceptions\ApiTokenException;
use app\exceptions\CardException;
use app\exceptions\CheckoutServiceException;
use app\utils\Connection;
use app\utils\Headers;
use app\utils\MPCheckout;
use app\utils\IntegraApiCheckout;
use app\validator\CardValidator;
use app\model\Card;
use app\model\Config;
use app\model\PaymentForm;
use app\services\AcquirerService;
use Exception;
use app\model\MpCardInfo;
use app\model\CardInfo;
use app\utils\EPCheckout;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/11/2018
 * Time: 15:56
 */
class CustomerCardService
{
    /** @var PDO $conn */
    private $conn;
    private $validator;
    private $dao;
    private $checkoutService;
    protected $cardInfoId;
    protected $mpCardInfoId;
    protected $acquirerService;


    /**
     * CustomerCardService constructor.
     * @throws CheckoutServiceException
     */
    public function __construct()
    {
        $this->conn = Connection::open();
        $this->checkoutService = new CheckoutService;
        $this->validator = new CardValidator;
        $this->dao = new CustomerCardDao;
        $this->acquirerService = new AcquirerService;
    }

    /**
     * @param $request
     * @param $userId
     * @return array|string
     * @throws Exception
     */
    public function insert($request, $userId)
    {
        $this->validator->validateInsertCard($request);

        $this->conn->beginTransaction();

        try {
            $card = $this->createCard($request, $userId);

            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }

        return true;
    }

    /**
     * @param null $cardId
     * @return array|stdClass
     * @throws Exception
     */
    public function get($cardId = null)
    {
        $userId = Headers::getUserId();

        if (!$userId)
            throw new ApiTokenException("userid não enviado");

        $cards = $this->dao
            ->findByUserId($userId, $cardId);

        if (!$cards)
            return [];

//        @TODO - Criar a máscara de dados dos cartões devolvidos na requisição
//        return array_map(function ($card){
//            $cardInfo = $this->decryptCard($card);
//
//            $firstFourDigits = substr($cardInfo['number'], 0, 4);
//            $lastFourDigits = substr($cardInfo['number'], -4);
//
//            $middleFourDigits = strrev(substr($cardInfo['number'], 4, strlen($cardInfo['number']) - 8));
//
//            return [
//                'idCard'               => $cardInfo['idCard'],
//                'number'               => $firstFourDigits . $middleFourDigits . $lastFourDigits,
//                'cardholderName'       => "**** ****",
//                'cvv'                  => "***",
//                'expirationMonth'      => "**",
//                'expirationYear'       => "****",
//                'holderDocument'       => "***********",
//                'mpCustomerId'         => $cardInfo['mpCustomerId'],
//                'mpCardId'             => $cardInfo['mpCardId'],
//                'mpFirstSixDigits'     => $cardInfo['mpFirstSixDigits'],
//                'mpSecurityCodeLength' => $cardInfo['mpSecurityCodeLength'],
//                'mpPaymentMethodName'  => $cardInfo['mpPaymentMethodName'],
//                'mpLastFourDigits'     => $cardInfo['mpLastFourDigits'],
//                'statusId'             => $cardInfo['statusId'],
//                'userId'               => $cardInfo['userId'],
//                'created_at'           => $cardInfo['created_at'],
//                'birthDate'            => $cardInfo['birthDate']
//            ];
//        }, $cards);
        return array_map(function ($card) {
            return $this->decryptCard($card);
        }, $cards);
    }

    /**
     * @param $idCard
     * @return array
     * @throws Exception
     */
    public function find($idCard)
    {
        $card = $this->dao
            ->find($idCard);

        $cardObj = new Card($card);

        return array_merge(
            (array)$card,
            $cardObj
                ->decode()
                ->toArray());
    }

    /**
     * @param $cardId
     * @return bool
     * @throws Exception
     */
    public function delete($cardId): bool
    {
        $dao = new CustomerCardDao;

        $cardExists = $dao->find($cardId);

        if (!$cardExists)
            throw new CardException(901);

        return $dao->delete($cardId);
    }

    /**
     * @param $card
     * @return array
     * @throws Exception
     */
    private function decryptCard($card)
    {
        $cardObj = new Card($card);
        $arrayCard = $cardObj
            ->decode()
            ->toArray();

        return
            array_merge((array)$card, $arrayCard);
    }

    /**
     * @param $request
     * @param $userId
     * @return Card
     * @throws Exception
     */
    private function createCard($request, $userId): Card
    {
        $financialIntermediary = $this->acquirerService->getActiveAcquirerId(
            PaymentForm::CREDIT_CARD,
            Headers::getCityId()
        );

        $cardInfoId = null;
        $mpCardInfoId = null;
        $complementNumberCard = "00000000";

        switch ($financialIntermediary) {
            case FinancialIntermediaryConst::YUMEPAY:
                break;
            case FinancialIntermediaryConst::FIREBANKING:
                break;
            case FinancialIntermediaryConst::INTEGRAPAY:
                break;
            case FinancialIntermediaryConst::PAY704:
                $cardInfoId = $this->saveCardAdquirer($request, $userId, $financialIntermediary);
                break;
            case FinancialIntermediaryConst::MERCADO_PAGO:
                $mpCardInfoId = $this->saveInMP($request, $userId);        
                break;
            case FinancialIntermediaryConst::EPAG:
                $cardInfoId = $this->saveCardAdquirerEpag($request, $userId);
                break;
            default:
            break;
        }

        $card = new Card;
        empty($cardInfoId) ?
            $card
                ->setUserId(Headers::getUserId())
                ->setAlias($request->alias ?? null)
                ->setNumber($request->cardNumber)
                ->setCvv($request->cvv)
                ->setExpirationMonth($request->expirationMonth)
                ->setExpirationYear($request->expirationYear)
                ->setCardholderName($request->cardholderName)
                ->setHolderDocument($request->docNumber)
                ->setCardFlagId($request->cardFlagId ?? null)
                ->setBirthDate($request->birthDate ?? null)
                ->setMpCardInfoId($mpCardInfoId ?? null)
                ->encode()
                ->setIdCard(
                    $this->dao
                        ->sqlInsert($card)
                )
        :
        $card
            ->setUserId(Headers::getUserId())
            ->setCardInfoId($cardInfoId ?? null)
            ->setCvv($request->cvv)
            ->setNumber(substr($request->cardNumber, 0, 4) . $complementNumberCard . $request->lastFourDigits)
            ->setHolderDocument($request->docNumber)
            ->setCardholderName($request->cardholderName)
            ->setExpirationMonth($request->expirationMonth)
            ->setExpirationYear($request->expirationYear)
            ->setBirthDate($request->birthDate ?? null)
            ->encode()
            ->setIdCard(
                $this->dao
                    ->sqlInsert($card)
            );
            
        return $card;
    }

    private function validateIpagCard($vaultId, $request)
    {
        $amount = mt_rand(100, 200) / 100;
        $capture = $this->checkoutService->validateCardByReserve
        (   
            $request,
            $vaultId,
            $amount,
            null
        );
        if (!$capture) {
            throw new Exception("Erro ao validar cartão");
        }
        $paymentId = $capture['body']['paymentId'];
        $this->checkoutService->refundValidateCardReserve($paymentId);
    }

    private function saveInMP($request, $userId)
    {
        try {
            $customerId = $this->findCustomerIdByUser($userId);

            $mpAccessToken = AcquirerMetaData::get('mp_access_token');
            
            if (!$mpAccessToken)
            return null;
            
            $mpCheckout = new MPCheckout($mpAccessToken);

            $saved_card = $mpCheckout
                ->insertCard($customerId, null, $request->mpToken);
            $mpCardInfo = new MpCardInfo;
            $mpCardInfo
                ->setMpCustomerId($saved_card['customer_id'])
                ->setMpCardId($saved_card['id'])
                ->setMpFirstSixDigits($request->firstSixDigits)
                ->setMpPaymentMethodName($request->paymentMethodName)
                ->setMpSecurityCodeLength($request->securityCodeLength)
                ->setMpLastFourDigits($request->lastFourDigits)
                ->setIdCardInfo(
                    (new MpCardInfoDao)
                        ->sqlInsert($mpCardInfo)
                );

            return $mpCardInfo->getIdCardInfo();
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function saveCardAdquirer($request, $userId, $aquirerId)
    {
        try {
            $user = (new UserDao)
                ->find($userId);
            $savedCard = $this->checkoutService
                ->saveCard($userId, array_merge((array)$request, ["user" => (array)$user]), null);

            $cardId = !empty($savedCard['card_id'])
            ? $savedCard['card_id']
            : $savedCard['response']->uuid;
            
            return $this->saveCardInfo(
                $userId,
                $cardId,
                $request,
                $aquirerId
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function saveCardAdquirerEpag($request, $userId)
    {
        $configs = $this->findAcquirerMetaData(Headers::getCityId(), 'epag_secret');
        
        $rakimCheckout = new EPCheckout($configs);
        $rakimResponse = $rakimCheckout
            ->insertCard("", [
                'customerName'     => $this->removeAccents($request->cardholderName) ?? '',
                'documentNumber'   => $this->removeAccents($request->docNumber) ?? '',
                'cardNumber'       => str_replace(' ', '', $request->cardNumber) ?? '',
                'cardHolderName'   => $this->removeAccents($request->cardholderName) ?? '',
                'expirationMonth'  => $request->expirationMonth ?? '',
                'expirationYear'   => $request->expirationYear ?? '',
                'securityCode'     => $request->cvv ?? '',
                'brand'            => $request->paymentMethodName ?? ''
            ]);

        if (is_array($rakimResponse) && isset($rakimResponse['body']['vaultId'])) {
            $vaultId = $rakimResponse['body']['vaultId'];
            $this->validateIpagCard($vaultId, $request);
            return $this->saveCardInfo($userId, $vaultId, $request, FinancialIntermediaryConst::EPAG);
        }
        return null;
    }

    private function removeAccents($string) {
        return preg_replace(
            '/[^A-Za-z0-9 ]/',
            '',
            iconv('UTF-8', 'ASCII//TRANSLIT', $string)
        );
    }

    private function saveCardInfo($userId, $cardId, $request, $aquirerId)
    {
        $cardInfo = new CardInfo;
        $cardInfo
            ->setCustomerId($userId)
            ->setCardId($cardId)
            ->setFirstSixDigits($request->firstSixDigits)
            ->setPaymentMethodName($request->paymentMethodName)
            ->setSecurityCodeLength($request->securityCodeLength)
            ->setLastFourDigits($request->lastFourDigits)
            ->setFinancialIntermediaryId($aquirerId)
            ->setIdCardInfo(
                (new CardInfoDao)
                    ->sqlInsert($cardInfo)
            );

        return $cardInfo->getIdCardInfo();
    }


    /**
     * @param $userId
     * @return mixed
     * @throws Exception
     */
    private function findCustomerIdByUser($userId)
    {
        $user = (new UserDao)
            ->find($userId);

        $mpAccessToken = Config::get('mp_access_token');

        if (!$mpAccessToken)
            return null;

        $mpCheckout = new MPCheckout($mpAccessToken);

        $customer = $mpCheckout
            ->insertCustomer($user->email ?? null);

        return $customer['id'] ?? null;
    }

    public function getAcquirer()
    {
        $acquirerActived = (new FinancialIntermediaryDao)->findActive();
        return $acquirerActived;
    }

    private function findAcquirerMetaData(?int $cityId, string ...$keys): array
    {
        if (!is_null($cityId)) {
            $configs = AcquirerMetaData::getManyByCity($cityId, ...$keys);

            $empty = false;

            foreach ($configs as $config) {
                if (empty($config)) {
                    $empty = true;
                    break;
                }
            }

            if (!$empty) {
                return $configs;
            }
        }

        return AcquirerMetaData::getMany(...$keys);
    }
}