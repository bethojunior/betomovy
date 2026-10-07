<?php


namespace app\services;

use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\CustomerConst;
use app\constant\CustomerRegisterStatusConst;
use app\constant\DriverRegisterStatusConst;
use app\constant\GenderConst;
use app\constant\PendencyFieldStatusConst;
use app\constant\PendencyFieldTypeConst;
use app\constant\RemoveAccountRequestTypeConst;
use app\constant\UserGroupConst;
use app\dao\AdminNotificationDao;
use app\dao\AdminNotificationTypeDao;
use app\dao\CustomerDao;
use app\dao\DriverDao;
use app\dao\PendencyFieldDao;
use app\dao\RemoveAccountRequestDao;
use app\dao\UserDao;
use app\exceptions\CpfCnpjApiException;
use app\utils\CpfCnpjApi;
use app\model\Config;
use Exception;
use app\model\RemoveAccountRequest;
use app\model\User;

class UserService
{
    /**
     * @var UserDao
     */
    private $dao;
    /**
     * @var CustomerDao
     */
    private $customerDao;
    /**
     * @var DriverDao
     */
    private $driverDao;
    /**
     * @var PendencyFieldDao
     */
    private $pendencyFieldDao;
    private $adminNotificationTypeDao;
    private $userDao;
    private $removeAccountRequestDao;

    public function __construct()
    {
        $this->dao = new UserDao;
        $this->customerDao = new CustomerDao;
        $this->driverDao = new DriverDao;
        $this->pendencyFieldDao = new PendencyFieldDao;
        $this->adminNotificationTypeDao = new AdminNotificationTypeDao;
        $this->userDao = new UserDao;
        $this->removeAccountRequestDao = new RemoveAccountRequestDao;
    }

