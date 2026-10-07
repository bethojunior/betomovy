<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 13:20
 */

namespace App\Services\User\Doc;


use App\Constants\StatusConst;
use App\Constants\Users\DocStatusConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Constants\Users\CustomerRegisterStatusConst;
use App\Exceptions\User\Doc\DocUserException;
use App\Helpers\Config\ConfigHelper;
use App\Helpers\Config\PushConfigHelper;
use App\Models\User\Doc\DocUser;
use App\Repositories\User\Doc\DocUserRepository;
use App\Repositories\User\DriverRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\User\CustomerRepository;
use App\Utils\Push;
use App\Services\User\CustomerService;
use App\Traits\Storage\UploadsFilesToS3;
use Illuminate\Support\Facades\Log;

class DocUserService
{
    use UploadsFilesToS3;

    /**
     * @var DocUserRepository
     */
    private $repository;
    /**
     * @var DriverRepository
     */
    private $driverRepository;
    /**
     * @var ConfigHelper
     */
    private $configHelper;
    /**
     * @var PushConfigHelper
     */
    private $pushConfigHelper;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var CustomerRepository
     */
    private $customerRepository;

    private $customerService;


    public function __construct(DocUserRepository $repository,
                                DriverRepository $driverRepository,
                                ConfigHelper $configHelper,
                                PushConfigHelper $pushConfigHelper,
                                UserRepository $userRepository,
                                CustomerService $customerService,
                                CustomerRepository $customerRepository)
    {
        $this->repository = $repository;
        $this->driverRepository = $driverRepository;
        $this->configHelper = $configHelper;
        $this->pushConfigHelper = $pushConfigHelper;
        $this->userRepository = $userRepository;
        $this->customerRepository = $customerRepository;
        $this->customerService = $customerService;
    }

    public function findByUser($userId)
    {
        return $this->repository
            ->findByUser($userId);
    }

    /**
     * Cria um docUser novo ou, se já existir um ativo para o mesmo
     * usuário+tipo de documento (ex: um documento reprovado anteriormente),
     * atualiza esse registro em vez de tentar inserir uma linha duplicada.
     *
     * @param array $request
     * @return DocUser
     * @throws \Exception
     */
    public function insert(array $request)
    {
        $image = $request['image'] ?? null;
        unset($request['image']);

        $docUser = $this->repository
            ->findActiveByUserAndDoc($request['userId'], $request['docId']);

        if ($docUser) {
            $docUser->docStatusId = $request['docStatusId'];
            $docUser->image = null;
            $docUser->pdf = null;

            if (array_key_exists('text', $request)) {
                $docUser->text = $request['text'];
            }
        } else {
            $docUser = new DocUser($request);
        }

        $this->repository->save($docUser);

        if ($image) {
            $docUser->image = $this->replaceFile($image, "user/{$docUser->userId}/docs/");

            $this->repository->save($docUser);
        }

        return $this->applyDocUserStatusCascade($docUser);
    }

    /**
     * @param $id
     * @param array $request
     * @return DocUser
     * @throws \Exception
     */
    public function uploadImage($id, array $request)
    {
        $docUser = $this->repository->find($id);

        if (!$docUser)
            throw new DocUserException("Documento não encontrado");

        $docUser->image = $this->replaceFile(
            $request['image'],
            "user/{$docUser->userId}/docs/",
            $docUser->getRawOriginal('image')
        );
        $docUser->docStatusId = DocStatusConst::IN_ANALYSIS;

        $this->repository->save($docUser);

        return $this->applyDocUserStatusCascade($docUser);
    }

    /**
     * @param $id
     * @return bool
     * @throws \Exception
     */
    public function delete($id)
    {
        $docUser = $this->repository->find($id);

        $docUser->statusId = StatusConst::REMOVED;

        $this->repository->save($docUser);

        $docsUserNotApproved = $this->repository
            ->findNotApprovedByUser($docUser->userId);

        $this->updateStatusDriver(
            $docUser->userId,
            $docsUserNotApproved->isNotEmpty() ?
                DriverRegisterStatusConst::PENDING : DriverRegisterStatusConst::ACTIVE);

        return true;
    }

