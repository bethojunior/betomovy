<?php

namespace app\model;

use app\constant\PushActionConst;
use app\constant\PushConst;
use app\constant\PushTagConst;
use app\dao\CityDao;
use app\dtos\TripCallPushDTO;
use app\utils\BaseModel;
use app\utils\MapUtils;
use app\utils\PhoneMessage;
use app\utils\PhoneNumberNormalizer;
use app\utils\Photo;
use app\utils\Push;
use app\utils\TripCallNotificationBuilder;
use app\utils\WhatsApp\WhatsAppService;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 12/07/2018
 * Time: 14:11
 */
class Driver extends BaseModel
{
    private $confirmationMessage = "Seu codigo de confirmacao eh: ";
    private $recoveryMessage = "Seu codigo de recuperacao eh: ";

    const AVAILABLE = "disponivel";
    const IN_TRIP = "corrida";
    const OFF = "desligado";

    const MESSAGE_PUSH_NOTIFICATION = "Facilitador de chamadas ativo, mantenha o app aberto!";
    const ICON_PUSH_NOTIFICATION = null;
    const SOUND_PUSH_NOTIFICATION = "assobio.mp3";
    const TRIP_CALL_CATEGORY_ID = "tripCall";

    const DOC_DIR = "driver/docs/";
    const PROFILE_DIR = "driver/profile/";
    const PROFILE_DIR_TEMP = "driver/profile/temp/";

    protected $idDriver;
    protected $userId;
    protected $cityId;
    protected $estateId;
    protected $status;
    protected $driverRegisterStatusId;
    protected $cnh;
    protected $cnhPicture;
    protected $crlv;
    protected $crlvPicture;
    protected $alvara;
    protected $alvaraPicture;
    protected $proofOfResidence;
    protected $criminalRecord;
    protected $criminalRecordPicture;
    protected $profileImage;
    protected $profileImageStatusId;
    protected $balanceId;
    protected $hasCardReader;
    protected $appIsOpen;
    protected $countNotAnswered;
    protected $driverAttachmentTypeId;
    protected $preAvailable;
    protected $prepaid;
    protected $last_lat;
    protected $last_lon;
    protected $rating;
    protected $addressStreet;
    protected $addressNumber;
    protected $addressCity;
    protected $addressState;
    protected $addressDistrict;
    protected $addressConfirmPicture;
    protected $addressCEP;
    protected $key_app_partner;


    public function __construct($obj = null)
    {
        $this->last_lat = $obj->latitude ?? null;
        $this->last_lon = $obj->longitude ?? null;
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status): void
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getDriverRegisterStatusId()
    {
        return $this->driverRegisterStatusId;
    }