    /**
     * @param $userId
     * @param array $photos
     * @param array $data
     * @return bool
     * @throws Exception
     */
    public function updateCustomerDocs($userId, array $photos, array $data)
    {
        if (empty($photos) && empty($data))
            throw new Exception("Nenhuma imagem foi enviada");

        $user = $this->dao->find($userId);

        $user = new User($user);
        $set = [];
        $errors = [];

        if (isset($photos['rgFrontPicture'])) {
            $user->setRgFrontPicture($photos['rgFrontPicture'], CustomerConst::DOC_IMAGE_DIR);
            $set += ['rgFrontPicture' => $user->getRgFrontPicture()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::RG_FRONT_PICTURE,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (isset($photos['rgBackPicture'])) {
            $user->setRgBackPicture($photos['rgBackPicture'], CustomerConst::DOC_IMAGE_DIR);
            $set += ['rgBackPicture' => $user->getRgBackPicture()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::RG_BACK_PICTURE,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (isset($data['rg'])) {
            $user->setRg($data['rg']);
            $set += ['rg' => $user->getRg()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::RG,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (isset($data['document'])) {
            $user->setDocument($data['document']);

            $set += ['document' => $user->getDocument()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::DOCUMENT,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
            $set += ['phone' => $user->getPhone()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::PHONE,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (!empty($set))
            $this->dao->update($set, $userId);

        $customer = $this->customerDao->findByUser($userId);

        if (isset($photos['profileImage'])) {
            try {
                $this->customerDao->updateProfileImage($customer->idCustomer, $photos['profileImage']);

                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::PROFILE_IMAGE,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

        $adminNotificationType = $this->adminNotificationTypeDao
            ->find(AdminNotificationTypeConst::NEW_DOCUMENT_SENT);

        $user = $this->userDao->find($userId, ['idUser', 'name']);

        $message = str_replace('{userName}', $user->name, $adminNotificationType->defaultMessage);

        $adminNotification = new AdminNotification();
        $adminNotification
            ->setUserId($userId)
            ->setIp($ip)
            ->setAdminNotificationTypeId(AdminNotificationTypeConst::NEW_DOCUMENT_SENT)
            ->setLat($request->lat ?? null)
            ->setLng($request->lng ?? null)
            ->setUserGroupId(UserGroupConst::CLIENT)
            ->setMessage($message)
            ->setTitle($adminNotificationType->name)
            ->setTripReference($trip->tripReference ?? null)
            ->setEmergencyMonitoringTypeId($request->emergencyMonitoringTypeId ?? null)
            ->setCityId($trip->cityId ?? $driver->cityId ?? null)
            ->setId(
                (new AdminNotificationDao)
                    ->sqlInsert($adminNotification));

        return $this->customerDao
            ->updateCustomerStatus($customer->idCustomer, CustomerRegisterStatusConst::PENDING);
    }

    public function updateCustomerPhotosRG($userId, array $photos)
    {
        if (empty($photos))
            throw new Exception("Nenhuma imagem foi enviada");

        $user = $this->dao->find($userId);

        $user = new User($user);
        $set = [];
        $errors = [];

        if (isset($photos['rgFrontPicture'])) {
            $user->setRgFrontPicture($photos['rgFrontPicture'], CustomerConst::DOC_IMAGE_DIR);
            $set += ['rgFrontPicture' => $user->getRgFrontPicture()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::RG_FRONT_PICTURE,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (isset($photos['rgBackPicture'])) {
            $user->setRgBackPicture($photos['rgBackPicture'], CustomerConst::DOC_IMAGE_DIR);
            $set += ['rgBackPicture' => $user->getRgBackPicture()];
            try {
                $this->pendencyFieldDao->updateStatusFieldByUser(
                    $userId,
                    PendencyFieldTypeConst::RG_BACK_PICTURE,
                    PendencyFieldStatusConst::IN_ANALYSIS);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (!empty($set))
            $this->dao->update($set, $userId);

        $customer = $this->customerDao->findByUser($userId);

        return $this->customerDao
            ->updateCustomerStatus($customer->idCustomer, CustomerRegisterStatusConst::PENDING);
    }

    public function getQuantityTrips($idUser): int
    {
        return $this->dao->sqlRawSelect(/** @lang sql */"
            SELECT COUNT(idTrip) AS quantityTrips
            FROM trip
            WHERE status = 'finished'
              AND (
                userId = :userId
                OR centralCustomerId IN (SELECT id FROM centralCustomer WHERE userId = :userId)
              );
        ", [':userId' => $idUser])->first()->quantityTrips;
    }

    public function updateQuantityTrips($idUser)
    {
        return $this->dao->sqlUpdate(
            ['quantityTrips' => ':quantityTrips'],
            [['idUser', '=', ':idUser']],
            [':idUser' => $idUser, ':quantityTrips' => $this->getQuantityTrips($idUser)]
        );
    }

    public function changeProfile($userId, $photo)
    {
        $isDriver = $this->dao->sqlRawSelect(/** @lang sql */"
            select isDriver
            from user
                inner join levelAccess lA on user.idUser = lA.userId
                inner join userType uT on lA.userTypeId = uT.idUserType
            where idUser = :userId;
        ", [':userId' => $userId])->get(false)->isDriver;

        if (!$isDriver) {
            $customerDao = new CustomerDao();
            $customer = $customerDao->findByUser($userId);
            return $customerDao->updateProfileImage($customer->idCustomer, $photo);
        }

        $driverDao = new DriverDao();
        $driver = $driverDao->findByUserId($userId);

        if (!$driver)
            throw new Exception("Usuário não encontrado");

        return $driverDao->editNewProfileImage($driver->idDriver, $photo);
    }

    public function validateNameAndSetGender(User $user, int $cityId): ?User
    {
        if (!$user->getDocument()) {
            throw new Exception("Usuário está com o cpf vazio");
        }

        $updateUser = [];

        $userData = (new CpfCnpjApi($cityId))->cpfQuery($user->getDocument());

        if (!$userData) {
            throw new Exception("Documento inválido");
        }

        switch ($userData->genero) {
            case GenderConst::MALE:
                $updateUser['gender'] = GenderConst::DB_MALE;
                $user->setGender(GenderConst::DB_MALE);
                break;
            case GenderConst::FEMALE:
                $updateUser['gender'] = GenderConst::DB_FEMALE;
                $user->setGender(GenderConst::DB_FEMALE);
                break;
            default:
                break;
        }

        $updateUser['isValidDocument'] = str_replace(' ', '', strtolower($user->getName())) === str_replace(' ', '', strtolower($userData->nome)) ? 1 : 0;

        $user->setIsValidDocument($updateUser['isValidDocument']);
        $this->dao->update($updateUser, $user->getIdUser());

        if (!$user->getIsValidDocument()) {
            throw new CpfCnpjApiException(1622);
        }

        return $user;
    }

    public function removeAccountRequest($userId, object $data): bool
    {
        $getTypeAndPlatform = $this->userDao->findWithUserType($userId);
        $ip = $_SERVER['REMOTE_ADDR'];

        // verifica se o usario já tem registro na tabela de solicitações de remoção de conta
        $checkRemoveAccountRequest = $this->removeAccountRequestDao->find($userId);
        if ($checkRemoveAccountRequest) {
            throw new Exception("Usuário já possui uma solicitação de remoção de conta");
        }

        // Deixa o usuario como pendente
        $customer = $this->customerDao->findByUserForTrip($userId);

        if($customer) {
            $this->customerDao->updateCustomerStatus($customer->idCustomer, CustomerRegisterStatusConst::BLOCKED);
        } else {
            $this->driverDao->updateDriverRegisterUserId($userId, DriverRegisterStatusConst::BLOCKED);
        };

        // Desloga o usuário
        $user = $this->dao->find($userId);

        // Verifica se Exclui diretamente ou Envia solicitação para o Monitor
        $this->dao->update(['api_token' => null], $userId);
        if (!(bool)Config::get('enable_account_deletion_request')) {
            $this->dao->update(['statusId' => 2], $userId);
        }

        $adminNotificationType = $this->adminNotificationTypeDao
            ->find(AdminNotificationTypeConst::REMOVE_ACCOUNT_USER);

        $message = str_replace('{userName}', $user->name, $adminNotificationType->defaultMessage);

        // Gerar a Notificação para o Adminstrador
        $adminNotification = new AdminNotification();
        $adminNotification
            ->setUserId($userId)
            ->setIp($ip)
            ->setAdminNotificationTypeId(AdminNotificationTypeConst::REMOVE_ACCOUNT_USER)
            ->setLat($request->lat ?? null)
            ->setLng($request->lng ?? null)
            ->setUserGroupId(UserGroupConst::CLIENT)
            ->setMessage($message)
            ->setTitle($adminNotificationType->name)
            ->setTripReference($trip->tripReference ?? null)
            ->setEmergencyMonitoringTypeId($request->emergencyMonitoringTypeId ?? null)
            ->setCityId($trip->cityId ?? $driver->cityId ?? null)
            ->setId(
                (new AdminNotificationDao)
                    ->sqlInsert($adminNotification));

        // Salvar os dados da solicitação de remoção de conta
        $removeAccountRequest = new RemoveAccountRequest();
        $removeAccountRequest->setUserId($userId);
        $removeAccountRequest->setUserIdWhoDeleted($data->userIdWhoDeleted ?? null);
        $removeAccountRequest->setCityId($user->cityId ?? null);
        $removeAccountRequest->setType($getTypeAndPlatform->isDriver == 1 ? RemoveAccountRequestTypeConst::DRIVER : RemoveAccountRequestTypeConst::CUSTOMER);
        $removeAccountRequest->setReason($data->reason ?? '');
        $removeAccountRequest->setDetails($data->details ?? '');
        $removeAccountRequest->setIp($ip ?? null);
        $removeAccountRequest->setPlatform($getTypeAndPlatform->platform ?? null);
        $removeAccountRequest->setCreatedAt(now());
        $removeAccountRequest->setId(
            $this->removeAccountRequestDao->sqlInsert($removeAccountRequest)
        );

        return true;
    }
}