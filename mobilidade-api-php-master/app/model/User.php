<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\Photo;

/**
 * Created by PhpStorm.
 * User: eduar
 * Date: 22/06/2018
 * Time: 11:54
 */
class User extends BaseModel
{
    const STATUS_ATIVO = 1;

    protected $idUser;
    protected $name;
    protected $nickname;
    protected $document;
    protected $phone;
    protected $email;
    protected $dateOfBirth;
    protected $password;
    protected $bankAccountId;
    protected $rg;
    protected $rgFrontPicture;
    protected $rgBackPicture;
    protected $statusId;
    protected $gender;
    protected $deviceToken;
    protected $created_at;
    protected $updated_at;
    protected $api_token;
    protected $blocked;
    protected $platform;
    protected $facebook_id;
    protected $google_id;
    protected $cityId;
    protected $cooperativeId;
    protected $franchiseId;
    protected $registered_in;
    protected $isValidDocument;
    protected $key_app_partner;

    public function __construct($obj = null, $userTypeId = null)
    {
        if (!empty($obj)) {
            $obj->password = isset($obj->password) ? base64_encode($obj->password) : null;
            $obj->userTypeId = empty($obj->userTypeId) ? $userTypeId : $obj->userTypeId;
        }

        $this->updated_at = $obj->updated_at ?? now();
        $this->created_at = $obj->created_at ?? now();

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdUser()
    {
        return $this->idUser;
    }

    /**
     * @param mixed $idUser
     * @return User
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     * @return User
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNickname()
    {
        return $this->nickname;
    }

    /**
     * @param mixed $nickname
     * @return User
     */
    public function setNickname($nickname)
    {
        $this->nickname = $nickname;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param mixed $document
     * @return User
     */
    public function setDocument($document)
    {
        $this->document = $document;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param mixed $phone
     * @return User
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDateOfBirth()
    {
        return $this->dateOfBirth;
    }

    /**
     * @param mixed $dateOfBirth
     * @return User
     */
    public function setDateOfBirth($dateOfBirth)
    {
        $this->dateOfBirth = $dateOfBirth;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = base64_encode($password);
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBankAccountId()
    {
        return $this->bankAccountId;
    }

    /**
     * @param mixed $bankAccountId
     * @return User
     */
    public function setBankAccountId($bankAccountId)
    {
        $this->bankAccountId = $bankAccountId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRg()
    {
        return $this->rg;
    }

    /**
     * @param mixed $rg
     * @return User
     */
    public function setRg($rg)
    {
        $this->rg = $rg;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRgFrontPicture()
    {
        return $this->rgFrontPicture;
    }

    /**
     * @param mixed $rgFrontPicture
     * @param null $dir
     * @return User
     * @throws Exception
     */
    public function setRgFrontPicture($rgFrontPicture, $dir = null)
    {
        $photo = new Photo;

        $this->rgFrontPicture =
            $photo->save($rgFrontPicture, $dir, $this->userId ?? '' . 'rfp-');

        return $this;
    }

    /**
     * @return mixed
     */
    public function getRgBackPicture()
    {
        return $this->rgBackPicture;
    }

    /**
     * @param mixed $rgBackPicture
     * @param null $dir
     * @return User
     * @throws Exception
     */
    public function setRgBackPicture($rgBackPicture, $dir = null)
    {
        $photo = new Photo;

        $this->rgBackPicture =
            $photo->save($rgBackPicture, $dir, $this->userId ?? '' . 'rbp-');

        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return User
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * @param mixed $gender
     * @return User
     */
    public function setGender($gender)
    {
        $this->gender = $gender;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDeviceToken()
    {
        return $this->deviceToken;
    }

    /**
     * @param mixed $deviceToken
     * @return User
     */
    public function setDeviceToken($deviceToken)
    {
        $this->deviceToken = $deviceToken;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return User
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return User
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getApiToken()
    {
        return $this->api_token;
    }

    /**
     * @param mixed $api_token
     * @return User
     */
    public function setApiToken($api_token)
    {
        $this->api_token = $api_token;
        return $this;
    }

    /**
     * @return mixed
     */
    public function isBlocked()
    {
        return $this->blocked;
    }

    /**
     * @param mixed $blocked
     * @return User
     */
    public function setBlocked($blocked)
    {
        $this->blocked = $blocked;
        return $this;
    }

    /**
     * @return ?string
     */
    public function getPlatform(): ?string
    {
        return $this->platform;
    }

    /**
     * @param string $platform
     * @return User
     */
    public function setPlatform($platform)
    {
        $this->platform = $platform;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFacebookId()
    {
        return $this->facebook_id;
    }

    /**
     * @param mixed $facebook_id
     * @return User
     */
    public function setFacebookId($facebook_id)
    {
        $this->facebook_id = $facebook_id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getGoogleId()
    {
        return $this->google_id;
    }

    /**
     * @param mixed $google_id
     * @return User
     */
    public function setGoogleId($google_id)
    {
        $this->google_id = $google_id;
        return $this;
    }

    public function getCityId()
    {
        return $this->cityId;
    }

    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCooperativeId()
    {
        return $this->cooperativeId;
    }

    /**
     * @param mixed $cooperativeId
     * @return User
     */
    public function setCooperativeId($cooperativeId)
    {
        $this->cooperativeId = $cooperativeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFranchiseId()
    {
        return $this->franchiseId;
    }

    /**
     * @param mixed $franchiseId
     * @return User
     */
    public function setFranchiseId($franchiseId)
    {
        $this->franchiseId = $franchiseId;
        return $this;
    }

    public function getRegisteredIn()
    {
        return $this->registered_in;
    }

    public function setRegisteredIn(string $registered_in): User
    {
        $this->registered_in = $registered_in;
        return $this;
    }

    public function getIsValidDocument(): ?bool
    {
        return $this->isValidDocument;
    }

    public function setIsValidDocument(?bool $isValidDocument): User
    {
        $this->isValidDocument = $isValidDocument;
        return $this;
    }

    public function setRgFrontPicturePath(string $path): void
    {
        $this->rgFrontPicture = $path;
    }

    public function setRgBackPicturePath(string $path): void
    {
        $this->rgBackPicture = $path;
    }

    public function getAppPartnerKey()
    {
        return $this->key_app_partner;
    }

    public function setAppPartnerKey(string $keyAppPartner)
    {
        $this->key_app_partner = $keyAppPartner;
        return $this;
    }
}
