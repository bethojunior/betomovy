<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 16:07
 */

namespace App\Services\User;


use App\Constants\Import\CustomerExampleImport;
use App\Constants\Users\CustomerRegisterStatusConst;
use App\Exports\Report\ReportDefaultAutoSizeExport;
use App\Helpers\Config\ConfigHelper;
use App\Helpers\Config\PushConfigHelper;
use App\Models\User\Customer;
use App\Models\User\User;
use App\Repositories\User\CustomerRepository;
use App\Repositories\User\DependentUserRepository;
use App\Repositories\User\Doc\DocUserRepository;
use App\Repositories\User\PendencyField\PendencyFieldRepository;
use App\Repositories\User\UserRepository;
use App\Services\Zafira\ZafiraService;
use App\Services\Zafira\ZafiraValidateRequest;
use App\Services\Zafira\ZafiraWhatsAppNotificationService;
use App\Traits\HasZafiraFieldsComparisonTrait;
use App\Utils\Push;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    use HasZafiraFieldsComparisonTrait;

    /**
     * @var CustomerRepository
     */
    private $repository;
    /**
     * @var PushConfigHelper
     */
    private $pushConfigHelper;
    /**
     * @var ConfigHelper
     */
    private $configHelper;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var PendencyFieldRepository
     */
    private $pendencyFieldRepository;
    /**
     * @var ZafiraService
     */
    private $zafiraService;

    public function __construct(CustomerRepository      $repository,
                                PushConfigHelper        $pushConfigHelper,
                                ConfigHelper            $configHelper,
                                UserRepository          $userRepository,
                                PendencyFieldRepository $pendencyFieldRepository,
                                ZafiraService           $zafiraService)
    {
        $this->repository = $repository;
        $this->pushConfigHelper = $pushConfigHelper;
        $this->configHelper = $configHelper;
        $this->userRepository = $userRepository;
        $this->pendencyFieldRepository = $pendencyFieldRepository;
        $this->zafiraService = $zafiraService;
    }

    public function findAll(array $data, $cityId = null)
    {
        return $this->repository->findAll(Auth::user(), $data, $cityId);
    }

    public function show(int $id)
    {
        $customer = $this->repository->show($id);
        $customer->docs = (new DocUserRepository())->findByUser($customer->idUser);
        $customer->dependents = $this->userRepository->getDependents($customer->idUser);
        $customer->responsible = $this->userRepository->getResponsible($customer->idUser);

        // Mantém profileImage como nome do arquivo; profileImageLink já vem do repositório
        return $customer;
    }

    public function edit(int $id, array $request)
    {
        if (isset($request['email']) && ($this->repository->quantityCustomersWithEmail($request['email'], $id) != 0))
            throw new \Exception("O campo email já está sendo utilizado");
        if (isset($request['phone']) && ($this->repository->quantityCustomersWithPhone($request['phone'], $id) != 0))
            throw new \Exception("O campo telefone já está sendo utilizado");
        if (isset($request['document']) && ($this->repository->quantityCustomersWithDocument($request['document'], $id) != 0))
            throw new \Exception("O campo documento já está sendo utilizado");

        $customer = Customer::findOrFail($id);
        $user = User::findOrFail($customer->userId);

        if ($this->hasZafiraFieldsChanged($user, $request)) {
            $user->zafiraValidated = 0;
        }

        $user->name = $request['name'] ?? $user->name;
        $user->email = $request['email'] ?? $user->email;
        $user->phone = $request['phone'] ?? $user->phone;
        $user->document = $request['document'] ?? $user->document;
        $user->dateOfBirth = $request['dateOfBirth'] ?? $user->dateOfBirth;
        $user->gender = $request['gender'] ?? $user->gender;

        if (isset($request['password']) && $request['password']) {
            $user->password = base64_encode($request['password']);
        }
        $user->save();

        return $user;
    }

    /**
     * @param $customerId
     * @return mixed
     * @throws Exception
     */
    public function unlock($customerId)
    {
        /** @var Customer $customer */
        $customer = $this->repository->find($customerId);

        $customer->customerRegisterStatusId = CustomerRegisterStatusConst::ACTIVE;

        $this->repository->save($customer);

        $this->pendencyFieldRepository->disableAllByUser($customer->userId);

        /** @var User $user */
        $user = $this->userRepository->find($customer->userId);

        return $this->sendPush($user, 'notify_customer_released');
    }

    public function findExampleToImport()
    {
        return [new ReportDefaultAutoSizeExport(CustomerExampleImport::model), 'modelo-cliente'];
    }

    /**
     * @param User $user
     * @param string $pushConfigKey
     * @return mixed
     * @throws Exception
     */
    private function sendPush(User $user, string $pushConfigKey)
    {
        if (!$user->deviceToken)
            return ['message' => 'Push não enviado'];

        $pushConfig = $this->pushConfigHelper->get($pushConfigKey);

        $configs =
            $this->configHelper->get('app_title', 'firebase_api_key');

        list('app_title' => $app_title, 'firebase_api_key' => $firebase_api_key) = $configs;

        $pushConfig->title = str_replace('{appName}', $app_title, $pushConfig->title);
        $pushConfig->message = str_replace('{appName}', $app_title, $pushConfig->message);

        $push = new Push;
        $push
            ->setTitle($pushConfig->title)
            ->setBody($pushConfig->message)
            ->setMessage($pushConfig->message)
            ->setAction($pushConfig->action);

        return $push->sendNotification($user->deviceToken);
    }

    public function findAllLocation($cityId)
    {
        return $this->repository->findAllLocation($cityId);
    }

    public function findAllCentralCustomers(array $request = [])
    {
        return $this->repository->findAllCentralCustomers($request);
    }

    public function block($customerId)
    {
        /** @var Customer $customer */
        $customer = $this->repository->find($customerId);

        $customer->customerRegisterStatusId = CustomerRegisterStatusConst::BLOCKED;

        $this->repository->save($customer);

        /** @var User $user */
        $user = $this->userRepository->find($customer->userId);

        return $this->sendPush($user, 'notify_customer_released');
    }

    public function validateRegistration(int $customerId): array
    {
        $data = $this->repository->show($customerId);
        if (!$data) {
            throw new \Exception('Cliente não encontrado.');
        }

        $zafiraEnabled = DB::table('cityConfig')
            ->where('cityId', $data->cityId)
            ->value('enableZafiraValidationMonitor');

        if (!$zafiraEnabled) {
            throw new \Exception('A validação Zafira não está habilitada para a cidade deste cliente.');
        }

        $request = ZafiraValidateRequest::from($data);

        return $this->zafiraService->validateAndPersist(
            $data->idUser,
            $request,
            ZafiraWhatsAppNotificationService::RECIPIENT_TYPE_CUSTOMER
        );
    }
}
