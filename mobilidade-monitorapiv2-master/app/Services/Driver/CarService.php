<?php


namespace App\Services\Driver;


use App\Constants\Push\PushActionConst;
use App\Constants\StatusConst;
use App\Constants\Users\DocStatusConst;
use App\Helpers\Config\ConfigHelper;
use App\Models\User\Doc\Doc;
use App\Models\User\Driver\Car;
use App\Repositories\User\Doc\DocUserRepository;
use App\Repositories\User\Driver\CarRepository;
use App\Utils\Push;
use Illuminate\Support\Facades\DB;

class CarService
{
    private const VEHICLE_DOCUMENT_LABEL = 'CRLV';

    /** @var CarRepository */
    private $repository;
    /** @var DocUserRepository */
    private $docUserRepository;
    private $helper;

    /**
     * CarService constructor.
     * @param CarRepository $repository
     * @param DocUserRepository $docUserRepository
     */
    public function __construct(
        CarRepository $repository,
        DocUserRepository $docUserRepository,
        ConfigHelper $helper
    ) {
        $this->repository = $repository;
        $this->docUserRepository = $docUserRepository;
        $this->helper = $helper;
    }

    public function edit(int $id, array $request)
    {
        $car = Car::findOrFail($id);

        $car->year = $request['year'] ?? $car->year;
        $car->plate = $request['plate'] ?? $car->plate;
        $car->model = $request['model'] ?? $car->model;
        $car->color = $request['color'] ?? $car->color;
        $car->brand = $request['brand'] ?? $car->brand;
        $car->renavam = $request['renavam'] ?? $car->renavam;
        $car->seatsNumber = $request['seatsNumber'] ?? $car->seatsNumber;
        $car->save();

        return $car;
    }

    public function getPendingCars($cityId)
    {
        return $this->repository->getPendingCars($cityId);
    }

    public function acceptCar(array $request)
    {
        DB::beginTransaction();

        $car = Car::find($request['id']);
        if (!$car)
            throw new \Exception('Carro não encontrado');

        $this->deleteOldCar($car->driverId, $request['id']);
        $car->pending = 0;
        $car->save();

        if ($car->document) {
            $this->replaceDriverVehicleDocument($car);
        }

        DB::commit();

        $this->notify($car->driver->user->deviceToken,
            "Alteração de veículo aceita",
            'Sua solicitação de mudança de veículo foi aceita pelo aplicativo.');
        return $car;
    }

    /**
     * Substitui o CRLV ativo do motorista pelo documento anexado na
     * solicitação de troca de veículo já aprovada.
     */
    private function replaceDriverVehicleDocument(Car $car)
    {
        $vehicleDocId = Doc::where('label', self::VEHICLE_DOCUMENT_LABEL)->value('id');

        if (!$vehicleDocId)
            return;

        $userId = $car->driver->userId;

        $docUser = $this->docUserRepository->findActiveByUserAndDoc($userId, $vehicleDocId)
            ?? $this->docUserRepository->create([
                'userId' => $userId,
                'docId' => $vehicleDocId,
            ]);

        $docUser->statusId = StatusConst::ACTIVE;
        $docUser->image = $car->getRawOriginal('document');
        $docUser->docStatusId = DocStatusConst::APPROVED;
        $docUser->save();
    }

    public function rejectCar(array $request)
    {
        $car = Car::find($request['id']);
        if (!$car)
            throw new \Exception('Carro não encontrado');

        $car->pending = 0;
        $car->save();
        $car->delete();

        $this->notify($car->driver->user->deviceToken,
            "Alteração de veículo recusada",
            'Sua solicitação de mudança de veículo foi recusada pelo aplicativo.');

        return $car;
    }

    private function deleteOldCar($driverId, $newIdCar)
    {
        $oldCar = Car::query()->where('driverId', '=', $driverId)
            ->where(function ($query) {
                $query->where('pending', 0)
                    ->orWhereRaw('pending IS NULL');
            })
            ->first();

        if (!isset($oldCar)) {
            return null;
        }

        if ($oldCar->idCar == $newIdCar)
            throw new \Exception("Carro já foi aceito pelo sistema");

        $oldCar->delete();

        return $oldCar;
    }


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
}