    /**
     * @param $id
     * @param array $request
     * @return mixed
     * @throws \Exception
     */
    public function updateStatus($id, array $request)
    {
        $docUser = $this->repository->find($id);

        if (!isset($request['docStatusId']))
            throw new DocUserException("Status do documento não informado");

        $docUser
            ->docStatusId = $request['docStatusId'];

        $this->repository->save($docUser);

        return $this->applyDocUserStatusCascade($docUser);
    }

    /**
     * Recalcula pendências do usuário e propaga a mudança de status de
     * documento para driver/customer + push. Compartilhado entre insert()
     * e updateStatus(): ambos alteram um docUser e disparam a mesma cascata.
     *
     * @param DocUser $docUser
     * @return DocUser
     * @throws \Exception
     */
    private function applyDocUserStatusCascade(DocUser $docUser)
    {
        $docsUserNotApproved = $this->repository
            ->findNotApprovedByUser($docUser->userId);

        $this->updateStatusDriver(
            $docUser->userId,
            $docsUserNotApproved->isNotEmpty() ?
                DriverRegisterStatusConst::PENDING : DriverRegisterStatusConst::ACTIVE);

        $this->updateStatusCustomer(
            $docUser->userId,
            $docsUserNotApproved->isNotEmpty() ?
                CustomerRegisterStatusConst::PENDING : CustomerRegisterStatusConst::ACTIVE);

        return $docUser;
    }

    /**
     * @param $userId
     * @param $driverRegisterStatusId
     * @return null
     * @throws \Exception
     */
    private function updateStatusDriver($userId, $driverRegisterStatusId)
    {
        $driver = $this->driverRepository
            ->findByUser($userId);

        if (!$driver)
            return null;

        if (
            $driverRegisterStatusId == DriverRegisterStatusConst::ACTIVE &&
            $driver->profileImageStatusId != DocStatusConst::APPROVED)
            return $this->sendPushNotification($userId);

        $driver->driverRegisterStatusId = $driverRegisterStatusId;

        $this->driverRepository->save($driver);

        return $this->sendPushNotification($userId);
    }

    /**
     * @param $userId
     * @return mixed
     * @throws \Exception
     */
    private function sendPushNotification($userId)
    {
        $configs = $this->configHelper->get("firebase_api_key", "app_title");
        $pushConfig = $this->pushConfigHelper->get('notify_driver_update_user_doc');

        $user = $this->userRepository->find($userId, 'deviceToken');

        list('app_title' => $app_title, 'firebase_api_key' => $firebase_api_key) = $configs;

        $pushConfig->title = str_replace('{appName}', $app_title, $pushConfig->title);

        $push = new Push();
        $push
            ->setTitle($pushConfig->title)
            ->setBody($pushConfig->message)
            ->setAction($pushConfig->action)
            ->setDeviceToken($user->deviceToken);

        return $push->sendNotificationWithData();
    }

    /**
     * @param $userId
     * @param $customerRegisterStatusId
     * @return bool
     * @throws \Exception
     */
    private function updateStatusCustomer($userId, $customerRegisterStatusId)
    {
        $customer = $this->customerRepository->findByUser($userId);

        if (!$customer)
            return false;

        if ($customerRegisterStatusId === CustomerRegisterStatusConst::ACTIVE) {
            $user = $this->userRepository->find($userId);
            $validationResult = $this->validateUserData($user, $customer);

            if ($validationResult['isValid']) {
                $this->customerService->unlock($customer->idCustomer);
            } else {
                $customer->customerRegisterStatusId = CustomerRegisterStatusConst::PENDING;
                $this->customerRepository->save($customer);
            }
        } else {
            $customer->customerRegisterStatusId = $customerRegisterStatusId;
            $this->customerRepository->save($customer);
        }

        return true;
    }

    /**
     * Validar se dados pessoais do usuário estão completos
     * @param $user
     * @param $customer
     * @return array
     */
    private function validateUserData($user, $customer)
    {
        $missingFields = [];

        if (empty($user->document)) {
            $missingFields[] = 'document';
        }

        if (empty($user->name)) {
            $missingFields[] = 'name';
        }

        if (empty($user->email)) {
            $missingFields[] = 'email';
        }

        if (empty($user->phone)) {
            $missingFields[] = 'phone';
        }

        return [
            'isValid' => empty($missingFields),
            'missingFields' => $missingFields
        ];
    }
}
