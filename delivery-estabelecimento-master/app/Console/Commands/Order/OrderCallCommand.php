<?php

namespace App\Console\Commands\Order;

use Api\Repositories\Order\DeliveryOrderRepository;
use Common\Constants\DeliveryOrderStatusConstant;
use Common\Constants\DriverCalledConstant;
use Common\Helpers\Config\DeliveryCallConfigHelper;
use Common\Helpers\Config\PushConfigHelper;
use Common\Models\Driver\DriverCalled;
use Common\Models\Driver\DriversCloseDeliveryOrder;
use Common\Models\Order\DeliveryOrder;
use Common\Realtimes\Order\OrderRealtime;
use Common\Repositories\Driver\DriverCalledRepository;
use Common\Repositories\DriversCloseDeliveryOrderRepository;
use Common\Utils\Push;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Inspiring;

class OrderCallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:call {deliveryOrder}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Realizar chamado de um pedido';
    /**
     * @var PushConfigHelper
     */
    private $pushConfigHelper;
    /**
     * @var Push
     */
    private $push;
    /**
     * @var OrderRealtime
     */
    private $orderRealtime;
    /**
     * @var DriversCloseDeliveryOrderRepository
     */
    private $driversCloseDeliveryOrderRepository;
    /**
     * @var array
     */
    private $deliveryCallConfig;
    /**
     * @var DeliveryOrderRepository
     */
    private $deliveryOrderRepository;
    /**
     * @var DriverCalledRepository
     */
    private $driverCalledRepository;
    /**
     * @var DeliveryCallConfigHelper
     */
    private $deliveryCallConfigHelper;

    /**
     * Create a new command instance.
     *
     * @param DriversCloseDeliveryOrderRepository $driversCloseDeliveryOrderRepository
     * @param DeliveryOrderRepository $deliveryOrderRepository
     * @param DriverCalledRepository $driverCalledRepository
     * @param PushConfigHelper $pushConfigHelper
     * @param DeliveryCallConfigHelper $deliveryCallConfigHelper
     * @param OrderRealtime $orderRealtime
     * @param Push $push
     */
    public function __construct(DriversCloseDeliveryOrderRepository $driversCloseDeliveryOrderRepository,
                                DeliveryOrderRepository $deliveryOrderRepository,
                                DriverCalledRepository $driverCalledRepository,
                                PushConfigHelper $pushConfigHelper,
                                DeliveryCallConfigHelper $deliveryCallConfigHelper,
                                OrderRealtime $orderRealtime,
                                Push $push)
    {
        parent::__construct();
        $this->pushConfigHelper = $pushConfigHelper;

        $this->deliveryCallConfigHelper = $deliveryCallConfigHelper;

        $this->orderRealtime = $orderRealtime;

        $this->driversCloseDeliveryOrderRepository = $driversCloseDeliveryOrderRepository;

        $this->push = $push;

        $this->deliveryOrderRepository = $deliveryOrderRepository;

        $this->driverCalledRepository = $driverCalledRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->deliveryCallConfig = $this->deliveryCallConfigHelper->get(
            'time_in_seconds_to_call_driver',
            'time_in_seconds_to_pass_driver_call',
            'max_renew_list',
            'max_renew_all_drivers_list',
            'drivers_number_to_call_list');

        $this->mountPush();

        $orderId = $this->argument('deliveryOrder');

        /** @var DeliveryOrder $order */
        $order = $this->deliveryOrderRepository->findOrFail($orderId);

        $this->callDrivers($order);

        $this->comment(Inspiring::quote());
        return null;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     */
    private function callDrivers(DeliveryOrder $deliveryOrder): void
    {
        $deliveryOrder = $this->callDriversOneByOne($deliveryOrder);

        $this->callAllDriversAtOnce($deliveryOrder);
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return DeliveryOrder
     */
    private function callDriversOneByOne(DeliveryOrder $deliveryOrder)
    {
        $drivers_number_to_call_list = $this->deliveryCallConfig['drivers_number_to_call_list']['value'];

        $drivers = $this->driversCloseDeliveryOrderRepository
            ->findDriversClose($deliveryOrder, $drivers_number_to_call_list);

        $this->info('Iniciando chamamento com ' . $drivers->count() . ' entregadores');

        $countRenews = 0;
        $quantityDriversOnList = 0;
        $driversNotAnswered = [];

        while ($drivers->isNotEmpty() &&
            $countRenews <= ((int)$this->deliveryCallConfig['max_renew_list']['value'])) {

            /** @var DriversCloseDeliveryOrder $driver */
            $driver = $drivers->first();
            if (!$driver) {
                $this->info("Chamado encerrado");
                exit();
            }

            $driverCalled = $this->updateStatusOnCallOrder($deliveryOrder, $driver);

            /** @var DeliveryOrder $order */
            $order = $this->deliveryOrderRepository
                ->findFully($deliveryOrder->id);

            $this->info('enviando pedido para o realtime');
            $this->sendToRealtime($order);

            $this->notify($drivers->toArray());

            $this->waitDriverAnswer($driverCalled);

            /** tempo para chamar outro motorista */
            sleep((int)$this->deliveryCallConfig['time_in_seconds_to_pass_driver_call']['value']);

            $driverCalled = $this->syncStatusDriverCalled($driverCalled);

            if ($driverCalled->status == DriverCalledConstant::ACCEPTED)
                break;

            if ($driverCalled->status == DriverCalledConstant::CALLING)
                $this->driverCalledRepository
                    ->updateById($driverCalled->id, ['status' => DriverCalledConstant::NOT_ANSWERED]);

            $driversNotAnswered[] = $driverCalled->driverId;

            $quantityDriversOnList++;
            $renewedList = false;

            if ($quantityDriversOnList >= (int)$drivers_number_to_call_list) {
                $this->info("Chamando lista novamente");
                $countRenews++;
                $quantityDriversOnList = 0;
                $driversNotAnswered = [];
                $renewedList = true;
            }

            $drivers = $this->driversCloseDeliveryOrderRepository
                ->findDriversClose(
                    $deliveryOrder,
                    $drivers_number_to_call_list,
                    $driversNotAnswered);

            if ($drivers->isEmpty() && !$renewedList) {
                $this->info("Chamando lista novamente");
                $countRenews++;
                $quantityDriversOnList = 0;
                $driversNotAnswered = [];
                $drivers = $this->driversCloseDeliveryOrderRepository
                    ->findDriversClose(
                        $deliveryOrder,
                        $drivers_number_to_call_list);
            }

            $this->comment($drivers->count() . ' novos motoristas encontrados');
            $this->comment($countRenews . 'º renovação da lista');
            $this->comment($quantityDriversOnList . ' motoristas chamados na lista');
            $this->comment(count($driversNotAnswered) . ' motoristas que recusaram/não atenderam');
            $this->comment(implode(",", $driversNotAnswered));
        }

        $this->info("Nenhum motorista aceitou no chamado individual!");
        $this->info("Chamando todos no chamado dedo rápido");

        return $deliveryOrder;
    }

    private function callAllDriversAtOnce(DeliveryOrder $deliveryOrder)
    {
        $drivers = $this->driversCloseDeliveryOrderRepository
            ->findDriversClose($deliveryOrder, 0);

        $countRenews = 0;

        while ($drivers->isNotEmpty() &&
            $countRenews <= ((int)$this->deliveryCallConfig['max_renew_all_drivers_list'])) {

            $driversId = array_map(function ($driver) {
                return $driver['idDriver'];
            }, $drivers->toArray());

            $deliveryOrder->callingDriver = implode(",", $driversId);
            $deliveryOrder->save();

            /** @var Collection[DriverCalled] $driversCalled */
            $driversCalled = collect();

            foreach ($drivers as $driver) {
                $driverCalled = $this->updateStatusOnCallOrder($deliveryOrder, $driver, false);
                $driversCalled->push($driverCalled);
            }

            /** @var DeliveryOrder $deliveryOrder */
            $deliveryOrder = $this->deliveryOrderRepository
                ->findFully($deliveryOrder->id);

            $this->sendToRealtime($deliveryOrder);

            $deviceTokens = array_map(function ($driver) {
                return $driver['deviceToken'];
            }, $drivers->toArray());

            $this->push->notificationAllWithData($deviceTokens);

            $driverWhoAccepted = $this->waitAllDriverAnswer($deliveryOrder);

            if ($driverWhoAccepted && $driverWhoAccepted->status == DriverCalledConstant::ACCEPTED)
                break;

            $this->driverCalledRepository
                ->updateStatusByDeliveryOrder(
                    $deliveryOrder->id,
                    DriverCalledConstant::NOT_ANSWERED,
                    DriverCalledConstant::CALLING);

            $this->info("Chamando motoristas novamente");
            $drivers = $this->driversCloseDeliveryOrderRepository
                ->findDriversClose($deliveryOrder, 0);

            $countRenews++;
        }

        if ($drivers->isNotEmpty()) {
            $deliveryOrder->callingDriver = null;
            $deliveryOrder->save();
            $this->info("Nenhum motorista aceitou no chamado dedo rápido!");
        }else{
            $deliveryOrder->deliveryOrderStatusId = DeliveryOrderStatusConstant::IN_PREPARATION;
        }

        $this->sendToRealtime($deliveryOrder);

        $this->info("Chamado encerrado\n");
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @param DriversCloseDeliveryOrder $driverCloseDeliveryOrder
     * @param bool $updateDeliveryOrder
     * @return DriverCalled
     */
    private function updateStatusOnCallOrder(
        DeliveryOrder $deliveryOrder, DriversCloseDeliveryOrder $driverCloseDeliveryOrder, bool $updateDeliveryOrder = true): DriverCalled
    {
        $driverCalled = DriverCalled::firstOrCreate([
            'deliveryOrderId' => $deliveryOrder->id,
            'driverId' => $driverCloseDeliveryOrder->idDriver,
        ], [
            'status' => DriverCalledConstant::CALLING,
            'proximity' => $driverCloseDeliveryOrder->proximity,
        ]);

        if ($driverCalled->status == DriverCalledConstant::NOT_ANSWERED) {
            $driverCalled->status = DriverCalledConstant::CALLING;
            $driverCalled->save();
        }

        if ($updateDeliveryOrder) {
            $deliveryOrder->callingDriver = $driverCloseDeliveryOrder->idDriver;
            $deliveryOrder->save();
        }

        return $driverCalled;
    }

    /**
     * @param DriverCalled $driverCalled
     */
    private function waitDriverAnswer(DriverCalled $driverCalled): void
    {
        $timeActual = 1;

        while ($timeActual <= (int)$this->deliveryCallConfig['time_in_seconds_to_call_driver']['value']) {

            $driver = $this->driverCalledRepository
                ->getStatusDriver($driverCalled->id);

            if ($driver->status <> DriverCalledConstant::CALLING)
                break;

            $this->comment(" chamando motorista " . $driver->driverId . " time: " . $timeActual);

            sleep(1);

            $timeActual++;
        }
    }


    private function waitAllDriverAnswer(DeliveryOrder $deliveryOrder): ?DriverCalled
    {
        $timeActual = 1;
        $driverWhoAccepted = null;

        while ($timeActual <= (int)$this->deliveryCallConfig['time_in_seconds_to_call_driver']['value']) {
            /** @var Collection[DriverCalled] $drivers */
            $drivers = $this->driverCalledRepository
                ->getAllDriversByDeliveryOrder($deliveryOrder->id);

            $stop = false;

            /** @var DriverCalled $driver */
            foreach ($drivers as $driver) {
                if ($driver->status == DriverCalledConstant::ACCEPTED) {
                    $stop = true;
                    $driverWhoAccepted = $driver;
                    break;
                }
            }

            if ($stop)
                break;

            $this->comment(" chamando {$drivers->count()} motoristas. Time: " . $timeActual);
            sleep(1);

            $timeActual++;
        }

        return $driverWhoAccepted;
    }

    /**
     * @param DriverCalled $driverCalled
     * @return DriverCalled
     */
    private function syncStatusDriverCalled(DriverCalled $driverCalled): DriverCalled
    {
        /** @var DriverCalled $driverCalled */
        $driverCalled = $this->driverCalledRepository
            ->find($driverCalled->id);

        return $driverCalled;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return \TBolier\RethinkQL\Response\Cursor|\TBolier\RethinkQL\Response\ResponseInterface
     */
    private function sendToRealtime(DeliveryOrder $deliveryOrder)
    {
        if ($deliveryOrder->callingDriver)
            $deliveryOrder->callingDriver = explode(',', $deliveryOrder->callingDriver);

        return $this->orderRealtime
            ->update([
                'id' => $deliveryOrder->id
            ], $deliveryOrder->toArray());
    }

    /**
     * Notifica o próximo motorista
     * para abrir o app
     * @param $key
     * @param array $drivers
     * @return bool
     */
    private function notify(array $drivers)
    {
        $deviceTokens = array();

        $deviceTokens[] = $drivers[0]['deviceToken'];

        if (isset($drivers[1]))
            $deviceTokens[] = $drivers[1]['deviceToken'];

        $deviceTokens = array_filter($deviceTokens);

        $this->push->notificationAllWithData($deviceTokens);

        return true;
    }

    private function mountPush(): void
    {
        $pushConfig = $this->pushConfigHelper
            ->get('call_driver');

        $this->push
            ->setTitle($pushConfig['title'])
            ->setBody($pushConfig['message'])
            ->setAction($pushConfig['action'])
            ->setTag($pushConfig['tag'])
            ->setForceStart($pushConfig['forceStart'])
            ->setPriority($pushConfig['priority'])
            ->setIcon($pushConfig['icon'])
            ->setSoundname($pushConfig['soundName']);
    }
}
