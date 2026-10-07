<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/09/2019
 * Time: 15:33
 */

namespace App\Services\Driver;


use App\Constants\Push\PushActionConst;
use App\Constants\Users\DocStatusConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Helpers\Config\ConfigHelper;
use App\Models\User\Driver;
use App\Repositories\User\Doc\DocUserRepository;
use App\Repositories\User\DriverRepository;
use App\Utils\Push;
use Exception;
use Illuminate\Support\Facades\Storage;

class UpdateProfileImageService
{
    /**
     * @var DriverRepository
     */
    private $repository;
    /**
     * @var ConfigHelper
     */
    private $helper;
    /**
     * @var DocUserRepository
     */
    private $docUserRepository;

    public function __construct(DriverRepository $repository,
                                DocUserRepository $docUserRepository,
                                ConfigHelper $helper)
    {

        $this->repository = $repository;
        $this->helper = $helper;
        $this->docUserRepository = $docUserRepository;
    }

    /**
     * @param $driverId
     * @return bool
     * @throws \Exception
     */
    public function authorize($driverId)
    {
        /** @var Driver $driver */
        $driver = $this->repository
            ->find($driverId);

        if (!$driver->profileImageTemp)
            throw new \Exception("O motorista não possui foto a ser aprovada");

        // PALIATIVO: Verificando arquivo pois da primeira vez ele fala que não existe.
        $this->verifyFile($driver->profileImageTemp);

        Storage::disk('s3')
            ->delete(
                'driver/profile/'.$driver->profileImage,
                'driver/profile/compressed/'.$driver->profileImage);

        Storage::disk('s3')
            ->move(
                'driver/profile/temp/'.$driver->profileImageTemp,
                'driver/profile/'.$driver->profileImageTemp);   

        Storage::disk('s3')
            ->move(
                'driver/profile/temp/compressed/'.$driver->profileImageTemp,
                'driver/profile/compressed/'.$driver->profileImageTemp);

        $driver
            ->profileImage = $driver->profileImageTemp;
        $driver
            ->profileImageTemp = null;
        $driver
            ->profileImageStatusId = DocStatusConst::APPROVED;

        $this->repository
            ->save($driver);

        $docsUserNotApproved = $this->docUserRepository
            ->findNotApprovedByUser($driver->userId);

        if ($docsUserNotApproved->isEmpty())
            $this->updateDriverRegister($driver, DriverRegisterStatusConst::ACTIVE);

        $this->notify(
            $driver->user->deviceToken,
            'FOTO DO PERFIL AUTORIZADA',
            'Sua foto do perfil foi alterada após análise interna!');

        return true;
    }

    private function verifyFile($fileName)
    {
        try {
            Storage::disk('s3')
                ->exists('driver/profile/temp/'.$fileName);
    
            Storage::disk('s3')
                ->exists('driver/profile/temp/compressed/'.$fileName);
        } catch (Exception $e){
            return;
        }
    }

    /**
     * @param $driverId
     * @return bool
     * @throws \Exception
     */
    public function deny($driverId)
    {
        /** @var Driver $driver */
        $driver = $this->repository
            ->find($driverId);

        if (!$driver->profileImageTemp)
            throw new \Exception("O motorista não possui foto a ser aprovada");

        Storage::disk('s3')
            ->delete(
                'driver/profile/temp/'.$driver->profileImageTemp,
                'driver/profile/temp/compressed/'.$driver->profileImageTemp);

        $driver
            ->profileImageTemp = null;
        $driver
            ->profileImageStatusId = DocStatusConst::REPROVED;

        $this->repository
            ->save($driver);

        $this->notify(
            $driver,
            'ALTERAÇÃO DA FOTO DE PERFIL NEGADA ',
            'Sua foto do perfil não foi autorizada, caso ainda queira alterar, envie outra foto!');

        return true;
    }

    /**
     * @param array $request
     * @param $driverId
     * @return bool
     * @throws \Exception
     */
    public function requestNewPicture(array $request, $driverId)
    {
        /** @var Driver $driver */
        $driver = $this->repository
            ->find($driverId);

        $driver
            ->profileImageStatusId = DocStatusConst::REPROVED;
        $driver
            ->profileImageTemp = null;

        if (isset($request['blockDriver']))
            $driver
                ->driverRegisterStatusId = $request['blockDriver'] ?
                    DriverRegisterStatusConst::PENDING : $driver->driverRegisterStatusId;

        $this->repository
            ->save($driver);

        $this->notify(
            $driver->user->deviceToken,
            'NOVA FOTO DO PERFIL FOI SOLICITADA',
            'Sua foto do perfil está sendo requisitada novamente!');

        return true;
    }

    /**
     * @param $deviceToken
     * @param $title
     * @param $message
     * @return mixed
     * @throws \Exception
     */
    private function notify($deviceToken, $title, $message)
    {
        $push = new Push(
            $this->helper->get('firebase_api_key'));

        $push
            ->setTitle($title)
            ->setBody($message)
            ->setAction(PushActionConst::UPDATE_STATUS_DOCUMENTS)
            ->setDeviceToken($deviceToken);

        return $push->sendNotificationWithData();
    }

    private function updateDriverRegister(Driver $driver, int $driverRegisterStatusId): Driver
    {
        $driver->driverRegisterStatusId = $driverRegisterStatusId;

        $this->repository->save($driver);

        return $driver;
    }
}