    /**
     * @param mixed $driverRegisterStatusId
     * @return Driver
     */
    public function setDriverRegisterStatusId($driverRegisterStatusId)
    {
        $this->driverRegisterStatusId = $driverRegisterStatusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param mixed $cityId
     */
    public function setCityId($cityId): void
    {
        $this->cityId = $cityId;
    }

    /**
     * @return mixed
     */
    public function getEstateId()
    {
        return $this->estateId;
    }

    /**
     * @param mixed $estateId
     */
    public function setEstateId($estateId): void
    {
        $this->estateId = $estateId;
    }

    /**
     * @return mixed
     */
    public function getIdDriver()
    {
        return $this->idDriver;
    }

    /**
     * @param mixed $idDriver
     */
    public function setIdDriver($idDriver)
    {
        $this->idDriver = $idDriver;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getCnh()
    {
        return $this->cnh;
    }

    /**
     * @param mixed $cnh
     */
    public function setCnh($cnh)
    {
        $this->cnh = $cnh;
    }

    /**
     * @return mixed
     */
    public function getCnhPicture()
    {
        return $this->cnhPicture;
    }

    /**
     * @param $cnhPicture
     * @throws Exception
     */
    public function setCnhPicture($cnhPicture)
    {
        $photo = new Photo;

        $this->cnhPicture =
            !$cnhPicture ?
            null :
            $photo->save($cnhPicture, self::DOC_DIR, $this->userId ?? '' . 'cnh-');
    }

    public function getAddressConfirmPicture()
    {
        return $this->addressConfirmPicture;
    }

    public function setAddressConfirmPicture($addressConfirmPicture)
    {
        $photo = new Photo;
        $this->addressConfirmPicture =
            !$addressConfirmPicture ?
            null :
            $photo->save($addressConfirmPicture, self::DOC_DIR, $this->userId ?? '' . 'addressConfirm-');
    }

    /**
     * @return mixed
     */
    public function getCrlv()
    {
        return $this->crlv;
    }

    /**
     * @param mixed $crlv
     */
    public function setCrlv($crlv)
    {
        $this->crlv = $crlv;
    }

    /**
     * @return mixed
     */
    public function getCrlvPicture()
    {
        return $this->crlvPicture;
    }

    /**
     * @param $crlvPicture
     * @throws Exception
     */
    public function setCrlvPicture($crlvPicture)
    {
        $photo = new Photo;

        $this->crlvPicture =
            !$crlvPicture ?
            null :
            $photo->save($crlvPicture, self::DOC_DIR, $this->userId ?? '' . 'crlv-');
    }

    /**
     * @return mixed
     */
    public function getProfileImage()
    {
        return $this->profileImage;
    }

    /**
     * @param $profileImage
     * @throws Exception
     */
    public function setProfileImage($profileImage)
    {
        $photo = new Photo;

        $this->profileImage =
            !$profileImage ?
            null :
            $photo->save($profileImage, self::PROFILE_DIR, $this->userId ?? '');
    }

    /**
     * @return mixed
     */
    public function getProfileImageStatusId()
    {
        return $this->profileImageStatusId;
    }

    /**
     * @param mixed $profileImageStatusId
     * @return Driver
     */
    public function setProfileImageStatusId($profileImageStatusId)
    {
        $this->profileImageStatusId = $profileImageStatusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAlvara()
    {
        return $this->alvara;
    }

    /**
     * @param mixed $alvara
     * @return Driver
     */
    public function setAlvara($alvara)
    {
        $this->alvara = $alvara;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAlvaraPicture()
    {
        return $this->alvaraPicture;
    }

    /**
     * @param $alvaraPicture
     * @return $this
     * @throws Exception
     */
    public function setAlvaraPicture($alvaraPicture)
    {
        $photo = new Photo;

        $this->alvaraPicture =
            $photo->save($alvaraPicture, self::DOC_DIR, $this->userId ?? '' . 'alvara-');

        return $this;
    }

    /**
     * @return mixed
     */
    public function getCriminalRecord()
    {
        return $this->criminalRecord;
    }

    /**
     * @param $criminalRecord
     * @return $this
     * @throws Exception
     */
    public function setCriminalRecord($criminalRecord)
    {
        $this->criminalRecord = $criminalRecord;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCriminalRecordPicture()
    {
        return $this->criminalRecordPicture;
    }

    /**
     * @param $criminalRecordPicture
     * @return $this
     * @throws Exception
     */
    public function setCriminalRecordPicture($criminalRecordPicture)
    {
        $photo = new Photo;

        $this->criminalRecordPicture =
            $photo->save($criminalRecordPicture, self::DOC_DIR, $this->userId ?? '' . 'fc-');

        return $this;
    }

    /**
     * @return mixed
     */
    public function getProofOfResidence()
    {
        return $this->proofOfResidence;
    }

    /**
     * @param mixed $proofOfResidence
     * @return Driver
     * @throws Exception
     */
    public function setProofOfResidence($proofOfResidence)
    {
        $photo = new Photo;

        $this->proofOfResidence =
            $photo->save($proofOfResidence, self::DOC_DIR, $this->userId ?? '' . 'pr-');

        return $this;
    }

    /**
     * @return mixed
     */
    public function getBalanceId()
    {
        return $this->balanceId;
    }

    /**
     * @param mixed $balanceId
     * @return Driver
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getHasCardReader()
    {
        return $this->hasCardReader;
    }

    /**
     * @param mixed $hasCardReader
     * @return Driver
     */
    public function setHasCardReader($hasCardReader)
    {
        $this->hasCardReader = $hasCardReader;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAppIsOpen()
    {
        return $this->appIsOpen;
    }

    /**
     * @return mixed
     */
    public function getCountNotAnswered()
    {
        return $this->countNotAnswered;
    }

    /**
     * @param mixed $countNotAnswered
     * @return Driver
     */
    public function setCountNotAnswered($countNotAnswered)
    {
        $this->countNotAnswered = $countNotAnswered;
        return $this;
    }

    /**
     * @param mixed $appIsOpen
     * @return Driver
     */
    public function setAppIsOpen($appIsOpen)
    {
        $this->appIsOpen = $appIsOpen;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverAttachmentTypeId()
    {
        return $this->driverAttachmentTypeId;
    }

    /**
     * @param mixed $driverAttachmentTypeId
     * @return Driver
     */
    public function setDriverAttachmentTypeId($driverAttachmentTypeId)
    {
        $this->driverAttachmentTypeId = $driverAttachmentTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPreAvailable()
    {
        return $this->preAvailable;
    }

    /**
     * @param mixed $preAvailable
     * @return Driver
     */
    public function setPreAvailable($preAvailable)
    {
        $this->preAvailable = $preAvailable;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLastLat()
    {
        return $this->last_lat;
    }

    /**
     * @param mixed $last_lat
     * @return Driver
     */
    public function setLastLat($last_lat)
    {
        $this->last_lat = $last_lat;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLastLon()
    {
        return $this->last_lon;
    }

    /**
     * @param mixed $last_lon
     * @return Driver
     */
    public function setLastLon($last_lon)
    {
        $this->last_lon = $last_lon;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRating()
    {
        return $this->rating;
    }

    /**
     * @param $rating
     * @return Driver
     */
    public function setRating($rating)
    {
        $this->rating = $rating;
        return $this;
    }

    public function getAddressStreet()
    {
        return $this->addressStreet;
    }


    public function setAddressStreet($addressStreet)
    {
        $this->addressStreet = $addressStreet;
        return $this;
    }

    public function getAddressNumber()
    {
        return $this->addressStreet;
    }

    public function setAddressNumber($addressNumber)
    {
        $this->addressNumber = $addressNumber;
        return $this;
    }

    public function getAddressCity()
    {
        return $this->addressCity;
    }

    public function setAddressCity($addressCity)
    {
        $this->addressCity = $addressCity;
        return $this;
    }

    public function getAddressState()
    {
        return $this->addressState;
    }

    public function setAddressState($addressState)
    {
        $this->addressState = $addressState;
        return $this;
    }

    public function getAddressDistrict()
    {
        return $this->addressState;
    }

    public function setAddressDistrict($addressDistrict)
    {
        $this->addressDistrict = $addressDistrict;
        return $this;
    }

    public function getAddressCEP()
    {
        return $this->addressCEP;
    }

    public function setAddressCEP($addressCEP)
    {
        $this->$addressCEP = $addressCEP;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPrepaid()
    {
        return $this->prepaid;
    }

    /**
     * @param mixed $prepaid
     */
    public function setPrepaid($prepaid): void
    {
        $this->prepaid = $prepaid;
    }

    public function getAppPartnerKey()
    {
        return $this->key_app_partner;
    }

    public function setAppPartnerKey($keyAppPartner)
    {
        $this->key_app_partner = $keyAppPartner;
    }

    public function sendRecoveryCode(string $number, int $cityId = null)
    {
        $code = PhoneMessage::generateConfirmationCode();
        $phoneMessage = new PhoneMessage($number, $this->recoveryMessage . $code, null, $cityId);
        $response = [];
        $response['resultApi'] = $phoneMessage->send();
        $response['sms'] = $code;
        return $response;
    }

    public function sendRecoveryCodeWhatsApp(string $number, $code)
    {
        $phone = PhoneNumberNormalizer::toDialable($number);
        $whatsAppService = new WhatsAppService();
        $mensagem = "Olá, tudo bem? 😊\n\n" .
                    "Recebemos uma solicitação para recuperar sua senha.\n" .
                    "Seu código de verificação é: *{$code}*\n\n" .
                    "Se não foi você quem solicitou, ignore esta mensagem.";
        return $whatsAppService->handle($phone, $mensagem);
    }

    public function sendConfirmationCode($request)
    {
        $code = PhoneMessage::generateConfirmationCode();
        $cityId = isset($request->latitude) && isset($request->longitude) ? (new CityDao())->findByCoordinate($request->latitude, $request->longitude) : null;
        $phoneMessage = new PhoneMessage($request->number, $this->confirmationMessage . $code, null, $cityId->id ?? null);
        $response = [];
        $response['resultApi'] = $phoneMessage->send();
        $response['sms'] = $code;
        return $response;
    }

    public function toggleStatus()
    {
        switch ($this->status) {
            case self::AVAILABLE:
                $this->status = self::OFF;
                break;
            case self::OFF:
                $this->status = self::AVAILABLE;
                break;
        }
    }

    /**
     * @param array $deviceTokens
     * @param TripCallPushDTO|null $tripCallData Se null, mantém o texto genérico atual
     */
    public function sendTripNotifications(array $deviceTokens, ?TripCallPushDTO $tripCallData = null)
    {
        $deviceTokens = array_filter($deviceTokens);

        $notificationBuilder = new TripCallNotificationBuilder();
        $mapUtils = new MapUtils();

        $tripCallAdditionalData = $tripCallData ? [
            'tripReference'              => $tripCallData->getTripReference(),
            'estimatedTimeDriverArrival' => $mapUtils->estimateArrivalSeconds($tripCallData->getProximityKm()),
            'distanceDriverArrival'      => $mapUtils->proximityMeters($tripCallData->getProximityKm()),
            'userId'                     => $tripCallData->getUserId(),
            'tripCallTypeId'             => $tripCallData->getTripCallTypeId(),
        ] : [];

        $push = new Push();
        $push
            ->setTitle($notificationBuilder->buildTitle())
            ->setBody($notificationBuilder->buildBody($tripCallData, self::MESSAGE_PUSH_NOTIFICATION))
            ->setAdditionalData($tripCallAdditionalData)
            ->setAction(PushActionConst::OPEN_APP)
            ->setTag(PushTagConst::RIDE_REQUEST)
            ->setCollapseId(PushTagConst::RIDE_REQUEST)
            ->setCategoryId(self::TRIP_CALL_CATEGORY_ID)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setIcon(self::ICON_PUSH_NOTIFICATION)
            ->setSoundname(self::SOUND_PUSH_NOTIFICATION);

        return $push->notificationAllWithData($deviceTokens);
    }

    public function generateNullEstimative()
    {
        $estimative = new stdClass();
        $estimative->distance = 0;
        $estimative->duration = 0;

        return $estimative;
    }

    public function setProfileImagePath(string $path): void
    {
        $this->profileImage = $path;
    }

    public function setCnhPicturePath(string $path): void
    {
        $this->cnhPicture = $path;
    }

    public function setCrlvPicturePath(string $path): void
    {
        $this->crlvPicture = $path;
    }

    public function setAlvaraPicturePath(string $path): void
    {
        $this->alvaraPicture = $path;
    }

    public function setAddressConfirmPicturePath(string $path): void
    {
        $this->addressConfirmPicture = $path;
    }

    public function setCriminalRecordPicturePath(string $path): void
    {
        $this->criminalRecordPicture = $path;
    }

    public function setProofOfResidencePath(string $path): void
    {
        $this->proofOfResidence = $path;
    }
}
